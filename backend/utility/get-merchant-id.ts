const getMerchantId = (headers: any) => {
  let host = "";

  if (process.env.NODE_ENV === "development") {
    host = headers["host"] as string;
  }

  if (process.env.NODE_ENV === "production") {
    host = headers["x-forwarded-host"] as string;
  }

  return host.split(".")[0];
};

export default getMerchantId;
