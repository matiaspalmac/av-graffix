import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/erp/", // Sistema privado para empleados
        "/erp", // Proteger raíz del ERP también
      ],
    },
    sitemap: "https://avgraffix.cl/sitemap.xml",
  }
}
