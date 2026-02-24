'use client';

import { useEffect } from 'react';

export function useOnlineSync() {
  useEffect(() => {
    const handleOnline = async () => {
      // Reintentar cualquier request pendiente cuando vuelve online
      const pendingSync = localStorage.getItem('erp-pending-sync');
      if (pendingSync) {
        try {
          const requests = JSON.parse(pendingSync);
          
          // Procesar requests pendientes
          for (const req of requests) {
            try {
              await fetch(req.url, {
                method: req.method,
                headers: req.headers,
                body: req.body ? JSON.parse(req.body) : undefined,
              });
            } catch {
              console.log('Request still pending:', req.url);
            }
          }
          
          // Limpiar si todo pasó bien
          localStorage.removeItem('erp-pending-sync');
          // Notificar que se sincronizó
          window.dispatchEvent(new CustomEvent('erp-sync-complete'));
        } catch (error) {
          console.log('Error parsing pending sync:', error);
        }
      }

      // Marcar como online en el DOM
      document.documentElement.classList.remove('offline-mode');
      document.documentElement.classList.add('online-mode');
    };

    const handleOffline = () => {
      // Marcar como offline en el DOM
      document.documentElement.classList.remove('online-mode');
      document.documentElement.classList.add('offline-mode');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Inicializar estado
    if (navigator.onLine) {
      handleOnline();
    } else {
      handleOffline();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
}
