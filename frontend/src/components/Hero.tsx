import { INSTAGRAM_URL } from "@/utils/instagram";

interface HeroProps {
  totalProducts: number;
  totalCategories: number;
}

export default function Hero({ totalProducts, totalCategories }: HeroProps) {
  return (
    <section id="inicio" className="hero">
      <div className="hero-content">
        <span className="badge">Catálogo oficial SOKO Imports</span>
        <h1>Tecnologia e produtos importados em um só lugar.</h1>
        <p>
          Encontre produtos selecionados, consulte nosso catálogo e fale
          diretamente com a SOKO Imports para realizar seu pedido.
        </p>
        <div className="hero-actions">
          <a href="#produtos" className="btn btn-primary">
            Ver produtos
          </a>
          <a
            href={INSTAGRAM_URL}
            className="btn btn-outline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Falar no Instagram
          </a>
        </div>

        <dl className="hero-stats">
          <div>
            <dt>produtos no catálogo</dt>
            <dd>{totalProducts}</dd>
          </div>
          <div>
            <dt>categorias organizadas</dt>
            <dd>{totalCategories}</dd>
          </div>
          <div>
            <dt>atendimento no Instagram</dt>
            <dd>Direct</dd>
          </div>
        </dl>
      </div>

      <div className="hero-brand" aria-hidden="true">
        <strong>SOKO</strong>
        <span>IMPORTS</span>
      </div>
    </section>
  );
}
