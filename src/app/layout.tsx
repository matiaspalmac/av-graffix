import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { AppShell } from "@/components/app-shell";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://avgraffix.cl"),
  title: {
    default: "AV GRAFFIX | Agencia de Diseño y Producción",
    template: "%s | AV GRAFFIX",
  },
  description: "Agencia líder en diseño gráfico, producción pre-prensa y publicidad en la región de la Araucanía. Acompañamos el crecimiento de tu marca.",
  keywords: ["Diseño Gráfico", "Producción", "Publicidad", "Araucanía", "Temuco", "Branding", "Imprenta"],
  authors: [{ name: "AV GRAFFIX" }],
  openGraph: {
    title: "AV GRAFFIX | Diseño Gráfico Integral",
    description: "Soluciones creativas excepcionales que permiten a nuestros clientes destacar y dominar en un mercado competitivo.",
    url: "https://avgraffix.cl",
    siteName: "AV GRAFFIX",
    images: [
      {
        url: "/avgraffix.png",
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
    images: ["/avgraffix.png"],
  },
  icons: {
    icon: "/avgraffix.png",
    shortcut: "/avgraffix.png",
    apple: "/avgraffix.png",
  },
  manifest: "/site.webmanifest",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@value": "LocalBusiness",
  name: "AV GRAFFIX",
  image: "https://avgraffix.cl/avgraffix.png",
  url: "https://avgraffix.cl",
  telephone: "+56992791148",
  email: "patricia.valdebenito@avgraffix.cl",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Temuco",
    addressRegion: "Araucanía",
    addressCountry: "CL",
  },
  description:
    "Agencia líder en diseño gráfico, producción pre-prensa y publicidad en la región de la Araucanía.",
  foundingDate: "2006-11",
  sameAs: [
    "https://www.instagram.com/publicidad.avgraffix/",
    "https://www.facebook.com/publicidad.avgraffix/",
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "10:00",
      closes: "14:00",
    },
  ],
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
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
        {/* Skip to content - accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-brand-600 focus:text-white focus:rounded-lg focus:font-bold focus:shadow-xl focus:outline-none"
        >
          Saltar al contenido
        </a>
        <AppShell>{children}</AppShell>
        <SpeedInsights />
      </body>
    </html>
  );
}
