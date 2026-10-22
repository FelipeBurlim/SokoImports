import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";

interface FeaturedProductsProps {
  products: Product[];
  exchangeRate: number;
}

export default function FeaturedProducts({
  products,
  exchangeRate,
}: FeaturedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section id="destaques" className="section-container">
      <div className="section-header section-header-row">
        <div>
          <span className="eyebrow">Seleção SOKO</span>
          <h2>Produtos em destaque</h2>
        </div>
        <a href="#produtos" className="link-more">
          Ver catálogo completo →
        </a>
      </div>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            currentExchangeRate={exchangeRate}
          />
        ))}
      </div>
    </section>
  );
}
