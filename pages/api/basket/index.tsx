import { addToBasketController } from "@/backend/features/basket/addToBasket";
import { fetchBasketController } from "@/backend/features/basket/fetchBasket";
import { RouteHandler } from "@/backend/utility/route-handler";

export default RouteHandler({
  GET: fetchBasketController,
  POST: addToBasketController,
});
