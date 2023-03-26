import products from "@/backend/data/products";
import dbInstance from "@/backend/db";
import getBasketSummary from "@/backend/services/get-basket-summary";
import generateOrderId from "@/backend/utility/generate-order-id";
import HttpException from "@/backend/utility/http-exception";
import { RouteHandler } from "@/backend/utility/route-handler";
import axios from "axios";
import { getCookie, setCookie } from "cookies-next";

export default RouteHandler({
  async GET(req, res) {
    const orderId = req.query.order as string;
    res.send(generateOrderId());
  },
  async POST(req, res) {
    const sessionId = getCookie("session", { req, res })?.toString()!;
    const host = req.headers.host!;
    const merchantId = host.split(".")[0];

    const basketSummary = await getBasketSummary(sessionId, products);

    // Make Payment
    const payment = await tryMakePayment({
      token: req.body.token,
      totalInCents: basketSummary.totalInCents,
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

    // Construct Order
    const order = await dbInstance.order.create({
      data: {
        id: generateOrderId(),
        createdAt: new Date(),
        paymentId: payment.response.id,
        quantity: basketSummary.totalItems,
        students: basketSummary.totalStudents,
        totalInCents: basketSummary.totalInCents,
      },
    });

    const basketItems = await dbInstance.basket.findMany({
      where: {
        sessionId: sessionId,
      },
    });

    const basketItemMap = basketItems.map((item) => {
      return new Promise(async (resolve, reject) => {
        const product = products.find(
          (product) => product.id === item.productId
        )!;

        await dbInstance.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            menuId: item.menuId,
            dateId: item.dateId,
            pricePerItemInCents: product.priceInCents,
            quantity: item.quantity,
          },
        });

        resolve(null);
      });
    });

    await Promise.all(basketItemMap);

    // Cleanup session
    await dbInstance.session.delete({
      where: {
        id: sessionId,
      },
    });

    const newSession = await dbInstance.session.create({
      data: {
        createdAt: new Date(),
        merchantId: merchantId,
      },
    });

    setCookie("session", newSession.id, { req, res });
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
    return {
      success: false,
      response: null,
    };
  }
};
