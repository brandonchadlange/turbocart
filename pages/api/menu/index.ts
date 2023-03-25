import menu from "@/backend/data/menu";
import { RouteHandler } from "@/backend/utility/route-handler";

export default RouteHandler({
  async GET(req, res) {
    res.status(200).send(menu);
  },
});
