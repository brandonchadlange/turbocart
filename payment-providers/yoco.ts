const makePaymentWithYoco = ({
  publicKey,
  amountInCents,
}: {
  publicKey: string;
  amountInCents: number;
}) => {
  // @ts-ignore
  const yoco = new window.YocoSDK({
    publicKey,
  });

  return new Promise<any>((resolve, reject) => {
    yoco.showPopup({
      amountInCents: amountInCents,
      currency: "ZAR",
      name: "Checkout",
      description: "Awesome description",
      callback: async function (result: any) {
        if (result.error) {
          reject(result.error);
        } else {
          resolve(result as any);
        }
      },
    });
  });
};

export default makePaymentWithYoco;
