export function formatCurrency(value: number, currency: "BRL" | "USD"): string {
  return new Intl.NumberFormat(currency === "BRL" ? "pt-BR" : "en-US", {
    style: "currency",
    currency: currency,
  }).format(value);
}
