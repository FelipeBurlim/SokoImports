import Link from "next/link";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/utils/instagram";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="logo">
            <strong>SOKO</strong>
            <small>IMPORTS</small>
          </div>
          <p>Tecnologia e produtos importados em um só lugar.</p>
        </div>

        <div>
          <h4>Navegação</h4>
          <nav className="footer-links" aria-label="Rodapé">
            <Link href="/#inicio">Início</Link>
            <Link href="/#produtos">Produtos</Link>
            <Link href="/#categorias">Categorias</Link>
            <Link href="/#sobre">Sobre</Link>
          </nav>
        </div>

        <div>
          <h4>Contato</h4>
          <div className="footer-links">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
              {INSTAGRAM_HANDLE}
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} SOKO Imports. Todos os direitos
          reservados.
        </span>
        <span>
          Preços e disponibilidade podem sofrer alterações. Consulte nossa
          equipe pelo Instagram.
        </span>
      </div>
    </footer>
  );
}
