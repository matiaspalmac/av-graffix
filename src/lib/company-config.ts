"use server";

import { db } from "@/db/client";
import { companySettings } from "@/db/schema";

/**
 * Tipos para los settings de la empresa
 */
export interface CompanyConfig {
  nameFull: string;
  nameCommercial: string;
  rut: string;
  address: string;
  city: string;
  region: string;
  country: string;
  commune: string;
  businessType: string; // "PUBLICIDAD"
  phone: string;
  email: string;
  website: string;
  siiStatus: string; // Ej: "Contribuyente"
}

/**
 * Configuración por defecto de la empresa AV GRAFFIX
 */
const DEFAULT_COMPANY_CONFIG: Record<string, string> = {
  company_name_full: "AV GRAFFIX DISEÑO Y PRODUCCION PUBLICITARIA LTDA",
  company_name_commercial: "AV GRAFFIX",
  company_rut: "77.096.036-3",
  company_address: "Providencia 123, Temuco",
  company_city: "Temuco",
  company_region: "Región de La Araucanía",
  company_country: "Chile",
  company_commune: "Temuco",
  company_business_type: "PUBLICIDAD",
  company_phone: "+56 9 9279 1148",
  company_email: "info@avgraffix.cl",
  company_website: "https://avgraffix.cl",
  company_sii_status: "Contribuyente",
};

/**
 * Cache en memoria (se recarga cada hora o al reiniciar servidor)
 */
let settingsCache: Record<string, string> | null = null;
let cacheTime = 0;
const CACHE_DURATION = 3600000; // 1 hora

/**
 * Obtiene configuración de la empresa desde la BD
 * Con cache en memoria para optimizar performance
 */
export async function getCompanySettings(): Promise<CompanyConfig> {
  const now = Date.now();

  // Usar cache si está fresco
  if (settingsCache && now - cacheTime < CACHE_DURATION) {
    return mapSettingsToConfig(settingsCache);
  }

  try {
    const settings = await db.select().from(companySettings);
    const settingsMap: Record<string, string> = {};

    for (const setting of settings) {
      settingsMap[setting.key] = setting.value;
    }

    settingsCache = settingsMap;
    cacheTime = now;

    return mapSettingsToConfig(settingsMap);
  } catch (error) {
    console.error("[getCompanySettings] Error reading from DB:", error);
    // Retornar valores por defecto si hay error
    return mapSettingsToConfig(DEFAULT_COMPANY_CONFIG);
  }
}

/**
 * Obtiene un solo setting por clave
 */
export async function getCompanySetting(key: string): Promise<string | null> {
  try {
    const config = await getCompanySettings();
    const keyMap: Record<string, keyof CompanyConfig> = {
      company_name_full: "nameFull",
      company_name_commercial: "nameCommercial",
      company_rut: "rut",
      company_phone: "phone",
      company_email: "email",
      company_city: "city",
      company_region: "region",
      company_business_type: "businessType",
    };

    const configKey = keyMap[key] as keyof CompanyConfig;
    return configKey ? (config[configKey] as string) || null : null;
  } catch (error) {
    console.error("[getCompanySetting] Error:", error);
    return DEFAULT_COMPANY_CONFIG[key] || null;
  }
}

/**
 * Mapea registros de BD a objeto tipado CompanyConfig
 */
function mapSettingsToConfig(settingsMap: Record<string, string>): CompanyConfig {
  return {
    nameFull: settingsMap.company_name_full || DEFAULT_COMPANY_CONFIG.company_name_full,
    nameCommercial:
      settingsMap.company_name_commercial || DEFAULT_COMPANY_CONFIG.company_name_commercial,
    rut: settingsMap.company_rut || DEFAULT_COMPANY_CONFIG.company_rut,
    address: settingsMap.company_address || DEFAULT_COMPANY_CONFIG.company_address,
    city: settingsMap.company_city || DEFAULT_COMPANY_CONFIG.company_city,
    region: settingsMap.company_region || DEFAULT_COMPANY_CONFIG.company_region,
    country: settingsMap.company_country || DEFAULT_COMPANY_CONFIG.company_country,
    commune: settingsMap.company_commune || DEFAULT_COMPANY_CONFIG.company_commune,
    businessType:
      settingsMap.company_business_type || DEFAULT_COMPANY_CONFIG.company_business_type,
    phone: settingsMap.company_phone || DEFAULT_COMPANY_CONFIG.company_phone,
    email: settingsMap.company_email || DEFAULT_COMPANY_CONFIG.company_email,
    website: settingsMap.company_website || DEFAULT_COMPANY_CONFIG.company_website,
    siiStatus: settingsMap.company_sii_status || DEFAULT_COMPANY_CONFIG.company_sii_status,
  };
}

/**
 * Actualiza un setting (solo para admins)
 * NO USAR en producci— mejor usar endpoint protegido
 */
export async function updateCompanySetting(key: string, value: string) {
  try {
    // Limpiar cache
    settingsCache = null;

    await db
      .insert(companySettings)
      .values({
        key,
        value,
        description: `Updated ${new Date().toISOString()}`,
      })
      .onConflictDoUpdate({
        target: companySettings.key,
        set: {
          value,
          updatedAt: new Date().toISOString(),
        },
      });

    return true;
  } catch (error) {
    console.error("[updateCompanySetting] Error:", error);
    return false;
  }
}

/**
 * Obtiene la configuración formateada para mostrar en UI
 * Ejemplo: "AV GRAFFIX - Temuco - +56 9 9279 1148"
 */
export async function getCompanyFooter(): Promise<string> {
  const config = await getCompanySettings();
  return `${config.nameCommercial} – ${config.city} – ${config.phone}`;
}

/**
 * Obtiene el encabezado formateado para documentos
 */
export async function getCompanyHeader(): Promise<string> {
  const config = await getCompanySettings();
  return `${config.nameFull}\n${config.businessType}\n${config.city}, ${config.region}, ${config.country}\n${config.phone}`;
}
