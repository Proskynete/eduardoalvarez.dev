const staticCacheName = 'site-static-v1';

const assets = [
	'/',
	'/favicon/favicon.ico',
	'/fonts/Hero/bold.ttf',
	'/fonts/Hero/light.ttf',
	'/fonts/Hero/regular.ttf',
	'/fonts/Roboto/italic.ttf',
	'/fonts/Roboto/light.ttf',
	'/fonts/Roboto/light-italic.ttf',
	'/fonts/Roboto/regular.ttf',
	'/images/404/error.png',
	'/images/articles/',
	'/images/author/sin-fondo.gif',
	'/images/author/sin-fondo.png',
	'/images/author/super-pixel.png',
	'/images/isotipo/isotipo-blue.png',
	'/images/isotipo/isotipo-white.png',
	'/images/logo/black.png',
	'/images/logo/black2.png',
	'/images/logo/logo.png',
	'/images/logo/white.png',
	'/images/logo/white2.png',
	'/images/me/eduardo_alvarez.png',
];

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(staticCacheName)
			.then((cache) => {
				return cache.addAll(assets);
			})
			.catch((error) => {
				console.log(error);
			}),
	);
});

self.addEventListener('activate', (event) => {
	const cacheAllowlist = ['pages-cache-v1', 'blog-posts-cache-v1'];

	event.waitUntil(
		caches.keys().then((cacheNames) =>
			Promise.all(
				cacheNames.map((cacheName) => {
					if (cacheAllowlist.indexOf(cacheName) === -1) {
						return caches.delete(cacheName);
					}
				}),
			),
		),
	);
});

self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches.match(event.request).then((response) => {
			if (response) {
				return response;
			}
			return fetch(event.request);
		}),
	);
});
