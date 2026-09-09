## 1. La llave

- [x] 1.1 Añadir `podcastsEnabled` a `src/settings/podcasts.ts`, en `false`, documentando por qué está apagada y qué hace falta para encenderla
- [x] 1.2 Hacer que el item de nav lea la llave en vez de un `show: false` suelto

## 2. Las rutas

- [x] 2.1 `src/pages/podcasts/index.astro`: `prerender = false` y respuesta 404 mientras la llave esté apagada
- [x] 2.2 `src/pages/podcasts/[slug].astro`: `getStaticPaths` devuelve `[]` con la llave apagada
- [x] 2.3 Excluir `/podcasts` del sitemap en `astro.config.mjs`
- [x] 2.4 Verificar con `curl` que `/podcasts`, un episodio real y un slug inventado responden 404

## 3. Tests

- [x] 3.1 Añadir un bloque que verifique la sección cerrada: sin enlace, 404 en las dos rutas y sin rastro en el sitemap
- [x] 3.2 Saltar —no borrar— los bloques del índice y del episodio mientras la llave esté apagada
- [x] 3.3 Suite en verde

## 4. Cierre

- [x] 4.1 `npm run build` con `astro check` en 0 errores y sin `/podcasts` en `dist`
- [x] 4.2 Unitarios y e2e en verde
- [x] 4.3 Anotar en `redesign-podcast-index` que su delta de `site-navigation` queda superseded
