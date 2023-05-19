import dbInstance from "@/backend/db";
import { RouteHandler } from "@/backend/utility/route-handler";

export default RouteHandler({
  async GET(req, res) {
    const listingsByGroup = await dbInstance.filterValue.findMany({
      include: {
        listingFilterValues: {
          include: {
            listing: true,
          },
        },
      },
      where: {
        listingFilterValues: {},
      },
    });

    const listings = await dbInstance.listing.groupBy({
      by: ["name"],
    });
  },
});
