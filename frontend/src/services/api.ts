import { Product, SpringPage } from "@/types/product";
import { Category } from "@/types/category";

// API_URL: usada pelo servidor Next (ex.: rede interna do Docker).
// NEXT_PUBLIC_API_URL: URL pública. Fallback: backend Spring local.
const API_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080/api";

export async function getProducts(page = 0, size = 50): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/products?page=${page}&size=${size}`, {
      next: { revalidate: 30 },
    });

    if (!res.ok) throw new Error("Falha ao buscar produtos");

    const data: SpringPage<Product> = await res.json();
    return data.content ?? [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Percorre todas as páginas do Spring
export async function getAllProducts(pageSize = 100): Promise<Product[]> {
  const all: Product[] = [];
  try {
    for (let page = 0; page < 50; page++) {
      const res = await fetch(
        `${API_URL}/products?page=${page}&size=${pageSize}`,
        { next: { revalidate: 30 } },
      );
      if (!res.ok) throw new Error("Falha ao buscar produtos");

      const data: SpringPage<Product> = await res.json();
      all.push(...(data.content ?? []));

      if (page + 1 >= data.totalPages) break;
    }
  } catch (error) {
    console.error(error);
  }
  return all;
}

export async function getProductById(id: number): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    return (await res.json()) as Product;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/categories`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("Falha ao buscar categorias");
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
