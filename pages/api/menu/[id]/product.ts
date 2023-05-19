import dbInstance from "@/backend/db";
import { RouteHandler } from "@/backend/utility/route-handler";

export default RouteHandler({
  async GET(req, res) {
    const menuId = req.query.id as string;

    const categoriesWithListings = await dbInstance.menuCategory.findMany({
      where: {
        menuId: menuId,
      },
      include: {
        category: {
          include: {
            listingCategory: {
              include: {
                Listing: true,
              },
            },
          },
        },
      },
      orderBy: {
        rank: "asc",
      },
    });

    let response: Category[] = categoriesWithListings.map((e) => ({
      id: e.category.id,
      name: e.category.name,
      items: e.category.listingCategory
        .filter((lc) => lc.Listing.published)
        .map((lc) => ({
          id: lc.Listing.id,
          name: lc.Listing.name,
          description: lc.Listing.description,
          priceInCents: lc.Listing.priceInCents,
        })),
    }));

    res.status(200).send(response);
  },
});
