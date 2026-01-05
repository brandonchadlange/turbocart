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
      const merchantId = request.merchantId;

      const successUrl = `https://${merchantId}.turbocart.co.za/order-success?orderId=${request.orderId}`;
      const cancelUrl = `https://${merchantId}.turbocart.co.za/api/order-cancelled?orderId=${request.orderId}`;
      const failureUrl = `https://${merchantId}.turbocart.co.za/api/order-failed?orderId=${request.orderId}`;

      try {
        const response = await yocoApi.request<CreateCheckoutResponse>({
          method: "POST",
          url: "/api/checkouts",
          data: {
            amount: request.amountInCents,
            currency: "ZAR",
            clientReferenceId: request.sessionId,
            successUrl,
            cancelUrl,
            failureUrl,
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
