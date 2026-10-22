import { Product } from "@/types/product";
import { formatCurrency } from "@/utils/currency";

export const INSTAGRAM_URL = "https://ig.me/m/sokoimports";
export const INSTAGRAM_HANDLE = "@sokoimports";

/** Mensagem pronta para enviar no Direct da loja. */
export function buildInterestMessage(
  product: Product,
  exchangeRate: number,
): string {
  const price = formatCurrency(product.price * exchangeRate, "BRL");
  const specs = product.description ? ` (${product.description})` : "";
  const color = product.color ? `, cor ${product.color}` : "";

  return `Olá, SOKO Imports! Tenho interesse no ${product.name}${specs}${color}, no valor de ${price}. Podem confirmar a disponibilidade?`;
}
