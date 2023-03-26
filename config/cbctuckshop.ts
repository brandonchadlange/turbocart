type Pages = {
  landing: {
    heading: string;
    text: string;
    callToAction: string;
  };
  product: {};
  payment: {};
};

type Config = {
  pages: Pages;
};

const AppConfig: Config = {
  pages: {
    landing: {
      callToAction: "ASDF",
      heading: "ASDF",
      text: "ASDF",
    },
    payment: {},
    product: {},
  },
};

export default AppConfig;
