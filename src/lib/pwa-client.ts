// lib/pwa-client.ts - Utilidades para asegurar compatibilidad PWA + Autenticación
// Este archivo proporciona funciones para manejar sesiones y cache sincronizado

export async function clearErpCache() {
  try {
    const cacheNames = await caches.keys();
    for (const name of cacheNames) {
      if (name.includes('av-graffix-erp')) {
        await caches.delete(name);
      }
    }
    console.log('ERP cache cleared');
  } catch (error) {
    console.log('Error clearing cache:', error);
  }
}

export async function isUserAuthenticated(): Promise<boolean> {
  try {
    const response = await fetch('/erp', {
      method: 'HEAD',
      credentials: 'include',
    });
    
    // Si obtenemos 401 o 403, no está autenticado
    return response.status !== 401 && response.status !== 403;
  } catch {
    // Si hay error de red, asumir que puede estar cached
    return true;
  }
}

export async function handleAuthError(response: Response) {
  if (response.status === 401 || response.status === 403) {
    // Limpiar cache y redirigir a login
    await clearErpCache();
    // El navegador manejará el redirect a /erp/login via el layout protegido
    return false;
  }
  return true;
}

export function notifyOnlineStatus(isOnline: boolean) {
  const event = new CustomEvent('erp-online-status', {
    detail: { isOnline },
  });
  window.dispatchEvent(event);
}
