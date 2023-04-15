import { RouteHandler } from "@/backend/utility/route-handler";
import { DateTime } from "luxon";

export default RouteHandler({
  async GET(req, res) {
    const response: any[] = [];
    const now = DateTime.now().setLocale("en-ZA");
    let weekDayNumber = now.weekday;
    const currentHour = now.hour;
    let startOfWeek =
      weekDayNumber > 5
        ? now.plus({ days: 7 - weekDayNumber })
        : now.minus({ days: weekDayNumber });

    if (weekDayNumber === 5) {
      startOfWeek = now.plus({ days: 2 });
      weekDayNumber = startOfWeek.weekday;
    }

    for (var i = 0; i < 5; i++) {
      // if (i >= weekDayNumber) {
      const dayToAdd = startOfWeek.plus({ days: i + 1 });
      let status = "complete";

      if (now.weekday - dayToAdd.weekday === 0) {
        status = "today";
      }

      if (now.weekday - dayToAdd.weekday < 0) {
        status = "future";
      }

      if (now.weekday - dayToAdd.weekday === -1) {
        status = "tomorrow";
      }

      response.push({
        date: dayToAdd.toFormat("LLL dd"),
        weekNumber: dayToAdd.weekNumber,
        dateCode: dayToAdd.toFormat("yyyy-MM-dd"),
        weekDay: dayToAdd.weekdayShort,
        day: dayToAdd.day,
        status,
      });
      // }
    }

    const options = [];

    if (weekDayNumber === 6) {
      options.push({
        label: "Monday",
        value: response[0].dateCode,
        ...response[0],
      });
    }

    if (weekDayNumber === 7) {
      options.push({
        label: `Tomorrow`,
        value: response[0].dateCode,
        ...response[0],
      });
    }

    if (weekDayNumber < 5) {
      if (currentHour < 10) {
        options.push({
          label: "Today",
          value: response[0].dateCode,
          ...response[0],
        });
      }

      options.push({
        label: "Tomorrow",
        value: response[0].dateCode,
        ...response[0],
      });
    }

    options.push({
      label: "Custom",
      value: "custom",
      ...response[0],
    });

    res.send({
      options,
      dates: response,
    });
  },
});
