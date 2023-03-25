import { RouteHandler } from "@/backend/utility/route-handler";

export default RouteHandler({
  GET(req, res) {
    res.status(200).send(["1A", "1B", "2A", "2B", "8 - 12 (Pickup)"]);
  },
});
