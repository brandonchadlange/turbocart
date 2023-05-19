import HomePage from "./pages/home";
import ProductPage from "./pages/product";

const makeEcommerceStrategy = (): SystemStrategy => {
  return {
    id: "ecommerce",
    pages: [
      {
        path: "/",
        component: HomePage,
      },
      {
        path: "/product",
        component: ProductPage,
      },
    ],
  };
};

export default makeEcommerceStrategy;
