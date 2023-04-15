import dbInstance from "@/backend/db";
import { RouteHandler } from "@/backend/utility/route-handler";
import { getCookie } from "cookies-next";

export default RouteHandler({
  async DELETE(req, res) {
    const sessionId = getCookie("session", { req, res })?.toString()!;
    const basketItemId = req.query.id as string;

    await dbInstance.basket.delete({
      where: {
        id: basketItemId,
      },
    });

    res.status(200).send(true);
  },
});
