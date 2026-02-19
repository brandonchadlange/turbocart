import dbInstance from "@/backend/db";
import getMerchantId from "@/backend/utility/get-merchant-id";
import { RouteHandler } from "@/backend/utility/route-handler";

export default RouteHandler({
  async GET(req, res) {
    const orderId = req.query.orderId as string;
    const merchantId = getMerchantId(req.headers);

    const order = await dbInstance.order.findUnique({
      where: {
        id: orderId,
        merchantId: merchantId,
      },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (!order.isPaid) {
      await dbInstance.order.delete({
        where: {
          id: orderId,
          merchantId: merchantId,
        },
      });
    }

    res.redirect(`https://${merchantId}.turbocart.co.za/confirmation`);
  },
});
