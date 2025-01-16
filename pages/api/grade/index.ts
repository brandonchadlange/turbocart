import { RouteHandler } from "@/backend/utility/route-handler";

// OLD GRADES
// "Little Mount",
// "RR R",
// "RR M",
// "RR P",
// "RN",
// "1S",
// "1F",
// "2D",
// "2DT",
// "3W",
// "3P",
// "4L",
// "4R",
// "5H",
// "5M",
// "6K",
// "6L",
// "7S",
// "7SK",
// "8 - 12 (pickup)",

export default RouteHandler({
  GET(req, res) {
    res
      .status(200)
      .send([
        "Little Mount",
        "RR RR",
        "R RV",
        "R RG",
        "1S",
        "2D",
        "2DT",
        "3P",
        "3W",
        "4 - 7 (pickup)",
        "8 - 12 (pickup)",
      ]);
  },
});
