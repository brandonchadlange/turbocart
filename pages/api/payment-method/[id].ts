import dbInstance from "@/backend/db";
import getMerchantId from "@/backend/utility/get-merchant-id";
import { RouteHandler } from "@/backend/utility/route-handler";

export default RouteHandler({
  async GET(req, res) {
    const merchantId = getMerchantId(req.headers);
    const paymentMethodId = req.query.id as string;

    const paymentMethod = (await dbInstance.paymentMethod.findFirst({
      where: {
        id: paymentMethodId,
      },
      select: {
        id: true,
        configuration: true,
        name: true,
        description: true,
        provider: true,
      },
    })) as any;

    paymentMethod!.configuration = JSON.parse(paymentMethod!.configuration);

    if (paymentMethod?.provider === "yoco") {
      delete paymentMethod.configuration.secretKey;
    }

    res.status(200).send(paymentMethod);
  },
});
