import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#050505",
};

export const metadata: Metadata = {
  title: {
    default: "SOKO Imports | Catálogo de produtos importados",
    template: "%s | SOKO Imports",
  },
  description:
    "Consulte o catálogo da SOKO Imports, pesquise produtos e fale diretamente com a loja pelo Instagram.",
  keywords: [
    "SOKO Imports",
    "produtos importados",
    "iPhone",
    "MacBook",
    "Apple Watch",
    "tablets",
  ],
  openGraph: {
    title: "SOKO Imports | Catálogo de produtos importados",
    description:
      "Pesquise o catálogo e fale diretamente com a SOKO Imports pelo Instagram.",
    siteName: "SOKO Imports",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
