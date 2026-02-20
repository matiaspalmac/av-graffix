import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import ProductNav from "@/components/productnav";
import Footer from "@/components/footer";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800", "900"]
});

export const metadata: Metadata = {
  title: "AV GRAFFIX | Agencia de Diseño y Producción",
  description: "Agencia líder en diseño gráfico, producción pre-prensa y publicidad en la región de la Araucanía. Acompañamos el crecimiento de tu marca.",
  keywords: ["Diseño Gráfico", "Producción", "Publicidad", "Araucanía", "Temuco", "Branding", "Imprenta"],
  authors: [{ name: "AV GRAFFIX" }],
  openGraph: {
    title: "AV GRAFFIX | Diseño Gráfico Integral",
    description: "Soluciones creativas excepcionales que permiten a nuestros clientes destacar y dominar en un mercado competitivo.",
    url: "https://avgraffix.vercel.app",
    siteName: "AV GRAFFIX",
    images: [
      {
        url: "/logo.png?v=2026",
        width: 1200,
        height: 630,
        alt: "AV GRAFFIX Logo",
      },
    ],
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AV GRAFFIX | Diseño Gráfico Integral",
    description: "Agencia líder en diseño gráfico, producción pre-prensa y publicidad en la región de la Araucanía.",
    images: ["/logo.png?v=2026"],
  },
  icons: {
    icon: "/logo.png?v=2026",
    shortcut: "/logo.png?v=2026",
    apple: "/logo.png?v=2026",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body
        className={`${outfit.variable} font-sans antialiased bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-500`}
      >
        <Header />
        <ProductNav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
