import dbInstance from "@/backend/db";
import { RouteHandler } from "@/backend/utility/route-handler";
import { getCookie } from "cookies-next";

export default RouteHandler({
  async GET(req, res) {
    const sessionId = getCookie("session", { req, res })?.toString()!;

    const basketItems = await dbInstance.basket.findMany({
      where: {
        sessionId,
      },
      include: {
        student: true,
      },
      orderBy: {
        student: {
          firstName: "asc",
        },
      },
    });

    const variantIdList = basketItems.map((e) => e.variantId);

    const variants = await dbInstance.listingVariant.findMany({
      where: {
        id: {
          in: variantIdList,
        },
      },
      include: {
        Listing: true,
      },
    });

    const menus = await dbInstance.menu.findMany();

    basketItems.forEach((item: any) => {
      item.variant = variants.find((variant) => variant.id === item.variantId)!;
      item.menu = menus.find((menu) => menu.id === item.menuId);
    });

    res.status(200).send(basketItems);
  },
});
