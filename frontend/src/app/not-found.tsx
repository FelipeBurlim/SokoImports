import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="section-container not-found">
        <h1>Página não encontrada</h1>
        <p>O produto ou a página que você procura não existe mais.</p>
        <Link href="/#produtos" className="btn btn-primary">
          Ver catálogo
        </Link>
      </main>
      <Footer />
    </>
  );
}
