import { Student } from "@prisma/client";
import axios from "axios";

type MutationProps<REQ> = {
  url: string;
  method: "POST" | "PUT" | "DELETE";
  data?: REQ;
};

const runMutation = async <REQ = any, RES = any>(props: MutationProps<REQ>) => {
  const response = await axios.request<RES>({
    method: props.method,
    url: props.url,
    data: props.data || null,
  });

  return response.data;
};

const mutations = {
  addStudent: (firstName: string, lastName: string, grade: string) =>
    runMutation({
      method: "POST",
      url: "/api/student",
      data: {
        firstName,
        lastName,
        grade,
      },
    }),
  removeStudent: (studentId: string) =>
    runMutation({
      method: "DELETE",
      url: "/api/student/" + studentId,
    }),
  addToBasket: (data: AddToBasketRequest) =>
    runMutation({
      method: "POST",
      url: "/api/basket",
      data,
    }),
  removeFromBasket: (basketItemId: string) =>
    runMutation({
      method: "DELETE",
      url: "/api/basket/item/" + basketItemId,
    }),
  placeOrder: (data: {
    token: string;
    paymentMethodId: string;
    firstName: string;
    lastName: string;
    email: string;
    notes: string;
    rememberDetails: boolean;
  }) =>
    runMutation({
      method: "POST",
      url: "/api/checkout",
      data: {
        token: data.token,
        paymentMethodId: data.paymentMethodId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        notes: data.notes,
        rememberDetails: data.rememberDetails,
      },
    }),
};

export default mutations;
