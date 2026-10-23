import Link from "next/link";
import { createProductAction } from "@/app/admin/actions";
import ProductForm from "@/components/admin/ProductForm";
import { ApiError, listCategories } from "@/lib/admin-api";
import { requireAdmin } from "@/lib/auth";
import { Category } from "@/types/category";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  await requireAdmin();

  let categories: Category[] = [];
  let loadError: string | null = null;
  try {
    categories = await listCategories();
  } catch (error) {
    loadError =
      error instanceof ApiError ? error.message : "Falha ao carregar categorias.";
  }

  return (
    <>
      <div className="admin-title-row">
        <h1>Novo produto</h1>
        <Link href="/admin" className="btn btn-outline">
          ← Voltar
        </Link>
      </div>

      <section className="admin-card">
        {loadError && (
          <p className="form-message form-error" role="alert">
            {loadError}
          </p>
        )}

        {categories.length === 0 && !loadError ? (
          <p className="admin-muted">
            Crie ao menos uma categoria antes de cadastrar produtos.{" "}
            <Link href="/admin" className="link-more">
              Ir para categorias
            </Link>
          </p>
        ) : (
          <ProductForm
            mode="create"
            categories={categories}
            action={createProductAction}
          />
        )}
      </section>
    </>
  );
}
