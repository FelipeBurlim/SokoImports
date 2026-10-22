"use client";

import { ReactNode, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import { formatCurrency } from "@/utils/currency";
import { normalize } from "@/utils/product";

interface CatalogExplorerProps {
  products: Product[];
  categories: Category[];
  exchangeRate: number;
  /** Seção de destaques (renderizada no servidor) entre categorias e catálogo. */
  featured?: ReactNode;
}

type SortKey = "default" | "price-asc" | "price-desc" | "name";

export default function CatalogExplorer({
  products,
  categories,
  exchangeRate,
  featured,
}: CatalogExplorerProps) {
  // Teto de preço em R$ (arredondado para cima, de 100 em 100)
  const priceCeiling = useMemo(() => {
    const max = products.reduce(
      (acc, p) => Math.max(acc, p.price * exchangeRate),
      0,
    );
    return Math.max(100, Math.ceil(max / 100) * 100);
  }, [products, exchangeRate]);

  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null); // null = sem limite
  const [sort, setSort] = useState<SortKey>("default");

  const currentMax = maxPrice ?? priceCeiling;

  // Categorias com contagem; se a API de categorias falhar, deriva dos produtos
  const categoryList = useMemo(() => {
    const names =
      categories.length > 0
        ? categories.map((c) => c.name)
        : Array.from(new Set(products.map((p) => p.categoryName)));

    return names.map((name) => ({
      name,
      count: products.filter((p) => p.categoryName === name).length,
    }));
  }, [categories, products]);

  const filtered = useMemo(() => {
    const term = normalize(query.trim());

    const result = products.filter((p) => {
      if (selectedCategory && p.categoryName !== selectedCategory) return false;
      if (p.price * exchangeRate > currentMax) return false;
      if (!term) return true;

      const haystack = normalize(
        [p.name, p.description, p.mark, p.color, p.categoryName]
          .filter(Boolean)
          .join(" "),
      );
      return haystack.includes(term);
    });

    if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
    if (sort === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    }
    return result;
  }, [products, query, selectedCategory, currentMax, sort, exchangeRate]);

  const hasFilters =
    query !== "" || selectedCategory !== null || maxPrice !== null;

  function clearFilters() {
    setQuery("");
    setSelectedCategory(null);
    setMaxPrice(null);
    setSort("default");
  }

  function handleSelectCategory(name: string) {
    setSelectedCategory((current) => (current === name ? null : name));
    document
      .getElementById("produtos")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <section id="categorias" className="section-container">
        <div className="section-header">
          <span className="eyebrow">Explore por categoria</span>
          <h2>Encontre o que procura</h2>
          <p>Selecione uma categoria para ir direto aos produtos correspondentes.</p>
        </div>

        <div className="categories-grid">
          {categoryList.map((category) => (
            <button
              key={category.name}
              type="button"
              className={`category-card${
                selectedCategory === category.name ? " active" : ""
              }`}
              aria-pressed={selectedCategory === category.name}
              onClick={() => handleSelectCategory(category.name)}
            >
              <strong>{category.name}</strong>
              <span>
                {category.count} {category.count === 1 ? "produto" : "produtos"}
              </span>
            </button>
          ))}
        </div>
      </section>

      {featured}

      <section id="produtos" className="section-container">
        <div className="section-header">
          <span className="eyebrow">Catálogo completo</span>
          <h2>Todos os produtos</h2>
          <p>
            Valores convertidos com base na cotação comercial atual:{" "}
            <strong>US$ 1,00 = {formatCurrency(exchangeRate, "BRL")}</strong>
          </p>
        </div>

        <div className="filters">
          <label className="filter-field filter-search">
            <span>Pesquisar produtos</span>
            <input
              type="search"
              placeholder="Ex.: iPhone 17, MacBook, 256 GB..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>

          <label className="filter-field">
            <span>Categoria</span>
            <select
              value={selectedCategory ?? ""}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
            >
              <option value="">Todas</option>
              {categoryList.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="filter-field">
            <span>Ordenar por</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
            >
              <option value="default">Relevância</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
              <option value="name">Nome (A-Z)</option>
            </select>
          </label>

          <label className="filter-field filter-range">
            <span>
              Faixa de preço:{" "}
              <strong>
                R$ 0 — {formatCurrency(currentMax, "BRL").replace(",00", "")}
              </strong>
            </span>
            <input
              type="range"
              min={0}
              max={priceCeiling}
              step={100}
              value={currentMax}
              onChange={(e) => {
                const value = Number(e.target.value);
                setMaxPrice(value >= priceCeiling ? null : value);
              }}
            />
          </label>

          <button
            type="button"
            className="btn btn-outline"
            onClick={clearFilters}
            disabled={!hasFilters}
          >
            Limpar filtros
          </button>
        </div>

        <p className="results-count" role="status">
          {filtered.length}{" "}
          {filtered.length === 1 ? "produto encontrado" : "produtos encontrados"}
        </p>

        {filtered.length === 0 ? (
          <p className="empty-state">
            {products.length === 0
              ? "Nenhum produto cadastrado no momento."
              : "Nenhum produto encontrado com esses filtros."}
          </p>
        ) : (
          <div className="products-grid">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currentExchangeRate={exchangeRate}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}