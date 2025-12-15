import { Basket, ListingVariant } from "@prisma/client";
import dbInstance from "../db";

const getBasketSummary = async (sessionId: string): Promise<BasketSummary> => {
  const basketItems = await dbInstance.basket.findMany({
    where: {
      sessionId: sessionId,
    },
  });

  const variantIdList = basketItems.map((e) => e.variantId);

  const listingVariants = await dbInstance.listingVariant.findMany({
    where: {
      id: {
        in: variantIdList,
      },
    },
    include: {
      Listing: true,
    },
  });

  return new BasketSummaryResponse(basketItems, listingVariants);
};

class BasketSummaryResponse {
  totalInCents: number = 0;
  totalItems: number = 0;
  totalStudents: number = 0;
  items: SummaryItem[] = [];

  constructor(
    basketItems: Basket[],
    variants: (ListingVariant & {
      Listing: Listing;
    })[]
  ) {
    const students: string[] = [];

    basketItems.forEach((basketItem) => {
      if (!students.includes(basketItem.studentId)) {
        students.push(basketItem.studentId);
      }

      const summaryItem = this.items.find(
        (e) => e.variant.id === basketItem.variantId
      );

      const variant = variants.find(
        (variant) => variant.id === basketItem.variantId
      );

      this.totalInCents +=
        basketItem.quantity *
        (variant!.Listing!.priceInCents + variant!.additionalFeeInCents);
      this.totalItems += basketItem.quantity;

      if (summaryItem !== undefined) {
        summaryItem.quantity += basketItem.quantity;
        summaryItem.totalInCents +=
          basketItem.quantity *
          (variant!.Listing!.priceInCents + variant!.additionalFeeInCents);
        return;
      }

      this.items.push({
        variant: variant!,
        quantity: basketItem.quantity,
        totalInCents:
          basketItem.quantity *
          (variant!.Listing!.priceInCents + variant!.additionalFeeInCents),
      });
    });
  }
}

export default getBasketSummary;
