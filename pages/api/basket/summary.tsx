import getBasketSummary from "@/backend/services/get-basket-summary";
import { RouteHandler } from "@/backend/utility/route-handler";
import { getCookie } from "cookies-next";

export default RouteHandler({
  async GET(req, res) {
    const sessionId = getCookie("session", { req, res })?.toString()!;
    const basketSummary = await getBasketSummary(sessionId);
    res.status(200).send(basketSummary);
  },
});
