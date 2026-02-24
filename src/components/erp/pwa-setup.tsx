'use client';

import { useEffect, useState } from 'react';
import { useOnlineSync } from '@/hooks/use-online-sync';
import { Download, X } from 'lucide-react';

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PwaSetup() {
  useOnlineSync();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // Registrar service worker solo si está disponible
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js', {
        scope: '/erp/',
      }).catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
    }

    // Cargar y aplicar preferencias del usuario desde localStorage
    const loadUserPreferences = () => {
      try {
        const savedTheme = localStorage.getItem('theme');
        const savedContrast = localStorage.getItem('highContrast');

        // Aplicar tema oscuro/claro
        if (savedTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else if (savedTheme === 'light') {
          document.documentElement.classList.remove('dark');
        }

        // Aplicar contraste alto
        if (savedContrast === 'true') {
          document.documentElement.classList.add('high-contrast');
        } else {
          document.documentElement.classList.remove('high-contrast');
        }
      } catch (error) {
        console.log('Error loading user preferences:', error);
      }
    };

    loadUserPreferences();

    // Detectar si está en modo PWA
    const isInPwaMode = () => {
      const nav = navigator as NavigatorWithStandalone;
      return (
        window.matchMedia('(display-mode: standalone)').matches ||
        nav.standalone === true ||
        document.referrer.includes('android-app://')
      );
    };

    if (isInPwaMode()) {
      document.documentElement.classList.add('pwa-mode');
    }

    // Listener para cambios de tema en tiempo real
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // Listener para cambios de conexión
    const handleOnline = () => {
      console.log('ERP Online - Conexión restaurada');
      document.documentElement.classList.add('online-mode');
      document.documentElement.classList.remove('offline-mode');
    };

    const handleOffline = () => {
      console.log('ERP Offline - Sin conexión a internet');
      document.documentElement.classList.add('offline-mode');
      document.documentElement.classList.remove('online-mode');
    };

    // Listener para logout - limpiar cache sensible
    const handleLogout = async () => {
      try {
        // Limpiar cache cuando el usuario hace logout
        const cacheNames = await caches.keys();
        for (const name of cacheNames) {
          if (name.includes('av-graffix-erp')) {
            await caches.delete(name);
            console.log('Cache cleared on logout');
          }
        }
        // Limpiar TODAS las preferencias y datos sensibles
        localStorage.clear();
        sessionStorage.clear();
        
        // Limpiar IndexedDB si se usa
        if ('indexedDB' in window) {
          const dbs = await indexedDB.databases?.();
          dbs?.forEach(db => {
            if (db.name?.includes('av-graffix')) {
              indexedDB.deleteDatabase(db.name);
            }
          });
        }
      } catch (error) {
        console.log('Error clearing cache on logout:', error);
      }
    };

    // Capturar evento de instalación de PWA
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevenir que el navegador muestre el prompt automático
      e.preventDefault();
      // Guardar el evento para usarlo después
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Verificar si el usuario ya rechazó la instalación recientemente
      const lastDismissed = localStorage.getItem('pwa-install-dismissed');
      const oneHour = 60 * 60 * 1000; // 1 hora en milisegundos
      
      if (lastDismissed) {
        const timeSinceDismissed = Date.now() - parseInt(lastDismissed);
        if (timeSinceDismissed < oneHour) {
          // No mostrar si fue rechazado hace menos de 1 hora
          return;
        }
      }
      
      // Mostrar nuestro prompt personalizado después de 3 segundos
      setTimeout(() => {
        // Solo mostrar si no está instalado
        const isInPwaMode = () => {
          const nav = navigator as NavigatorWithStandalone;
          return (
            window.matchMedia('(display-mode: standalone)').matches ||
            nav.standalone === true ||
            document.referrer.includes('android-app://')
          );
        };
        if (!isInPwaMode()) {
          setShowInstallPrompt(true);
        }
      }, 3000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('logout', handleLogout);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Estado inicial
    if (navigator.onLine) {
      document.documentElement.classList.add('online-mode');
    } else {
      document.documentElement.classList.add('offline-mode');
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('logout', handleLogout);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Mostrar el prompt de instalación
    deferredPrompt.prompt();

    // Esperar a que el usuario responda
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA instalada exitosamente');
    }

    // Limpiar el prompt guardado
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Guardar timestamp cuando el usuario rechazó la instalación
    // No se volverá a mostrar hasta dentro de 1 hora
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Render del prompt de instalación personalizado
  if (showInstallPrompt && deferredPrompt) {
    return (
      <div className="fixed bottom-4 left-4 right-4 lg:left-auto lg:right-4 lg:w-96 z-50 animate-in slide-in-from-bottom-5">
        <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl shadow-2xl p-5 text-white border border-brand-500/20">
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 p-1 hover:bg-white/20 rounded-lg transition"
            aria-label="Cerrar"
          >
            <X size={16} />
          </button>
          
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/10 rounded-xl">
              <Download size={24} />
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">Instalar AV GRAFFIX ERP</h3>
              <p className="text-sm text-white/90 mb-4">
                Accede más rápido y trabaja sin conexión. Instala nuestra app en tu dispositivo.
              </p>
              
              <div className="flex gap-2">
                <button
                  onClick={handleInstall}
                  className="flex-1 bg-white text-brand-600 font-semibold py-2.5 px-4 rounded-xl hover:bg-white/90 transition shadow-lg"
                >
                  Instalar ahora
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-4 py-2.5 text-sm font-medium text-white/90 hover:text-white transition"
                >
                  Después
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
