const CACHE_NAME = "media-cache-v1";

const CACHEABLE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".svg",
  ".mp4",
  ".webm",
  ".ogg",
];

function shouldCache(url) {
  // https://media-ds.fra1.cdn.digitaloceanspaces.com/2KK8BW2Cex2b7gPajOQaFnVUrz4/2mvSHjfkEP7AaF1TQLiZ19jnXnA/mch-digital-trendshow-august-2024_1080p.mp4
  // should cache all urls which contain "digitaloceanspaces"

  return (
    CACHEABLE_EXTENSIONS.some((ext) => url.toLowerCase().endsWith(ext)) &&
    url.toLowerCase().includes("digitaloceanspaces")
  );
}
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache opened");
      // Hier können Sie einige wichtige Assets vorab cachen
      // return cache.addAll(['/important-image.jpg', '/intro-video.mp4']);
    })
  );
});

self.addEventListener("fetch", (event) => {
  if (shouldCache(event.request.url)) {
    console.log(`fetching ${event.request.url}`);

    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response) {
            console.log(`cache hit for ${event.request.url}`);
            // Asset ist im Cache, geben Sie es zurück
            return response;
          }

          console.log(`cache miss for ${event.request.url}`);

          if (event.request.headers.get("range")) {
            console.log("it has a range header");

            // Create a new headers object without the range header
            const newHeaders = new Headers(event.request.headers);
            newHeaders.delete("range");

            // Create a new request with the modified headers
            const rangeRequest = new Request(event.request.url, {
              method: event.request.method,
              headers: newHeaders,
              mode: event.request.mode,
              credentials: event.request.credentials,
              cache: event.request.cache,
              redirect: event.request.redirect,
              referrer: event.request.referrer,
              integrity: event.request.integrity,
            });

            return fetch(rangeRequest).then((networkResponse) => {
              const responseToCache = networkResponse.clone();
              cache.put(event.request, responseToCache);
              return networkResponse;
            });
          }

          // Asset ist nicht im Cache, holen Sie es vom Netzwerk
          return fetch(event.request).then((networkResponse) => {
            // Kopieren Sie die Antwort, da sie nur einmal verwendet werden kann
            const responseToCache = networkResponse.clone();

            cache.put(event.request, responseToCache);
            console.log(`cached ${event.request.url}`);
            return networkResponse;
          });
        });
      })
    );
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
