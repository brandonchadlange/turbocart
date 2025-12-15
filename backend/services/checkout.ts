import axios from "axios";

type CreateCheckoutRequest = {
  amountInCents: number;
  orderId: string;
  sessionId: string;
  merchantId: string;
};

type CreateCheckoutResponse = {
  id: string;
  redirectUrl: string;
};

export function getYocoApi() {
  const yocoApi = axios.create({
    baseURL: "https://payments.yoco.com",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.YOCO_PRIVATE_KEY}`,
    },
  });

  return {
    createCheckout: async (request: CreateCheckoutRequest) => {
      const successUrl = `http://cbctuckshop.localhost:3000/order-success`;

      try {
        const response = await yocoApi.request<CreateCheckoutResponse>({
          method: "POST",
          url: "/api/checkouts",
          data: {
            amount: request.amountInCents,
            currency: "ZAR",
            clientReferenceId: request.sessionId,
            successUrl,
            metadata: {
              orderId: request.orderId,
              sessionId: request.sessionId,
              merchantId: request.merchantId,
            },
          },
        });

        return response.data;
      } catch (err: any) {
        throw new Error("Failed to create checkout");
      }
    },
  };
}
