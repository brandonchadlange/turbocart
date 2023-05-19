import dbInstance from "@/backend/db";
import { HttpStatusCode } from "axios";
import { getCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";

export async function fetchBasketController(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const sessionId = getCookie("session", { req, res })?.toString()!;

  const basketItems = await dbInstance.basket.findMany({
    where: {
      sessionId: sessionId,
    },
  });

  if (basketItems.length === 0) {
    return res.status(HttpStatusCode.NoContent).send(basketItems);
  }

  res.send(basketItems);
}
