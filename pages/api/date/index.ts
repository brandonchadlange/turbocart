import { RouteHandler } from "@/backend/utility/route-handler";
import { DateTime } from "luxon";

const TMP_TIME_FILTER = 9;

export default RouteHandler({
  async GET(req, res) {
    const response: any[] = [];
    let now = DateTime.now().setLocale("en-ZA");
    let weekDayNumber = now.weekday;
    let startOfWeek =
      weekDayNumber === 7 ? now : now.minus({ days: weekDayNumber });

    const hourExceeded = now.hour >= TMP_TIME_FILTER;

    for (var i = 0; i < 5; i++) {
      const dayToAdd = startOfWeek.plus({ days: i + 1 });
      let status = "complete";

      if (now.weekday - dayToAdd.weekday === 0) {
        status = hourExceeded ? "complete" : "today";
      } else if (now.weekday - dayToAdd.weekday === -1 && hourExceeded) {
        status = "today";
      } else if (now.weekday - dayToAdd.weekday < 0) {
        status = "future";
      }

      response.push({
        date: dayToAdd.toFormat("LLL dd"),
        weekNumber: dayToAdd.weekNumber,
        dateCode: dayToAdd.toFormat("yyyy-MM-dd"),
        weekDay: dayToAdd.weekdayShort,
        day: dayToAdd.day,
        status: status,
      });
    }

    res.send({
      dates: response,
    });
  },
});
