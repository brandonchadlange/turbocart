export function getVariants(attributes: any): any[] {
  const keys = Object.keys(attributes);
  const values = keys.map((key) => attributes[key]);
  const variants = cartesian(...values);
  return variants.map((variant: any) => {
    const result: any = {};
    for (let i = 0; i < keys.length; i++) {
      result[keys[i]] = variant[i];
    }
    return result;
  });
}

function cartesian(...arrays: any[]) {
  return arrays.reduce(
    (acc, curr) => acc.flatMap((a: any) => curr.map((c: any) => [...a, c])),
    [[]]
  );
}
