import ConfirmationPage from "./pages/confirmation";
import HomePage from "./pages/home";
import MealsPage from "./pages/meals";
import OrderSuccessPage from "./pages/order-success";
import StudentsPage from "./pages/students";

const makeCateringStrategy = (): SystemStrategy => {
  return {
    id: "catering",
    pages: [
      {
        path: "/",
        component: HomePage,
      },
      {
        path: "/students",
        component: StudentsPage,
      },
      {
        path: "/meals",
        component: MealsPage,
      },
      {
        path: "/confirmation",
        component: ConfirmationPage,
      },
      {
        path: "/order-success",
        component: OrderSuccessPage,
      },
    ],
  };
};

export default makeCateringStrategy;
