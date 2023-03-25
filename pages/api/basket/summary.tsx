import dbInstance from "@/backend/db";
import { RouteHandler } from "@/backend/utility/route-handler";
import { getCookie } from "cookies-next";
import products from "@/backend/data/products";
import getBasketSummary from "@/backend/services/get-basket-summary";

export default RouteHandler({
  async GET(req, res) {
    const sessionId = getCookie("session", { req, res })?.toString()!;
    const basketSummary = await getBasketSummary(sessionId, products);
    res.status(200).send(basketSummary);
  },
});
