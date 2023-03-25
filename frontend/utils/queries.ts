import { Basket, Student } from "@prisma/client";
import axios from "axios";

const applyFetch = <RES = any>(url: string) => {
  return async () => {
    const response = await axios.request<RES>({
      method: "GET",
      url,
    });

    return response.data;
  };
};

const queries = {
  fetchGrades: applyFetch<string[]>("/api/grade"),
  fetchStudents: applyFetch<Student[]>("/api/student"),
  fetchMenus: applyFetch<Menu[]>("/api/menu"),
  fetchBasket: applyFetch<Basket[]>("/api/basket"),
  fetchBasketSummary: applyFetch<BasketSummary>("/api/basket/summary"),
  fetchBasketDetail: applyFetch<any[]>("/api/basket/detail"),
  fetchDates: applyFetch<any[]>("/api/date"),
  fetchOrder: applyFetch<any[]>("/api/order"),
};

export default queries;
