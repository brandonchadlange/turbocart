import makeCateringModule from "./catering/index";
import makeEcommerceStrategy from "./ecommerce";

const strategyMakerMap: Record<SystemStrategyType, () => SystemStrategy> = {
  catering: makeCateringModule,
  ecommerce: makeEcommerceStrategy,
};

export default strategyMakerMap;
