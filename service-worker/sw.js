var cacheName = 'marionavas-cache-v1';

self.addEventListener('install', function(e) {
	e.waitUntil(
		caches.open(cacheName).then(function(cache) {
			console.log('CACHING /INDEX.PHP');
			return cache.addAll([ './index.php', './manifest.json', './' ]);
		})
	);
	console.log('[Service Worker] Install');
});

self.addEventListener('activate', (e) => {
	console.log('Service Worker: Activated');
	e.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cache) => {
					if (cache !== cacheName) {
						console.log('Service Worker: Clearing Old Cache');
						return caches.delete(cache);
					}
				})
			);
		})
	);
});

self.addEventListener('fetch', function(e) {
	console.log('network or cache: ' + e.request.url);
	e.respondWith(
		caches.match(e.request).then(function(r) {
			return (
				r ||
				fetch(e.request)
					.then(async function(response) {
						return caches.open(cacheName).then(function(cache) {
							if (e.request.url.match(/\chrome\-extension/)) {
								return response;
							}
							console.log('Caching new resource: ' + e.request.url);
							cache.put(e.request, response.clone());
							return response;
						});
					})
					.catch(function(err) {
						console.log(err);
					})
			);
		})
	);
});
