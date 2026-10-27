// Service worker mínimo: deixa o app abrir sem internet depois da primeira visita.
// Estratégia "rede primeiro": se há internet, sempre pega a versão nova (evita
// professora presa numa versão velha); se não há, usa a cópia guardada.
// Requisições a OUTROS domínios (Supabase) nunca passam por aqui.
const CACHE = "desenvolve-mais-v1";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) { const copia = res.clone(); caches.open(CACHE).then((c) => c.put(req, copia)); }
        return res;
      })
      .catch(() => caches.match(req).then((r) => r || caches.match("./")))
  );
});
