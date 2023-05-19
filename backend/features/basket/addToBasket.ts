import dbInstance from "@/backend/db";
import { getVariants } from "@/backend/utility/get-variants";
import { getCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";

type StudentQuantity = Record<any, number>;

type AddToBasketRequest = {
  sessionId: string;
  productId: string;
  quantity: StudentQuantity;
  menuId: string;
  dateIdList: string[];
  variantId: string;
};

type StudentDateVariant = {
  date: string;
  student: string;
};

export async function addToBasketController(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { quantity, dateIdList, sessionId, productId, variantId, menuId } =
    getRequest(req, res);

  const studentIdList = getStudentIdListWithoutZeroQuantity(quantity);
  const variants = getStudentDateVariants(studentIdList, dateIdList);

  for (const variant of variants) {
    const studentQuantity = quantity[variant.student];

    const existingBasketItem = await getExistingBasketItemIfExists({
      sessionId,
      productId,
      variantId,
      menuId,
      dateId: variant.date,
      studentId: variant.student,
    });

    if (existingBasketItem === null) {
      await createBasketItem({
        sessionId,
        productId,
        variantId,
        menuId,
        dateId: variant.date,
        studentId: variant.student,
        quantity: studentQuantity,
      });

      continue;
    }

    await increaseBasketItemQuantity(
      existingBasketItem.id,
      existingBasketItem.quantity,
      studentQuantity
    );
  }

  res.status(201).send("Successfully added to basket");
}

function getRequest(
  req: NextApiRequest,
  res: NextApiResponse
): AddToBasketRequest {
  const sessionId = getCookie("session", { req, res })?.toString()!;
  const { productId, variantId, menuId, dateIdList, quantity } = req.body;

  return {
    sessionId,
    productId,
    variantId,
    menuId,
    dateIdList,
    quantity,
  };
}

function getStudentIdListWithoutZeroQuantity(quantity: StudentQuantity) {
  return Object.keys(quantity).filter((studentId) => quantity[studentId] > 0);
}

function getStudentDateVariants(
  studentIdList: string[],
  dateIdList: string[]
): StudentDateVariant[] {
  const variantObj = {
    student: studentIdList,
    date: dateIdList,
  };

  return getVariants(variantObj);
}

function getExistingBasketItemIfExists(query: {
  sessionId: string;
  productId: string;
  variantId: string;
  menuId: string;
  dateId: string;
  studentId: string;
}) {
  return dbInstance.basket.findFirst({
    where: query,
  });
}

async function createBasketItem(data: {
  sessionId: string;
  productId: string;
  variantId: string;
  menuId: string;
  dateId: string;
  studentId: string;
  quantity: number;
}) {
  await dbInstance.basket.create({
    data: {
      sessionId: data.sessionId,
      productId: data.productId,
      variantId: data.variantId,
      menuId: data.menuId,
      dateId: data.dateId,
      studentId: data.studentId,
      quantity: data.quantity,
    },
  });
}

async function increaseBasketItemQuantity(
  basketItemId: string,
  currentQuantity: number,
  additionalQuantity: number
) {
  await dbInstance.basket.update({
    where: {
      id: basketItemId,
    },
    data: {
      quantity: currentQuantity + additionalQuantity,
    },
  });
}
