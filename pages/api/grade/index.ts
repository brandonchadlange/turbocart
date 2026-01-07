import { RouteHandler } from "@/backend/utility/route-handler";

export default RouteHandler({
  GET(req, res) {
    res
      .status(200)
      .send([
        "RM",
        "1P",
        "1D",
        "2DT",
        "3B",
        "3G",
        "4G",
        "4L",
        "5A",
        "5V",
        "6C",
        "6J",
        "7A",
        "7C",
        "8 - 12 (pickup)",
      ]);
  },
});
