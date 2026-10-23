import { AdminProduct, ProductInput } from "@/types/admin";
import { Category } from "@/types/category";
import { Product, SpringPage } from "@/types/product";

// Estas funções só rodam no servidor Next (server actions e páginas do /admin).
// A chave ADMIN_API_KEY nunca chega ao navegador.
const API_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080/api";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function adminRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const key = process.env.ADMIN_API_KEY;
  if (!key) {
    throw new ApiError("ADMIN_API_KEY não configurada no frontend.", 500);
  }

  const headers = new Headers(init.headers);
  headers.set("X-Admin-Key", key);

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers,
      cache: "no-store",
    });
  } catch {
    throw new ApiError(
      "Não foi possível conectar ao backend. Ele está rodando?",
      503,
    );
  }

  if (!res.ok) {
    let message =
      res.status === 401
        ? "O backend recusou a chave de administrador (ADMIN_API_KEY diferente entre backend e frontend?)."
        : `Erro ${res.status} no backend.`;

    if (res.status !== 401) {
      try {
        const body = await res.json();
        if (body?.message) message = String(body.message);
      } catch {
        // resposta sem JSON: mantém a mensagem padrão
      }
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

const JSON_HEADERS = { "Content-Type": "application/json" };

// ---------- Leitura ----------
export async function listAdminProducts(): Promise<AdminProduct[]> {
  const all: AdminProduct[] = [];
  for (let page = 0; page < 50; page++) {
    const data = await adminRequest<SpringPage<AdminProduct>>(
      `/admin/products?page=${page}&size=100`,
    );
    all.push(...(data.content ?? []));
    if (page + 1 >= data.totalPages) break;
  }
  return all;
}

export async function getAdminProduct(id: number): Promise<AdminProduct | null> {
  try {
    return await adminRequest<AdminProduct>(`/admin/products/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function listCategories(): Promise<Category[]> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/categories`, { cache: "no-store" });
  } catch {
    throw new ApiError("Não foi possível conectar ao backend.", 503);
  }
  if (!res.ok) throw new ApiError("Falha ao buscar categorias.", res.status);
  return (await res.json()) as Category[];
}

// ---------- Categorias ----------
export function createCategory(name: string, slug: string) {
  return adminRequest<Category>("/categories", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ name, slug }),
  });
}

export function deleteCategory(id: number) {
  return adminRequest<void>(`/categories/${id}`, { method: "DELETE" });
}

// ---------- Produtos ----------
export function createProduct(categoryId: number, input: ProductInput) {
  return adminRequest<Product>(`/products/category/${categoryId}`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(input),
  });
}

export function updateProduct(
  id: number,
  categoryId: number,
  input: ProductInput,
) {
  return adminRequest<Product>(`/products/${id}/category/${categoryId}`, {
    method: "PUT",
    headers: JSON_HEADERS,
    body: JSON.stringify(input),
  });
}

export function setProductStatus(id: number, active: boolean) {
  return adminRequest<void>(`/products/${id}/status?isActive=${active}`, {
    method: "PATCH",
  });
}

export function deleteProduct(id: number) {
  return adminRequest<void>(`/products/${id}`, { method: "DELETE" });
}

// ---------- Imagens ----------
export function uploadImage(productId: number, file: File, sortOrder: number) {
  const form = new FormData();
  form.append("file", file, file.name);
  form.append("sortOrder", String(sortOrder));
  return adminRequest<unknown>(`/images/${productId}`, {
    method: "POST",
    body: form,
  });
}

export function deleteImage(imageId: number) {
  return adminRequest<void>(`/images/${imageId}`, { method: "DELETE" });
}
