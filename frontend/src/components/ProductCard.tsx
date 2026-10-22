import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { formatCurrency } from "@/utils/currency";
import { getMainImage, splitColors } from "@/utils/product";
import { buildInterestMessage } from "@/utils/instagram";
import InterestButton from "@/components/InterestButton";

interface ProductCardProps {
  product: Product;
  currentExchangeRate: number;
}

export default function ProductCard({
  product,
  currentExchangeRate,
}: ProductCardProps) {
  // Preço base vindo do DB em USD * Cotação
  const priceBRL = product.price * currentExchangeRate;
  const colors = splitColors(product.color);
  const href = `/produtos/${product.id}`;

  return (
    <article itemScope itemType="https://schema.org/Product" className="card">
      <Link href={href} className="image-container" tabIndex={-1}>
        <Image
          src={getMainImage(product)}
          alt={`${product.name} — imagem oficial`}
          width={640}
          height={400}
          className="product-image"
          unoptimized
        />
      </Link>
      <div className="card-content">
        <span className="product-category">
          {[product.categoryName, product.mark].filter(Boolean).join(" • ")}
        </span>
        <h3 itemProp="name" className="product-title">
          <Link href={href}>{product.name}</Link>
        </h3>
        {product.description && (
          <p itemProp="description" className="product-desc">
            {product.description}
          </p>
        )}

        {colors.length > 0 && (
          <div className="colors" aria-label={`Cores: ${colors.join(", ")}`}>
            {colors.map((color) => (
              <span key={color} className="color-tag">
                {color}
              </span>
            ))}
          </div>
        )}

        <div
          className="price-container"
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

        <div className="card-actions">
          <Link href={href} className="btn btn-outline">
            Ver detalhes
          </Link>
          <InterestButton
            message={buildInterestMessage(product, currentExchangeRate)}
          />
        </div>
      </div>
    </article>
  );
}