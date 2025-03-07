export const currencyFormatter = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(value);
};

export const parseCurrency = (value: string): number => {
    return parseFloat(value.replace(/[^0-9.]/g, "")) || 0;
  };
