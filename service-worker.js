self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("carp-run-cache-v1").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/manifest.json",
        "/assets/logo.png",
        "/assets/CarpRunSound001.mp3",
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
