import dbInstance from "@/backend/db";
import { sendOrderConfirmationMail } from "@/backend/services/email";
import getBasketSummary from "@/backend/services/get-basket-summary";
import generateOrderId from "@/backend/utility/generate-order-id";
import getMerchantId from "@/backend/utility/get-merchant-id";
import HttpException from "@/backend/utility/http-exception";
import { RouteHandler } from "@/backend/utility/route-handler";
import { OrderBatch, OrderItem } from "@prisma/client";
import { captureException } from "@sentry/nextjs";
import axios, { HttpStatusCode } from "axios";
import { getCookie, setCookie } from "cookies-next";
import { DateTime } from "luxon";

export default RouteHandler({
  async GET(req, res) {
    const orderId = req.query.reference as string;

    const orderItems = await dbInstance.orderItem.findMany({
      where: {
        orderId: orderId,
      },
      include: {
        batch: true,
      },
    });

    const productIdList = orderItems.map((e) => e.productId);

    const orderItemListings = await dbInstance.listing.findMany({
      where: {
        id: {
          in: productIdList,
        },
      },
    });

    res.send({
      orderItems,
      orderItemListings,
    });
  },
  async POST(req, res) {
    const sessionId = getCookie("session", { req, res })?.toString()!;
    const merchantId = getMerchantId(req.headers);

    const paymentMethod = (await dbInstance.paymentMethod.findFirst({
      where: {
        id: req.body.paymentMethodId,
      },
    })) as any;

    paymentMethod.configuration = JSON.parse(paymentMethod.configuration);

    const basketSummary = await getBasketSummary(sessionId);

    // Make Payment
    const payment = await tryMakePayment({
      token: req.body.token,
      secretKey: paymentMethod.configuration.secretKey as string,
      totalInCents: basketSummary.totalInCents + 500,
    });

    if (!payment.success) {
      throw new HttpException(
        {
          data: payment.response,
          success: false,
        },
        HttpStatusCode.FailedDependency
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

    const variantIdList = basketItems.map((e) => e.variantId);

    const variantsWithListing = await dbInstance.listingVariant.findMany({
      where: {
        id: {
          in: variantIdList,
        },
      },
      include: {
        Listing: true,
      },
    });

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
          fulfilled: false,
        });

        batch = orderBatches[orderBatches.length - 1];
      }

      const variant = variantsWithListing.find(
        (variant) => variant.id === basketItem.variantId
      )!;

      batch.items!.push({
        pricePerItemInCents: variant.Listing.priceInCents,
        productId: basketItem.productId,
        quantity: basketItem.quantity,
        variantId: basketItem.variantId,
      });
    });

    const orderData = {
      id: generateOrderId(),
      createdAt: new Date(),
      paymentId: payment.response.id,
      quantity: basketSummary.totalItems,
      serviceFeeInCents: 500,
      students: basketSummary.totalStudents,
      totalInCents: basketSummary.totalInCents + 500,
      merchantId: merchantId,
      totalBatches: orderBatches.length,
      completeBatches: 0,
      customerEmail: req.body.email,
      customerFirstName: req.body.firstName,
      customerLastName: req.body.lastName,
      notes: req.body.notes,
    };

    // Construct Order
    const order = await dbInstance.order.create({
      data: orderData,
    });

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
          variantId: bi.variantId!,
          pricePerItemInCents: bi.pricePerItemInCents!,
          quantity: bi.quantity!,
        })),
      });
    }

    const orderDateTime = DateTime.fromJSDate(
      orderData.createdAt
    ).toLocaleString({
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    });

    const currencyFormatter = Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ZAR",
      currencyDisplay: "narrowSymbol",
    });

    const formatCurrency = (valueInCents: number) => {
      const valueInFull = parseFloat((valueInCents / 100).toFixed(2));
      return currencyFormatter.format(valueInFull);
    };

    const viewOrderUrl =
      process.env.NODE_ENV === "development"
        ? `http://${merchantId}.localhost:3000/view-order?reference=${order.id}`
        : `https://${merchantId}.turbocart.co.za/view-order?reference=${order.id}`;

    // Send confirmation mail
    await sendOrderConfirmationMail(orderData.customerEmail, {
      orderId: order.id,
      orderDateTime,
      totals: {
        serviceFee: formatCurrency(order.serviceFeeInCents),
        subtotal: formatCurrency(order.totalInCents - order.serviceFeeInCents),
        total: formatCurrency(order.totalInCents),
      },
      items: basketSummary.items.map((e) => ({
        name: e.variant.name,
        price: formatCurrency(e.totalInCents),
        quantity: e.quantity,
      })),
      links: {
        order: viewOrderUrl,
      },
    });

    await triggerOrderPlacedWebhook(order.id);

    // Cleanup session
    const rememberDetails = req.body.rememberDetails as boolean;

    const currentSessionStudents = await dbInstance.student.findMany({
      where: {
        sessionId,
      },
    });

    await dbInstance.session.delete({
      where: {
        id: sessionId,
      },
    });

    const newSession = await dbInstance.session.create({
      data: {
        createdAt: new Date(),
        merchantId: merchantId,
        customerFirstName: rememberDetails ? orderData.customerFirstName : "",
        customerLastName: rememberDetails ? orderData.customerLastName : "",
        customerEmail: rememberDetails ? orderData.customerEmail : "",
        rememberDetails: rememberDetails,
      },
    });

    if (rememberDetails) {
      await dbInstance.student.createMany({
        data: currentSessionStudents.map((student) => ({
          sessionId: newSession.id,
          firstName: student.firstName,
          lastName: student.lastName,
          grade: student.grade,
        })),
      });
    }

    setCookie("session", newSession.id, { req, res });

    res.status(201).send(order);
  },
});

const tryMakePayment = async (data: {
  token: string;
  secretKey: string;
  totalInCents: number;
}) => {
  try {
    const paymentResponse = await axios.request({
      method: "POST",
      url: "https://online.yoco.com/v1/charges/",
      headers: {
        "X-Auth-Secret-Key": data.secretKey,
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
  } catch (err: any) {
    await captureException({
      message: "Failed to make payment",
      error: err.response.data,
    });

    return {
      success: false,
      response: err.response.data,
    };
  }
};

async function triggerOrderPlacedWebhook(orderId: string) {
  try {
    await axios.post(process.env.WEBHOOK_URL as string, {
      type: "order.created",
      data: {
        orderId: orderId,
      },
    });
  } catch (err) {
    console.log(err);
  }
}
