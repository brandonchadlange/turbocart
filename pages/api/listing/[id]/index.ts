import dbInstance from "@/backend/db";
import { RouteHandler } from "@/backend/utility/route-handler";

export default RouteHandler({
  async GET(req, res) {
    const listingId = req.query.id as string;

    const listing = await dbInstance.listing.findFirst({
      where: {
        id: listingId,
      },
    });

    const variants = await dbInstance.listingVariant.findMany({
      where: {
        listingId,
        deleted: false,
      },
    });

    res.status(200).send({
      ...listing,
      variants,
    });
  },
});
