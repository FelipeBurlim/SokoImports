import { Product, ProductImage } from "@/types/product";

export const PLACEHOLDER_IMAGE =
  "https://placehold.co/640x400/eee/999.png?text=Sem+Imagem";

/** Imagens ordenadas por sortOrder (o backend não garante a ordem). */
export function sortImages(images: ProductImage[] | null | undefined) {
  return [...(images ?? [])].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );
}

export function getMainImage(product: Product): string {
  return sortImages(product.images)[0]?.url ?? PLACEHOLDER_IMAGE;
}

/** "Orange, Blue" -> ["Orange", "Blue"] */
export function splitColors(color: string | null | undefined): string[] {
  return (color ?? "")
    .split(/[,/]/)
    .map((c) => c.trim())
    .filter(Boolean);
}

/** Remove acentos e deixa minúsculo para buscas. */
export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
