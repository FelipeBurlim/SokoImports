import Link from "next/link";
import { INSTAGRAM_URL } from "@/utils/instagram";

export default function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <Link
          href="/#inicio"
          className="logo"
          aria-label="SOKO Imports — início"
        >
          <strong>SOKO</strong>
          <small>IMPORTS</small>
        </Link>
        <nav className="nav" aria-label="Navegação principal">
          <Link href="/#inicio">Início</Link>
          <Link href="/#produtos">Produtos</Link>
          <Link href="/#categorias">Categorias</Link>
          <Link href="/#sobre">Sobre</Link>
          <Link href="/#contato">Contato</Link>
        </nav>
        <a
          href={INSTAGRAM_URL}
          className="btn-instagram"
          target="_blank"
          rel="noopener noreferrer"
        >
          Falar no Instagram
        </a>
      </div>
    </header>
  );
}
