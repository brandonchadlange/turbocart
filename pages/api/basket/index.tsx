import dbInstance from "@/backend/db";
import { RouteHandler } from "@/backend/utility/route-handler";
import { HttpStatusCode } from "axios";
import { getCookie } from "cookies-next";

export default RouteHandler({
  async GET(req, res) {
    const sessionId = getCookie("session", { req, res })?.toString()!;

    const basketItems = await dbInstance.basket.findMany({
      where: {
        sessionId: sessionId,
      },
    });

    const responseCode =
      basketItems.length > 0 ? HttpStatusCode.Ok : HttpStatusCode.NoContent;

    res.status(responseCode).send(basketItems);
  },
  async POST(req, res) {
    const sessionId = getCookie("session", { req, res })?.toString()!;
    const { productId, quantity, options, menuId, dateIdList } =
      req.body as AddToBasketRequest; // Quantity contains an object of student ids and quantity values

    const addToBasketReqests = [];

    for await (const dateId of dateIdList) {
      const tmp = Object.keys(quantity)
        .filter((studentId) => {
          const studentQuantity = quantity[studentId];
          return studentQuantity > 0;
        })
        .map((studentId) => {
          const studentQuantity = quantity[studentId];

          return new Promise(async (resolve, reject) => {
            const existingItem = await dbInstance.basket.findFirst({
              where: {
                sessionId,
                dateId,
                studentId: studentId.toString(),
                productId,
                menuId,
              },
            });

            if (existingItem === null) {
              await dbInstance.basket.create({
                data: {
                  sessionId,
                  dateId,
                  studentId: studentId.toString(),
                  productId,
                  quantity: studentQuantity,
                  menuId,
                },
              });

              resolve(null);
              return;
            }

            await dbInstance.basket.update({
              where: {
                id: existingItem.id,
              },
              data: {
                quantity: existingItem.quantity + studentQuantity,
              },
            });

            resolve(null);
            return;
          });
        });

      addToBasketReqests.push(...tmp);
    }

    await Promise.all(addToBasketReqests);

    res.status(201).send("Successfully added to basket.");
  },
});
