import dbInstance from "@/backend/db";
import { RouteHandler } from "@/backend/utility/route-handler";

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
});
