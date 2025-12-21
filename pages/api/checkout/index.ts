import dbInstance from "@/backend/db";
import { getYocoApi } from "@/backend/services/checkout";
import getBasketSummary from "@/backend/services/get-basket-summary";
import generateOrderId from "@/backend/utility/generate-order-id";
import getMerchantId from "@/backend/utility/get-merchant-id";
import HttpException from "@/backend/utility/http-exception";
import { RouteHandler } from "@/backend/utility/route-handler";
import {
  Order,
  OrderBatch,
  OrderItem,
  Prisma,
  PrismaClient,
} from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { HttpStatusCode } from "axios";
import { getCookie } from "cookies-next";

type Transaction = Omit<
  PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends"
>;

export default RouteHandler({
  async GET(req, res) {
    const sessionId = getCookie("session", { req, res })?.toString()!;
    const merchantId = getMerchantId(req.headers);

    try {
      const order = await createOrder(sessionId, merchantId, req.body);
      const yocoApi = getYocoApi();

      const checkoutSession = await yocoApi.createCheckout({
        amountInCents: order.totalInCents,
        orderId: order.id,
        sessionId: sessionId,
        merchantId: merchantId,
      });

      res.redirect(checkoutSession.redirectUrl);
    } catch (err) {
      throw new HttpException(
        {
          messages: ["Failed to create checkout session"],
          success: false,
          data: null,
        },
        HttpStatusCode.InternalServerError
      );
    }
  },
});

async function createOrder(sessionId: string, merchantId: string, body: any) {
  const basketSummary = await getBasketSummary(sessionId);

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

  const orderData: Order = {
    id: generateOrderId(),
    createdAt: new Date(),
    paymentId: "",
    quantity: basketSummary.totalItems,
    serviceFeeInCents: 500,
    students: basketSummary.totalStudents,
    totalInCents: basketSummary.totalInCents + 500,
    merchantId: merchantId,
    totalBatches: orderBatches.length,
    completeBatches: 0,
    customerEmail: body.email,
    customerFirstName: body.firstName,
    customerLastName: body.lastName,
    notes: body.notes,
    isComplete: false,
    isPaid: false,
  };

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

  return order;
}
