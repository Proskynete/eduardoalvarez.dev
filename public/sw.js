const staticCacheName = 'eduardo-alvarez-static-v1';

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
	'/images/isotipo/isotipo-blue.png',
	'/images/isotipo/isotipo-white.png',
	'/images/logo/logo.png',
	'/images/logo/white.png',
	'/images/logo/white2.png',
	'/images/me/eduardo_alvarez.png',
];

// install event
self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(staticCacheName).then((cache) => cache.addAll(assets)),
	);
});

// activate event
self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) =>
				Promise.all(
					keys
						.filter((key) => key !== staticCacheName)
						.map((key) => caches.delete(key)),
				),
			),
	);
});

// fetch event
self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches
			.match(event.request)
			.then((cacheRes) => cacheRes || fetch(event.request)),
	);
});
