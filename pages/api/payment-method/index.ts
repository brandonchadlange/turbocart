import dbInstance from "@/backend/db";
import getMerchantId from "@/backend/utility/get-merchant-id";
import { RouteHandler } from "@/backend/utility/route-handler";

export default RouteHandler({
  async GET(req, res) {
    const merchantId = getMerchantId(req.headers);

    const paymentMethods = await dbInstance.paymentMethod.findMany({
      where: {
        merchantId,
        enabled: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        provider: true,
      },
    });

    res.status(200).send(paymentMethods);
  },
});
