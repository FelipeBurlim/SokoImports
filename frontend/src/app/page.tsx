import About from "@/components/About";
import CatalogExplorer from "@/components/CatalogExplorer";
import ContactCta from "@/components/ContactCta";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { getAllProducts, getCategories } from "@/services/api";
import { getUSDRate } from "@/services/exchange";

export const revalidate = 30; // Revalida a página estática periodicamente

const FEATURED_COUNT = 4;

export default async function Home() {
  const [products, categories, exchangeRate] = await Promise.all([
    getAllProducts(),
    getCategories(),
    getUSDRate(),
  ]);

  const totalCategories =
    categories.length || new Set(products.map((p) => p.categoryName)).size;

  return (
    <>
      <Header />
      <main>
        <Hero
          totalProducts={products.length}
          totalCategories={totalCategories}
        />

        <CatalogExplorer
          products={products}
          categories={categories}
          exchangeRate={exchangeRate}
          featured={
            <FeaturedProducts
              products={products.slice(0, FEATURED_COUNT)}
              exchangeRate={exchangeRate}
            />
          }
        />

        <About />
        <ContactCta />
      </main>
      <Footer />
    </>
  );
}
