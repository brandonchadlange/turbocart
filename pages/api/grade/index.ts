import { RouteHandler } from "@/backend/utility/route-handler";

export default RouteHandler({
  GET(req, res) {
    res
      .status(200)
      .send([
        "Little Mount",
        "RS",
        "RM",
        "1E",
        "1C",
        "2D",
        "2DT",
        "3W",
        "3P",
        "4R",
        "4N",
        "5H",
        "5L",
        "6M",
        "6S",
        "7S",
        "7V",
        "8 - 12 (pickup)",
      ]);
  },
});
