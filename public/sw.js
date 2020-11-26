const dynamicCacheName = 'site-dynamic-v1';

const assets = [
	'/',
	'/favicon/favicon.ico',
	'/fonts/Hero/bold.otf',
	'/fonts/Hero/bold.ttf',
	'/fonts/Hero/light.otf',
	'/fonts/Hero/light.ttf',
	'/fonts/Hero/regular.otf',
	'/fonts/Hero/regular.ttf',
	'/fonts/Roboto/black-italic.ttf',
	'/fonts/Roboto/black.ttf',
	'/fonts/Roboto/bold-condensed-italic.ttf',
	'/fonts/Roboto/bold-condensed.ttf',
	'/fonts/Roboto/bold-italic.ttf',
	'/fonts/Roboto/bold.ttf',
	'/fonts/Roboto/condensed-italic.ttf',
	'/fonts/Roboto/condensed.ttf',
	'/fonts/Roboto/italic.ttf',
	'/fonts/Roboto/light-italic.ttf',
	'/fonts/Roboto/light.ttf',
	'/fonts/Roboto/medium-italic.ttf',
	'/fonts/Roboto/medium.ttf',
	'/fonts/Roboto/regular.ttf',
	'/fonts/Roboto/thin-italic.ttf',
	'/fonts/Roboto/thin.ttf',
	'/images/404/error.png',
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
self.addEventListener('install', (e) => {
	e.waitUntil(
		caches.open(dynamicCacheName).then((cache) => {
			console.log('caching shell assets');
			cache.addAll(assets);
		}),
	);
});

// activate event
self.addEventListener('activate', (e) => {
	e.waitUntil(
		caches
			.keys()
			.then((keys) =>
				Promise.all(
					keys
						.filter((key) => key !== dynamicCacheName)
						.map((key) => caches.delete(key)),
				),
			),
	);
});

// fetch event
self.addEventListener('fetch', (e) => {
	e.respondWith(
		caches.match(e.request).then(
			(cacheRes) =>
				cacheRes ||
				fetch(e.request).then((fetchRes) =>
					caches.open(dynamicCacheName).then((cache) => {
						cache.put(e.request.url, fetchRes.clone());
						return fetchRes;
					}),
				),
		),
	);
});
