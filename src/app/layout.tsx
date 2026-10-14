import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#7544A0",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://clickmodas25.com.br"),
  title: {
    default: "Click Modas 25 | Moda Infantil do Tamanho 2 ao 16 em São Paulo",
    template: "%s | Click Modas 25",
  },
  description:
    "Loja virtual especializada em moda infantil (tamanhos 2 a 16). Vestidos, conjuntos, peças delicadas e confortáveis com retirada na Galeria Arco-Íris ou envio a combinar via WhatsApp.",
  keywords: [
    "moda infantil",
    "click modas 25",
    "roupas infantis sp",
    "vestidos infantis",
    "conjuntos infantis",
    "galeria arco iris",
    "roupas tamanho 2 a 16",
    "moda infantil 25 de março",
  ],
  authors: [{ name: "Click Modas 25" }],
  creator: "Click Modas 25",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://clickmodas25.com.br",
    title: "Click Modas 25 | Moda Infantil do Tamanho 2 ao 16",
    description:
      "Vestidos, conjuntos e moda infantil delicada para momentos inesquecíveis. Atendimento personalizado e pedidos pelo WhatsApp.",
    siteName: "Click Modas 25",
    images: [
      {
        url: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=1200&auto=format&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "Click Modas 25 - Moda Infantil",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Click Modas 25 | Moda Infantil 2 ao 16",
    description: "Vestidos e conjuntos infantis confortáveis e de alta qualidade.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <CartProvider>
          {children}
          <Toaster richColors position="top-right" />
        </CartProvider>
      </body>
    </html>
  );
}
