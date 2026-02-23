"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header";
import ProductNav from "@/components/productnav";
import StickyNav from "@/components/sticky-nav";
import Footer from "@/components/footer";
import WhatsAppCTA from "@/components/whatsapp-cta";
import ScrollToTop from "@/components/scroll-to-top";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isErp = pathname.startsWith("/erp");

  return (
    <>
      {!isErp ? (
        <StickyNav>
          <Header />
          <ProductNav />
        </StickyNav>
      ) : null}

      <main id="main-content">{children}</main>

      {!isErp ? <Footer /> : null}
      {!isErp ? <WhatsAppCTA /> : null}
      {!isErp ? <ScrollToTop /> : null}
    </>
  );
}
