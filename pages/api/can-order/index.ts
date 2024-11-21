import dbInstance from "@/backend/db";
import { RouteHandler } from "@/backend/utility/route-handler";
import { getCookie } from "cookies-next";
import { DateTime } from "luxon";
import { TMP_TIME_HOUR_FILTER, TMP_TIME_MINUTE_FILTER } from "../date";

export default RouteHandler({
  async GET(req, res) {
    const sessionId = getCookie("session", { req, res })?.toString()!;

    const basketItems = await dbInstance.basket.findMany({
      where: {
        sessionId: sessionId,
      },
    });

    const now = DateTime.now().setZone('Africa/Johannesburg');
    const nowDateId = now.toFormat("yyyy-LL-dd");

    const itemsForToday = basketItems.filter((e) => e.dateId === nowDateId);

    if (
      itemsForToday.length > 0 &&
      (now.hour > TMP_TIME_HOUR_FILTER ||
        (now.hour === TMP_TIME_HOUR_FILTER &&
          now.minute > TMP_TIME_MINUTE_FILTER))
    ) {
      res.status(200).send({ canOrder: false, items: itemsForToday });
      return;
    }

    res.status(200).send({ canOrder: true, items: itemsForToday, minute: now.minute, hour: now.hour, });
  },
});
