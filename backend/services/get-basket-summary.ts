import dbInstance from "../db";

const getBasketSummary = async (
  sessionId: string,
  products: Product[]
): Promise<BasketSummary> => {
  const summaryItems: SummaryItem[] = [];

  const basketItems = await dbInstance.basket.findMany({
    where: {
      sessionId: sessionId,
    },
  });

  let totalInCents = 0;
  let totalItems = 0;
  let students: string[] = [];

  basketItems.forEach((basketItem) => {
    if (!students.includes(basketItem.studentId)) {
      students.push(basketItem.studentId);
    }

    const summaryItem = summaryItems.find(
      (e) => e.product.id === basketItem.productId
    );

    const product = products.find(
      (product) => product.id === basketItem.productId
    );

    totalInCents += basketItem.quantity * product!.priceInCents;
    totalItems += basketItem.quantity;

    if (summaryItem !== undefined) {
      summaryItem.quantity += basketItem.quantity;
      summaryItem.totalInCents += basketItem.quantity * product!.priceInCents;
      return;
    }

    summaryItems.push({
      product: product!,
      quantity: basketItem.quantity,
      totalInCents: basketItem.quantity * product!.priceInCents,
    });
  });

  return {
    totalInCents,
    totalItems,
    totalStudents: students.length,
    items: summaryItems,
  };
};

export default getBasketSummary;
