import Image from "next/image";
import Link from "next/link";
import {
  deleteCategoryAction,
  deleteProductAction,
  toggleStatusAction,
} from "@/app/admin/actions";
import CategoryForm from "@/components/admin/CategoryForm";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { ApiError, listAdminProducts, listCategories } from "@/lib/admin-api";
import { requireAdmin } from "@/lib/auth";
import { AdminProduct } from "@/types/admin";
import { Category } from "@/types/category";
import { formatCurrency } from "@/utils/currency";
import { getMainImage } from "@/utils/product";

export const dynamic = "force-dynamic";

interface AdminPageProps {
  searchParams: Promise<{ erro?: string; ok?: string }>;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  await requireAdmin();
  const { erro, ok } = await searchParams;

  let products: AdminProduct[] = [];
  let categories: Category[] = [];
  let loadError: string | null = null;

  try {
    [products, categories] = await Promise.all([
      listAdminProducts(),
      listCategories(),
    ]);
  } catch (error) {
    loadError =
      error instanceof ApiError ? error.message : "Falha ao carregar os dados.";
  }

  return (
    <>
      <div className="admin-title-row">
        <h1>Produtos</h1>
        <Link href="/admin/produtos/novo" className="btn btn-primary">
          + Novo produto
        </Link>
      </div>

      {ok && (
        <p className="form-message form-success" role="status">
          {ok}
        </p>
      )}
      {(erro || loadError) && (
        <p className="form-message form-error" role="alert">
          {erro ?? loadError}
        </p>
      )}

      <section className="admin-card">
        {products.length === 0 ? (
          <p className="admin-muted">Nenhum produto cadastrado ainda.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>Produto</th>
                  <th>Categoria</th>
                  <th>Preço (US$)</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <Image
                        src={getMainImage(product)}
                        alt=""
                        width={56}
                        height={56}
                        className="admin-thumb"
                        unoptimized
                      />
                    </td>
                    <td>
                      <strong>{product.name}</strong>
                      <br />
                      <small className="admin-muted">
                        {[product.mark, product.color].filter(Boolean).join(" · ")}
                      </small>
                    </td>
                    <td>{product.categoryName}</td>
                    <td>{formatCurrency(product.price, "USD")}</td>
                    <td>
                      <span
                        className={`admin-badge ${product.active ? "on" : "off"}`}
                      >
                        {product.active ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <Link
                          href={`/admin/produtos/${product.id}`}
                          className="btn btn-outline"
                        >
                          Editar
                        </Link>

                        <form action={toggleStatusAction}>
                          <input type="hidden" name="id" value={product.id} />
                          <input
                            type="hidden"
                            name="active"
                            value={String(!product.active)}
                          />
                          <button type="submit" className="btn btn-outline">
                            {product.active ? "Desativar" : "Ativar"}
                          </button>
                        </form>

                        <form action={deleteProductAction}>
                          <input type="hidden" name="id" value={product.id} />
                          <ConfirmButton
                            message={`Excluir "${product.name}" e todas as suas imagens? Esta ação não pode ser desfeita.`}
                          >
                            Excluir
                          </ConfirmButton>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="admin-card">
        <h2>Categorias</h2>

        {categories.length > 0 && (
          <ul className="admin-category-list">
            {categories.map((category) => (
              <li key={category.id}>
                <span>
                  <strong>{category.name}</strong>{" "}
                  <small className="admin-muted">/{category.slug}</small>
                </span>
                <form action={deleteCategoryAction}>
                  <input type="hidden" name="id" value={category.id} />
                  <ConfirmButton
                    message={`Excluir a categoria "${category.name}"? Só é possível se ela não tiver produtos.`}
                  >
                    Excluir
                  </ConfirmButton>
                </form>
              </li>
            ))}
          </ul>
        )}

        <CategoryForm />
      </section>
    </>
  );
}
