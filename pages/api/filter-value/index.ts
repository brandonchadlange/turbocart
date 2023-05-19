import { fetchFilterValuesController } from "@/backend/features/filter/fetchFilterValues";
import { RouteHandler } from "@/backend/utility/route-handler";

export default RouteHandler({
  GET: fetchFilterValuesController,
});
