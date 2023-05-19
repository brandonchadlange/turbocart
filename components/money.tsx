const Money = ({
  children,
  currency,
}: {
  children: number;
  currency: string;
}) => {
  const currencyFormatter = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  });

  const valueInFull = parseFloat((children / 100).toFixed(0));
  const valueFormatted = currencyFormatter.format(valueInFull);
  return <>{valueFormatted}</>;
};

export default Money;
