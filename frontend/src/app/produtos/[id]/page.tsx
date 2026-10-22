import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import InterestButton from "@/components/InterestButton";
import { getProductById } from "@/services/api";
import { getUSDRate } from "@/services/exchange";
import { formatCurrency } from "@/utils/currency";
import { buildInterestMessage } from "@/utils/instagram";
import { PLACEHOLDER_IMAGE, sortImages, splitColors } from "@/utils/product";

export const revalidate = 30;

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

function parseId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const id = parseId((await params).id);
  const product = id ? await getProductById(id) : null;
  if (!product) return { title: "Produto não encontrado" };

  return {
    title: product.name,
    description:
      product.description ??
      `${product.name} na SOKO Imports. Consulte valores e fale pelo Instagram.`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const id = parseId((await params).id);
  if (!id) notFound();

  const [product, exchangeRate] = await Promise.all([
    getProductById(id),
    getUSDRate(),
  ]);
  if (!product) notFound();

  const images = sortImages(product.images);
  const gallery =
    images.length > 0 ? images.map((i) => i.url) : [PLACEHOLDER_IMAGE];
  const colors = splitColors(product.color);
  const priceBRL = product.price * exchangeRate;

  return (
    <>
      <Header />
      <main className="section-container product-page">
        <Link href="/#produtos" className="link-more">
          ← Voltar ao catálogo
        </Link>

        <article
          itemScope
          itemType="https://schema.org/Product"
          className="product-detail"
        >
          <div className="gallery">
            <Image
              src={gallery[0]}
              alt={`${product.name} — imagem oficial`}
              width={900}
              height={640}
              className="gallery-main"
              unoptimized
              priority
            />
            {gallery.length > 1 && (
              <div className="gallery-thumbs">
                {gallery.slice(1).map((url) => (
                  <Image
                    key={url}
                    src={url}
                    alt={`${product.name} — imagem adicional`}
                    width={300}
                    height={220}
                    unoptimized
                  />
                ))}
              </div>
            )}
          </div>

          <div className="product-info">
            <span className="product-category">
              {[product.categoryName, product.mark].filter(Boolean).join(" • ")}
            </span>
            <h1 itemProp="name">{product.name}</h1>
            {product.description && (
              <p itemProp="description" className="product-desc-full">
                {product.description}
              </p>
            )}

            {colors.length > 0 && (
              <div
                className="colors"
                aria-label={`Cores: ${colors.join(", ")}`}
              >
                {colors.map((color) => (
                  <span key={color} className="color-tag">
                    {color}
                  </span>
                ))}
              </div>
            )}

            <div
              className="price-container price-large"
              itemProp="offers"
              itemScope
              itemType="https://schema.org/Offer"
            >
              <meta itemProp="priceCurrency" content="BRL" />
              <meta itemProp="price" content={priceBRL.toFixed(2)} />
              <strong className="price-brl">
                {formatCurrency(priceBRL, "BRL")}
              </strong>
              <small className="price-usd">
                {formatCurrency(product.price, "USD")}
              </small>
            </div>

            <p className="price-note">
              Valor calculado pela cotação atual (US$ 1,00 ={" "}
              {formatCurrency(exchangeRate, "BRL")}). Preços e disponibilidade
              podem sofrer alterações.
            </p>

            <InterestButton
              message={buildInterestMessage(product, exchangeRate)}
            />
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
