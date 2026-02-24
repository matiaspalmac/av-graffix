"use server";

import { headers } from "next/headers";
import { db } from "@/db/client";
import { loginSessions } from "@/db/schema";

/**
 * Registra una nueva sesión de login con tracking de dispositivo y ubicación
 */
export async function trackLoginSession(userId: number) {
  try {
    const headersList = await headers();
    
    // Obtener IP del usuario
    const forwardedFor = headersList.get("x-forwarded-for");
    const realIp = headersList.get("x-real-ip");
    const ipAddress = forwardedFor?.split(",")[0] || realIp || "unknown";
    
    // Obtener user agent
    const userAgent = headersList.get("user-agent") || "unknown";
    
    // Parsear user agent para extraer información de dispositivo
    const { device, browser, os } = parseUserAgent(userAgent);
    
    // TODO: Integrar API de geolocalización (ipapi.co, ip-api.com, etc.)
    // Por ahora dejamos city y country como null
    const city = null;
    const country = null;
    
    // Insertar sesión en la base de datos
    await db.insert(loginSessions).values({
      userId,
      ipAddress,
      userAgent,
      device,
      browser,
      os,
      city,
      country,
      loginAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
      isActive: true,
    });
    
    console.log(`✅ Login session tracked for user ${userId} from ${ipAddress}`);
  } catch (error) {
    console.error("Error tracking login session:", error);
    // No lanzamos error para no bloquear el login
  }
}

/**
 * Parsea el user agent para extraer información de dispositivo, browser y OS
 */
function parseUserAgent(userAgent: string): {
  device: string;
  browser: string;
  os: string;
} {
  let device = "Desktop";
  let browser = "Unknown";
  let os = "Unknown";
  
  // Detectar dispositivo
  if (/Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    if (/iPad|Tablet/i.test(userAgent)) {
      device = "Tablet";
    } else {
      device = "Smartphone";
    }
  }
  
  // Detectar browser
  if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
    browser = "Chrome";
  } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    browser = "Safari";
  } else if (userAgent.includes("Firefox")) {
    browser = "Firefox";
  } else if (userAgent.includes("Edg")) {
    browser = "Edge";
  } else if (userAgent.includes("OPR") || userAgent.includes("Opera")) {
    browser = "Opera";
  }
  
  // Detectar OS
  if (userAgent.includes("Windows NT 10.0")) {
    os = "Windows 10/11";
  } else if (userAgent.includes("Windows NT 6.3")) {
    os = "Windows 8.1";
  } else if (userAgent.includes("Windows NT 6.2")) {
    os = "Windows 8";
  } else if (userAgent.includes("Windows NT 6.1")) {
    os = "Windows 7";
  } else if (userAgent.includes("Windows")) {
    os = "Windows";
  } else if (userAgent.includes("Mac OS X")) {
    const match = userAgent.match(/Mac OS X (\d+[._]\d+)/);
    os = match ? `macOS ${match[1].replace("_", ".")}` : "macOS";
  } else if (userAgent.includes("Android")) {
    const match = userAgent.match(/Android (\d+(\.\d+)?)/);
    os = match ? `Android ${match[1]}` : "Android";
  } else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
    const match = userAgent.match(/OS (\d+_\d+)/);
    os = match ? `iOS ${match[1].replace("_", ".")}` : "iOS";
  } else if (userAgent.includes("Linux")) {
    os = "Linux";
  }
  
  return { device, browser, os };
}
