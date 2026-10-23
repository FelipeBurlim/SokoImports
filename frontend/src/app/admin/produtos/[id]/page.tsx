import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteImageAction, updateProductAction } from "@/app/admin/actions";
import ConfirmButton from "@/components/admin/ConfirmButton";
import ProductForm from "@/components/admin/ProductForm";
import { ApiError, getAdminProduct, listCategories } from "@/lib/admin-api";
import { requireAdmin } from "@/lib/auth";
import { Category } from "@/types/category";
import { sortImages } from "@/utils/product";

export const dynamic = "force-dynamic";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ criado?: string; aviso?: string; erro?: string }>;
}

export default async function EditProductPage({
  params,
  searchParams,
}: EditProductPageProps) {
  await requireAdmin();

  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const { criado, aviso, erro } = await searchParams;

  let categories: Category[] = [];
  let product = null;
  let loadError: string | null = null;
  try {
    [product, categories] = await Promise.all([
      getAdminProduct(id),
      listCategories(),
    ]);
  } catch (error) {
    loadError =
      error instanceof ApiError ? error.message : "Falha ao carregar o produto.";
  }

  if (!loadError && !product) notFound();

  const images = product ? sortImages(product.images) : [];

  return (
    <>
      <div className="admin-title-row">
        <h1>{product ? `Editar: ${product.name}` : "Editar produto"}</h1>
        <Link href="/admin" className="btn btn-outline">
          ← Voltar
        </Link>
      </div>

      {criado && (
        <p className="form-message form-success" role="status">
          Produto cadastrado com sucesso.
        </p>
      )}
      {aviso === "imagens" && (
        <p className="form-message form-error" role="alert">
          Produto criado, mas algumas imagens não foram enviadas. Use WebP, JPEG
          ou PNG de até 5 MB e envie novamente abaixo.
        </p>
      )}
      {(erro || loadError) && (
        <p className="form-message form-error" role="alert">
          {erro ?? loadError}
        </p>
      )}

      {product && (
        <>
          <section className="admin-card">
            <h2>Dados do produto</h2>
            <ProductForm
              mode="edit"
              categories={categories}
              product={product}
              action={updateProductAction}
            />
          </section>

          <section className="admin-card">
            <h2>Imagens ({images.length})</h2>
            {images.length === 0 ? (
              <p className="admin-muted">
                Nenhuma imagem ainda. Use “Adicionar imagens” no formulário
                acima.
              </p>
            ) : (
              <ul className="admin-image-grid">
                {images.map((image, index) => (
                  <li key={image.id} className="admin-image-item">
                    <Image
                      src={image.url}
                      alt={`${product.name} — imagem ${index + 1}`}
                      width={220}
                      height={160}
                      unoptimized
                    />
                    <div className="admin-image-meta">
                      <small>{index === 0 ? "Foto principal" : `Imagem ${index + 1}`}</small>
                      <form action={deleteImageAction}>
                        <input type="hidden" name="imageId" value={image.id} />
                        <input type="hidden" name="productId" value={product.id} />
                        <ConfirmButton message="Excluir esta imagem?">
                          Excluir
                        </ConfirmButton>
                      </form>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </>
  );
}
