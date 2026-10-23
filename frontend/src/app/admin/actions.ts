"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  ApiError,
  createCategory,
  createProduct,
  deleteCategory,
  deleteImage,
  deleteProduct,
  setProductStatus,
  updateProduct,
  uploadImage,
} from "@/lib/admin-api";
import {
  endSession,
  isAdminConfigured,
  passwordMatches,
  requireAdmin,
  startSession,
} from "@/lib/auth";
import { checkRateLimit, clearFailures, recordFailure } from "@/lib/rate-limit";
import { FormState, ProductInput } from "@/types/admin";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

// ---------- Helpers (não exportados) ----------
const text = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();

function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  console.error(error);
  return "Erro inesperado. Tente novamente.";
}

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

async function clientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "local"
  );
}

function revalidateSite() {
  revalidatePath("/");
  revalidatePath("/produtos/[id]", "page");
  revalidatePath("/admin");
}

function valuesOf(fd: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const key of ["name", "description", "price", "color", "mark", "categoryId"]) {
    values[key] = String(fd.get(key) ?? "");
  }
  return values;
}

function parseProduct(
  fd: FormData,
):
  | { input: ProductInput; categoryId: number }
  | { error: string; values: Record<string, string> } {
  const values = valuesOf(fd);
  const fail = (error: string) => ({ error, values });

  const name = text(fd, "name");
  const color = text(fd, "color");
  const mark = text(fd, "mark");
  const description = text(fd, "description");
  const price = Number(text(fd, "price").replace(",", "."));
  const categoryId = Number(text(fd, "categoryId"));

  if (!name || name.length > 150) return fail("Informe o nome (até 150 caracteres).");
  if (!mark || mark.length > 50) return fail("Informe a marca (até 50 caracteres).");
  if (!color || color.length > 50) return fail("Informe a cor (até 50 caracteres).");
  if (!Number.isFinite(price) || price <= 0 || price >= 100_000_000) {
    return fail("Informe um preço em dólar maior que zero.");
  }
  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    return fail("Escolha uma categoria.");
  }

  return {
    input: { name, description, price: Math.round(price * 100) / 100, color, mark },
    categoryId,
  };
}

async function uploadImages(
  productId: number,
  fd: FormData,
  startOrder: number,
): Promise<string[]> {
  const files = fd
    .getAll("images")
    .filter((f): f is File => f instanceof File && f.size > 0);

  const errors: string[] = [];
  let order = startOrder;

  for (const file of files) {
    if (file.size > MAX_IMAGE_BYTES) {
      errors.push(`${file.name}: maior que 5 MB`);
      continue;
    }
    try {
      await uploadImage(productId, file, order);
      order += 1;
    } catch (error) {
      errors.push(`${file.name}: ${errorMessage(error)}`);
    }
  }
  return errors;
}

// ---------- Sessão ----------
export async function loginAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!isAdminConfigured()) {
    return {
      error:
        "Painel não configurado. Defina ADMIN_PASSWORD (8+), ADMIN_API_KEY (24+) e SESSION_SECRET (32+) no .env.local.",
    };
  }

  const ip = await clientIp();
  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    return {
      error: `Muitas tentativas. Tente novamente em ${Math.ceil(limit.retryAfterSeconds / 60)} min.`,
    };
  }

  if (!passwordMatches(String(formData.get("password") ?? ""))) {
    recordFailure(ip);
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { error: "Senha incorreta." };
  }

  clearFailures(ip);
  await startSession();
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await endSession();
  redirect("/admin/login");
}

// ---------- Produtos ----------
export async function createProductAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const parsed = parseProduct(formData);
  if ("error" in parsed) return parsed;

  let productId = 0;
  let uploadErrors: string[] = [];
  try {
    const product = await createProduct(parsed.categoryId, parsed.input);
    productId = product.id;
    uploadErrors = await uploadImages(productId, formData, 0);
  } catch (error) {
    return { error: errorMessage(error), values: valuesOf(formData) };
  }

  revalidateSite();
  redirect(
    `/admin/produtos/${productId}?${uploadErrors.length ? "aviso=imagens" : "criado=1"}`,
  );
}

export async function updateProductAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const id = Number(text(formData, "id"));
  if (!Number.isInteger(id) || id <= 0) return { error: "Produto inválido." };

  const parsed = parseProduct(formData);
  if ("error" in parsed) return parsed;

  try {
    const product = await updateProduct(id, parsed.categoryId, parsed.input);
    const orders = (product.images ?? []).map((i) => i.sortOrder ?? 0);
    const nextOrder = Math.max(-1, ...orders) + 1;
    const errors = await uploadImages(id, formData, nextOrder);

    revalidateSite();
    revalidatePath(`/admin/produtos/${id}`);

    if (errors.length > 0) {
      return {
        error: `Dados salvos, mas houve falha em imagens: ${errors.join("; ")}`,
        values: valuesOf(formData),
      };
    }
    return { success: "Produto atualizado com sucesso." };
  } catch (error) {
    return { error: errorMessage(error), values: valuesOf(formData) };
  }
}

export async function toggleStatusAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = Number(text(formData, "id"));
  const active = text(formData, "active") === "true";

  let failure: string | null = null;
  try {
    await setProductStatus(id, active);
  } catch (error) {
    failure = errorMessage(error);
  }

  revalidateSite();
  redirect(
    failure
      ? `/admin?erro=${encodeURIComponent(failure)}`
      : `/admin?ok=${encodeURIComponent(active ? "Produto ativado." : "Produto desativado.")}`,
  );
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = Number(text(formData, "id"));
  let failure: string | null = null;
  try {
    await deleteProduct(id);
  } catch (error) {
    failure = errorMessage(error);
  }

  revalidateSite();
  redirect(
    failure
      ? `/admin?erro=${encodeURIComponent(failure)}`
      : `/admin?ok=${encodeURIComponent("Produto excluído.")}`,
  );
}

// ---------- Imagens ----------
export async function deleteImageAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const imageId = Number(text(formData, "imageId"));
  const productId = Number(text(formData, "productId"));

  let failure: string | null = null;
  try {
    await deleteImage(imageId);
  } catch (error) {
    failure = errorMessage(error);
  }

  revalidateSite();
  revalidatePath(`/admin/produtos/${productId}`);
  redirect(
    `/admin/produtos/${productId}${failure ? `?erro=${encodeURIComponent(failure)}` : ""}`,
  );
}

// ---------- Categorias ----------
export async function createCategoryAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const name = text(formData, "name");
  const slug = slugify(name);
  if (!name || name.length > 100 || !slug) {
    return { error: "Informe um nome de categoria (até 100 caracteres)." };
  }

  try {
    await createCategory(name, slug);
  } catch (error) {
    return { error: errorMessage(error) };
  }

  revalidateSite();
  return { success: `Categoria "${name}" criada.` };
}

export async function deleteCategoryAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = Number(text(formData, "id"));
  let failure: string | null = null;
  try {
    await deleteCategory(id);
  } catch (error) {
    failure = errorMessage(error);
  }

  revalidateSite();
  redirect(
    failure
      ? `/admin?erro=${encodeURIComponent(failure)}`
      : `/admin?ok=${encodeURIComponent("Categoria excluída.")}`,
  );
}
