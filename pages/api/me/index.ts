import dbInstance from "@/backend/db";
import { RouteHandler } from "@/backend/utility/route-handler";
import { getCookie } from "cookies-next";

export default RouteHandler({
  async GET(req, res) {
    const sessionId = getCookie("session", { req, res })?.toString()!;
    const session = await dbInstance.session.findFirst({
      where: { id: sessionId },
    });

    const { id, merchantId, createdAt, ...sessionDetail } = session!;

    res.status(200).send(sessionDetail);
  },
});
