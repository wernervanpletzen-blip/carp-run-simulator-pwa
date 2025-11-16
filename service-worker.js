const CACHE_NAME = "carp-run-cache-v1";
const OFFLINE_URL = "./offline.html";

// Cache these files when the service worker installs
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./assets/logo.png",
  "./assets/CarpRunSound001.mp3",
  "./assets/fish/common_small.png",
  "./assets/fish/mirror_small.png",
  "./assets/fish/fullyscaled_small.png",
  "./assets/fish/ghost_small.png",
  "./assets/fish/koi_small.png",
  "./assets/fish/catfish_small.png",
  "./assets/icon-192.png",
  "./assets/icon-512.png"
];

// Install Service Worker
self.addEventListener("install", (event) => {
  console.log("[SW] Install");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );
  self.skipWaiting();
});

// Activate Service Worker
self.addEventListener("activate", (event) => {
  console.log("[SW] Activate");
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[SW] Removing old cache:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch (cache-first, then network fallback)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(event.request).catch(() => {
        // If offline and not in cache
        if (event.request.mode === "navigate") {
          return caches.match("./offline.html");
        }
      });
    })
  );
});
