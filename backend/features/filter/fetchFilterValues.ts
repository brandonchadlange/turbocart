import dbInstance from "@/backend/db";
import getMerchantId from "@/backend/utility/get-merchant-id";
import { HttpStatusCode } from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export async function fetchFilterValuesController(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const merchantId = getMerchantId(req.headers);
  const filterId = req.query.filterId as string;

  const values = await fetchFilterValues(merchantId, filterId);

  if (values.length === 0) {
    return res.status(HttpStatusCode.NoContent).send(null);
  }

  res.send(values);
}

function fetchFilterValues(merchantId: string, filterId: string) {
  try {
    return dbInstance.filterValue.findMany({
      where: {
        filter: {
          merchantId,
          filterId,
        },
      },
    });
  } catch (err) {
    console.log(err);
    return [];
  }
}
