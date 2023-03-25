import dbInstance from "@/backend/db";
import { RouteHandler } from "@/backend/utility/route-handler";
import { getCookie } from "cookies-next";
import products from "@/backend/data/products";
import menus from "@/backend/data/menu";

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

    basketItems.forEach((item: any) => {
      item.product = products.find((product) => product.id === item.productId)!;
      item.menu = menus.find((menu) => menu.id === item.menuId);
    });

    res.status(200).send(basketItems);
  },
});
