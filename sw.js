// Cache name has a timestamp because the browser re-caches the assets when the service worker file is modified
const staticCacheName = "timing-cache-" + "22-06-19-0000";
const assets = [
	'/timing/',
	'/timing/index.php',
	'/timing/timing.css',
	'/timing/timing.js',
	'/assets/ext/bootstrap.5.1.3.min.css',
];

self.addEventListener('install', (evt) => {
	evt.waitUntil(
		(async () => {
			const cache = await caches.open(staticCacheName);
			await cache.addAll(assets);
		})()
	);
});

self.addEventListener('activate', event => {
	event.waitUntil(
		(async () => {
			let cacheNames = await caches.keys();
			await Promise.all(cacheNames.map((cacheName) => {
				if (staticCacheName.indexOf(cacheName) === -1) return caches.delete(cacheName);
			}));
		})()
	);
});

self.addEventListener('fetch', function(event) {
	event.respondWith(
		(async () => {
			// try cache
			let response = await caches.match(event.request.url, {
				cacheName: staticCacheName,
				ignoreSearch: false
			});
			if (!!response) return response;

			// next try internet
			try {
				response = await fetch(event.request);
			} catch (e) {
				// if there's no internet, we'll ignore the query string
				return await caches.match(event.request.url, {
					cacheName: staticCacheName,
					ignoreSearch: true
				});
			}

			// add new file to cache (asynchronously)
			if (response.ok) {
				let clone = response.clone();
				caches.open(staticCacheName).then((cache) => cache.put(event.request, clone));
			}

			return response;
		})()
	);
});
