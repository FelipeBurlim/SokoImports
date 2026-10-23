import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";
import { isAuthenticated } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Painel",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const authenticated = await isAuthenticated();

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div className="admin-header-inner">
          <Link href="/admin" className="logo" aria-label="Painel SOKO Imports">
            <Image
              src="/logo-soko.png"
              alt=""
              width={36}
              height={36}
              className="logo-img"
            />
            <span className="logo-text">
              <strong>SOKO</strong>
              <small>PAINEL</small>
            </span>
          </Link>

          <nav className="admin-nav">
            {authenticated && (
              <>
                <Link href="/admin">Produtos</Link>
                <Link href="/admin/produtos/novo">Novo produto</Link>
              </>
            )}
            <Link href="/" target="_blank">
              Ver site
            </Link>
            {authenticated && (
              <form action={logoutAction}>
                <button type="submit" className="btn btn-outline">
                  Sair
                </button>
              </form>
            )}
          </nav>
        </div>
      </header>

      <main className="admin-main">{children}</main>
    </div>
  );
}
