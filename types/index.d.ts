declare type HttpResponse<T> = {
  success: boolean;
  messages?: string[];
  data: T;
};

declare type Option = {
  value: string;
  label: string;
  type: "single" | "multiple" | "variant";
  values: OptionValue[];
};

declare type OptionValue = {
  label: string;
  value: string;
};

declare type Product = {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  options?: Option[];
  // variants: Product[];
};

declare type Listing = {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
};

declare type Category = {
  id: string;
  name: string;
  items: Listing[];
};

declare type Menu = {
  id: string;
  name: string;
  categories: Category[];
};

declare type AddToBasketRequest = {
  productId: string;
  menuId: string;
  dateIdList: string[];
  options: any;
  quantity: any;
  variant?: string;
  variantId: string;
};

type SummaryItem = {
  variant: any;
  quantity: number;
  totalInCents: number;
};

type BasketSummary = {
  items: SummaryItem[];
  totalInCents: number;
  totalItems: number;
  totalStudents: number;
};

type BasketDetailItem = {
  product: Product;
  quantity: string;
  menu: Menu;
  student: Student;
  totalInCents: number;
};
