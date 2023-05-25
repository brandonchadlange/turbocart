import { RouteHandler } from "@/backend/utility/route-handler";
import { DateTime } from "luxon";

const TMP_TIME_HOUR_FILTER = 8;
const TMP_TIME_MINUTE_FILTER = 30;

export default RouteHandler({
  async GET(req, res) {
    const response: any[] = [];
    let now = DateTime.now().setLocale("en-ZA");
    let weekDayNumber = now.weekday;
    let startOfWeek =
      weekDayNumber === 7 ? now : now.minus({ days: weekDayNumber });

    const inCurrentHour = now.hour === TMP_TIME_HOUR_FILTER;
    const hourExceeded = now.hour > TMP_TIME_HOUR_FILTER;
    const minuteExceeded = now.minute >= TMP_TIME_MINUTE_FILTER;

    const periodExceeded = (inCurrentHour && minuteExceeded) || hourExceeded;

    for (var i = 0; i < 5; i++) {
      const dayToAdd = startOfWeek.plus({ days: i + 1 });
      let status = "complete";

      if (now.weekday - dayToAdd.weekday === 0) {
        status = periodExceeded ? "complete" : "today";
      } else if (now.weekday - dayToAdd.weekday === -1 && periodExceeded) {
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
