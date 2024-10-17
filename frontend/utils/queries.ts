import {
  Basket,
  FilterValue,
  Merchant,
  PaymentMethod,
  Student,
} from "@prisma/client";
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

type SessionDetail = {
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  rememberDetails: boolean;
};

const queries = {
  fetchMerchantDetail: applyFetch<Merchant>("/api/merchant"),
  fetchSessionDetail: applyFetch<SessionDetail>("/api/me"),
  fetchGrades: applyFetch<string[]>("/api/grade"),
  fetchStudents: applyFetch<Student[]>("/api/student"),
  fetchMenus: applyFetch<Menu[]>("/api/menu"),
  fetchMenuProducts: (menuId: string) =>
    applyFetch<Category[]>(`/api/menu/${menuId}/product`)(),
  fetchListing: (listingId: string) =>
    applyFetch<any>(`/api/listing/${listingId}`)(),
  fetchBasket: applyFetch<Basket[]>("/api/basket"),
  fetchBasketSummary: applyFetch<BasketSummary>("/api/basket/summary"),
  fetchBasketDetail: applyFetch<any[]>("/api/basket/detail"),
  fetchDates: applyFetch<any[]>("/api/date"),
  fetchOrder: (orderId: string) =>
    applyFetch<any>("/api/order?reference=" + orderId)(),
  fetchPaymentMethods: applyFetch<PaymentMethod[]>("/api/payment-method"),
  fetchPaymentMethodConfig: (paymentMethodId: string) =>
    applyFetch<any>("/api/payment-method/" + paymentMethodId)(),
  fetchFilterValues: (filterId: string) =>
    applyFetch<FilterValue[]>("/api/filter-value?filterId=" + filterId)(),
  fetchCanOrder: applyFetch<{ canOrder: boolean; items: any[] }>(
    "/api/can-order"
  ),
};

export default queries;
