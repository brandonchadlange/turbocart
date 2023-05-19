type SystemStrategyType = "catering" | "ecommerce";

type Page = {
  path: string;
  component: () => JSX.Element;
};

type SystemStrategy = {
  id: string;
  pages: Page[];
};
