import dbInstance from "@/backend/db";
import { sendOrderConfirmationMail } from "@/backend/services/email";
import getBasketSummary from "@/backend/services/get-basket-summary";
import HttpException from "@/backend/utility/http-exception";
import { RouteHandler } from "@/backend/utility/route-handler";
import { captureException } from "@sentry/nextjs";
import { HttpStatusCode } from "axios";
import { DateTime } from "luxon";

type PaymentConfirmationBody = {
  createdDate: Date;
  id: string;
  type: "payment.succeeded";
  payload: {
    amount: number;
    createdDate: Date;
    currency: "ZAR";
    id: string;
    mode: "live" | "test";
    status: "succeeded";
    type: "payment";
    metadata: {
      orderId: string;
      sessionId: string;
      merchantId: string;
    };
  };
};

export default RouteHandler({
  async POST(req, res) {
    const body = req.body as PaymentConfirmationBody;

    const order = await dbInstance.order.findUnique({
      where: {
        id: body.payload.metadata.orderId,
        merchantId: body.payload.metadata.merchantId,
      },
    });

    if (!order) {
      captureException(
        new Error(
          `Order not found: ${body.payload.metadata.orderId} for merchant ${body.payload.metadata.merchantId}`
        )
      );

      throw new HttpException(
        {
          messages: ["Order not found"],
          success: false,
          data: {
            orderId: body.payload.metadata.orderId,
            merchantId: body.payload.metadata.merchantId,
          },
        },
        HttpStatusCode.NotFound
      );
    }

    await dbInstance.order.update({
      where: {
        id: order.id,
      },
      data: {
        paymentId: body.payload.id,
        isPaid: true,
      },
    });

    const basketSummary = await getBasketSummary(
      body.payload.metadata.sessionId
    );

    const orderDateTime = DateTime.fromJSDate(order.createdAt).toLocaleString({
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
        ? `http://${order.merchantId}.localhost:3000/view-order?reference=${order.id}`
        : `https://${order.merchantId}.turbocart.co.za/view-order?reference=${order.id}`;

    // Send confirmation mail
    await sendOrderConfirmationMail(order.customerEmail, {
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

    // Cleanup session
    const session = await dbInstance.session.findUnique({
      where: {
        id: body.payload.metadata.sessionId,
      },
    });

    if (!session) return res.status(200).send("ok");

    await dbInstance.basket.deleteMany({
      where: {
        sessionId: session.id,
      },
    });

    if (!session.rememberDetails) {
      await dbInstance.session.delete({
        where: {
          id: session.id,
        },
      });
    }

    res.status(200).send("ok");
  },
});
