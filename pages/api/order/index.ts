import products from "@/backend/data/products";
import dbInstance from "@/backend/db";
import getBasketSummary from "@/backend/services/get-basket-summary";
import generateOrderId from "@/backend/utility/generate-order-id";
import getMerchantId from "@/backend/utility/get-merchant-id";
import HttpException from "@/backend/utility/http-exception";
import { RouteHandler } from "@/backend/utility/route-handler";
import { Order, OrderBatch, OrderItem } from "@prisma/client";
import { captureException } from "@sentry/nextjs";
import axios from "axios";
import { getCookie, setCookie } from "cookies-next";

export default RouteHandler({
  async GET(req, res) {
    const orderId = req.query.order as string;
    res.send(generateOrderId());
  },
  async POST(req, res) {
    const sessionId = getCookie("session", { req, res })?.toString()!;
    const merchantId = getMerchantId(req.headers);

    const basketSummary = await getBasketSummary(sessionId, products);

    // Make Payment
    const payment = await tryMakePayment({
      token: req.body.token,
      totalInCents: basketSummary.totalInCents + 1200,
    });

    if (!payment.success) {
      throw new HttpException(
        {
          data: null,
          success: false,
          messages: ["Failed to make payment"],
        },
        424
      );
    }

    const orderBatches: Partial<
      OrderBatch & { studentId: string; items: Partial<OrderItem>[] }
    >[] = [];

    const basketItems = await dbInstance.basket.findMany({
      where: {
        sessionId: sessionId,
      },
      include: {
        student: true,
      },
    });

    console.log("Basket Items");

    basketItems.forEach((basketItem) => {
      let batch = orderBatches.find((e) => {
        return (
          e.dateId === basketItem.dateId &&
          e.menuId === basketItem.menuId &&
          e.studentId === basketItem.studentId
        );
      });

      if (batch === undefined) {
        orderBatches.push({
          dateId: basketItem.dateId,
          menuId: basketItem.menuId,
          studentId: basketItem.studentId,
          studentFirstName: basketItem.student.firstName,
          studentLastName: basketItem.student.lastName,
          studentGrade: basketItem.student.grade,
          items: [],
        });

        batch = orderBatches[orderBatches.length - 1];
      }

      const product = products.find(
        (product) => product.id === basketItem.productId
      )!;

      batch.items!.push({
        pricePerItemInCents: product.priceInCents,
        productId: basketItem.productId,
        quantity: basketItem.quantity,
      });
    });

    // Construct Order
    const order = await dbInstance.order.create({
      data: {
        id: generateOrderId(),
        createdAt: new Date(),
        paymentId: payment.response.id,
        quantity: basketSummary.totalItems,
        serviceFeeInCents: 1200,
        students: basketSummary.totalStudents,
        totalInCents: basketSummary.totalInCents + 1200,
        merchantId: merchantId,
        totalBatches: orderBatches.length,
        completeBatches: 0,
      },
    });

    console.log("Order created");

    for await (const batch of orderBatches) {
      const newBatch = await dbInstance.orderBatch.create({
        data: {
          orderId: order!.id,
          dateId: batch.dateId!,
          menuId: batch.menuId!,
          studentFirstName: batch.studentFirstName!,
          studentLastName: batch.studentLastName!,
          studentGrade: batch.studentGrade!,
        },
      });

      await dbInstance.orderItem.createMany({
        data: batch.items!.map((bi) => ({
          orderBatchId: newBatch.id,
          orderId: order.id,
          productId: bi.productId!,
          pricePerItemInCents: bi.pricePerItemInCents!,
          quantity: bi.quantity!,
        })),
      });
    }

    console.log("Batches created");

    // Cleanup session
    await dbInstance.session.delete({
      where: {
        id: sessionId,
      },
    });

    console.log("Session deleted");

    const newSession = await dbInstance.session.create({
      data: {
        createdAt: new Date(),
        merchantId: merchantId,
      },
    });

    setCookie("session", newSession.id, { req, res });

    console.log("Session created");

    res.status(201).send("Order successfully created!");
  },
});

const tryMakePayment = async (data: {
  token: string;
  totalInCents: number;
}) => {
  try {
    const paymentResponse = await axios.request({
      method: "POST",
      url: "https://online.yoco.com/v1/charges/",
      headers: {
        "X-Auth-Secret-Key": "sk_test_960bfde0VBrLlpK098e4ffeb53e1", // TODO: BECOME ENV VARIABLE
      },
      data: {
        token: data.token,
        amountInCents: data.totalInCents,
        currency: "ZAR",
      },
    });

    if (paymentResponse.data.status !== "successful") {
      return {
        success: false,
        response: null,
      };
    }

    return {
      success: true,
      response: paymentResponse.data,
    };
  } catch (err) {
    await captureException({
      message: "Failed to make payment",
      error: err,
    });

    return {
      success: false,
      response: null,
    };
  }
};
