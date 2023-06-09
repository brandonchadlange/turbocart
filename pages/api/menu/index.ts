import dbInstance from "@/backend/db";
import getMerchantId from "@/backend/utility/get-merchant-id";
import { RouteHandler } from "@/backend/utility/route-handler";

export default RouteHandler({
  async GET(req, res) {
    const merchantId = getMerchantId(req.headers);

    const menuList = await dbInstance.menu.findMany({
      where: {
        merchantId,
      },
    });

    res.status(200).send(menuList);
  },
});
