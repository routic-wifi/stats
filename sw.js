// Service worker of the installed app: every request goes to the network first, so the numbers are always fresh;
// the last good answer is kept and shown when there is no connection.
const CACHE = 'stats-v1';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  // One cache entry per file: data.json?t=… and index.html#view are the same thing offline.
  const key = url.origin + url.pathname;
  e.respondWith(fetch(e.request).then((r) => {
    if (r.ok) { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(key, copy)); }
    return r;
  }).catch(() => caches.match(key).then((r) => r || Response.error())));
});
