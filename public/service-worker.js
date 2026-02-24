const CACHE_NAME = 'av-graffix-erp-v1';
const STATIC_ASSETS = [
  '/avgraffix.png',
  '/erp/offline', // Página offline personalizada
];

// Rutas que NUNCA deben cachearse (Network-Only)
const NO_CACHE_PATHS = [
  '/api/auth',
  '/erp/login',
  '/erp/api',
];

// Rutas de autenticación que requieren Network-Only estricto
const AUTH_PATHS = [
  '/api/auth/signin',
  '/api/auth/signout',
  '/api/auth/session',
  '/api/auth/csrf',
  '/api/auth/providers',
  '/api/auth/callback',
];

function shouldNotCache(url) {
  return NO_CACHE_PATHS.some(path => url.includes(path));
}

function isAsset(url) {
  return /\.(js|css|png|jpg|webp|svg|woff|woff2)($|\?)/.test(url);
}

// Instalación
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.log('Some static assets could not be cached:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activación
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

// Fetch - Estrategia para ERP con autenticación
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo interceptar requests del ERP
  if (!url.pathname.startsWith('/erp')) {
    return;
  }

  // Ignorar requests que no sean GET, POST, PUT, DELETE, PATCH, HEAD
  if (!['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'].includes(request.method)) {
    return;
  }

  // NETWORK-ONLY para rutas de autenticación (crítico para sesiones)
  const isAuthPath = AUTH_PATHS.some(path => url.pathname.includes(path));
  if (isAuthPath) {
    event.respondWith(
      fetch(request, { 
        credentials: 'include',
        headers: {
          ...request.headers,
          'Cache-Control': 'no-cache'
        }
      }).catch(() => {
        return new Response(
          JSON.stringify({
            error: 'Sin conexión',
            message: 'No se puede autenticar sin conexión. Verifica tu conexión.',
            offline: true,
          }),
          {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({ 'Content-Type': 'application/json' }),
          }
        );
      })
    );
    return;
  }

  // NUNCA cachear otras rutas de API interna
  if (shouldNotCache(request.url)) {
    event.respondWith(
      fetch(request, { credentials: 'include' }).catch(() => {
        // Si falla la autenticación offline, redirigir a login
        if (request.method === 'GET') {
          return caches.match('/erp/login').catch(() => {
            return new Response(
              'Requiere conexión para acceder a esta página',
              {
                status: 503,
                statusText: 'Service Unavailable',
                headers: new Headers({ 'Content-Type': 'text/html' }),
              }
            );
          });
        }
        // Para POST/PUT/DELETE mostrar error
        return new Response(
          JSON.stringify({
            error: 'Sin conexión',
            message: 'No se puede conectar al servidor. Verifica tu conexión.',
            offline: true,
          }),
          {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({ 'Content-Type': 'application/json' }),
          }
        );
      })
    );
    return;
  }

  // Requests que modifican datos (POST, PUT, DELETE, PATCH)
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    event.respondWith(
      fetch(request, { credentials: 'include' }).catch(() => {
        return new Response(
          JSON.stringify({
            error: 'Sin conexión',
            message: 'No se puede conectar al servidor. Verifica tu conexión.',
            offline: true,
          }),
          {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({ 'Content-Type': 'application/json' }),
          }
        );
      })
    );
    return;
  }

  // GET requests - Network first, fallback a cache
  if (request.method === 'GET' || request.method === 'HEAD') {
    event.respondWith(
      fetch(request, { credentials: 'include' })
        .then((response) => {
          // Validar respuesta
          if (!response || response.status < 200 || response.status >= 300) {
            return response;
          }

          // NO cachear respuestas de error de autenticación
          if (response.status === 401 || response.status === 403) {
            return response;
          }

          // Cachear solo respuestas exitosas
          if (response.ok) {
            try {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseToCache).catch((err) => {
                  console.log('Cache put error:', err);
                });
              });
            } catch (err) {
              console.log('Error cloning response:', err);
            }
          }
          return response;
        })
        .catch(() => {
          // Intentar servir desde cache si falla red
          return caches.match(request).then((cached) => {
            if (cached) {
              return cached;
            }
            // Si no hay cache y offline, mostrar página offline personalizada
            if (request.destination === 'document') {
              return caches.match('/erp/offline').then((offlinePage) => {
                if (offlinePage) {
                  return offlinePage;
                }
                // Fallback final si no hay página offline en caché
                return new Response(
                  `<!DOCTYPE html>
                  <html>
                    <head>
                      <meta charset="utf-8">
                      <title>Sin conexión - AV GRAFFIX</title>
                      <style>
                        body { 
                          font-family: system-ui, -apple-system, sans-serif;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          min-height: 100vh;
                          margin: 0;
                          background: #fafafa;
                          color: #18181b;
                        }
                        .container {
                          text-align: center;
                          padding: 2rem;
                        }
                        h1 { font-size: 2rem; margin-bottom: 1rem; }
                        p { color: #71717a; }
                        button {
                          margin-top: 1.5rem;
                          padding: 0.75rem 1.5rem;
                          background: #7c3aed;
                          color: white;
                          border: none;
                          border-radius: 0.5rem;
                          font-weight: 600;
                          cursor: pointer;
                        }
                      </style>
                    </head>
                    <body>
                      <div class="container">
                        <h1>⚠️ Sin conexión</h1>
                        <p>No hay conexión a internet. Verifica tu red y vuelve a intentarlo.</p>
                        <button onclick="location.reload()">Reintentar</button>
                      </div>
                    </body>
                  </html>`,
                  {
                    status: 503,
                    statusText: 'Service Unavailable',
                    headers: new Headers({ 'Content-Type': 'text/html' }),
                  }
                );
              });
            }
            // Para assets o API, simplemente indicar que no hay conexión
            return new Response(
              'No disponible offline',
              {
                status: 503,
                statusText: 'Service Unavailable',
              }
            );
          });
        })
    );
    return;
  }
});

