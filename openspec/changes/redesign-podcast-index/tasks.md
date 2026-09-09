## 1. Helpers de formato del índice

- [x] 1.1 Crear `src/utils/podcasts.ts` con `formatDuration(minutes)` movido desde `src/pages/podcasts/index.astro` (hoy vive inline y el detalle tiene su propia copia)
- [x] 1.2 Añadir `formatGuests(guests)`: `""` con cero invitados, `con {a}` con uno, `con {a} y {b}` con dos, `con {a} y {n} más` con tres o más
- [x] 1.3 Añadir `totalDuration(episodes)` que devuelve la suma en minutos, y `groupByYear(episodes)` que devuelve los grupos ya ordenados descendente por año y por fecha dentro del grupo
- [x] 1.4 Escribir `tests/units/utils/podcasts.test.ts` cubriendo los cuatro: singular/plural, cero/uno/dos/tres invitados, suma con lista vacía, y orden de grupos
- [x] 1.5 Verificar con `npm run test:unit:run` que pasan antes de tocar la vista

## 2. El componente de fila

- [x] 2.1 Crear `src/components/podcast-row/index.astro` con props `episode: PodcastEpisode` y `latest?: boolean`
- [x] 2.2 Maquetar la fila como un `<a>` a `/podcasts/{slug}` con `group`, superficie `surface`, `rounded-card`, `border-hairline` y `focus-ring` — sin `Card`, porque el enlace es el contenedor
- [x] 2.3 Columna del número: `text-2xl font-mono tabular-nums`, dos dígitos con cero a la izquierda, `text-text-muted` → `group-hover:text-accent`, `aria-hidden="true"`, separada por un hairline vertical
- [x] 2.4 Nombre accesible: `<span class="sr-only">Episodio {n}.</span>` delante del título
- [x] 2.5 Título con `Text as="h3" variant="ui"` y `font-medium`, `group-hover:text-accent`
- [x] 2.6 Meta con `Text variant="meta" tone="muted"`: fecha formateada en es-ES, duración y `formatGuests`, unidos por `·` y omitiendo los segmentos vacíos
- [x] 2.7 Resumen con `Text variant="label" tone="secondary"` y `line-clamp-1` (`sm:line-clamp-2`)
- [x] 2.8 Badge `Último` con `Badge variant="accent"`, sólo cuando `latest`
- [x] 2.9 Caret `<Icon as={CaretRight} />`, `aria-hidden`, muted → accent, sin `transform` en hover
- [x] 2.10 Verificar a 390px que la fila mide ≥44px de alto

## 3. La página

- [x] 3.1 En `src/pages/podcasts/index.astro`, borrar el mapa de tarjetas completo: cabecera con imagen, `AudioPlayer`, `PodcastGuest`, tags, botones de plataforma y "Ver episodio"
- [x] 3.2 Quitar los imports que quedan huérfanos (`Image`, `AudioPlayer`, `PodcastGuest`, `platformIcons`, `Badge`, `Card`, `CardContent`, `CardFooter`, `buttonVariants`) y comprobar con `npm run lint` que no queda ninguno sin usar
- [x] 3.3 Renderizar la línea de totales bajo `PageHeader` con `Text variant="meta" tone="muted"`, en singular cuando haya un solo episodio
- [x] 3.4 Renderizar los grupos por año: encabezado del año y sus filas, con al menos 8px de separación entre filas
- [x] 3.5 Marcar `latest` en el primer episodio del primer grupo, y sólo en ése
- [x] 3.6 Conservar el `EmptyState` actual para cuando no haya episodios visibles, sin totales ni encabezados de año
- [x] 3.7 Verificar que el listado ya no hidrata React: tras `npm run build`, `dist/client/podcasts/index.html` no contiene `<audio>` y las únicas islas que quedan son las del layout (`SiteNav`, `ScrollingProgressBar`) — ninguna del listado

## 4. Verificación visual y de accesibilidad

- [x] 4.1 Capturar el listado a 390px, 768px y 1440px y comparar con el diseño acordado
- [x] 4.2 Recorrer el listado con teclado y confirmar anillo de foco visible en cada fila y orden de tabulación igual al visual
- [x] 4.3 Confirmar que en hover no se mueve nada (sólo color y borde)
- [x] 4.4 Confirmar que la marca `Último` aparece una sola vez
- [x] 4.5 Revisar el listado en tema claro, que es donde los tokens de borde suelen fallar

## 5. Tests end to end

- [x] 5.1 Crear `tests/e2e/podcasts.spec.ts`
- [x] 5.2 Test: hay una fila por episodio visible y cada una enlaza a su slug
- [x] 5.3 Test: el listado no contiene ningún `<audio>` ni enlaces a plataformas
- [x] 5.4 Test: los años aparecen en orden descendente
- [x] 5.5 Test: exactamente una fila lleva el badge `Último`
- [x] 5.6 Ejecutar `npx playwright test` y dejar la suite en verde

## 6. Cierre

- [x] 6.1 `npm run build` con `astro check` en 0 errores
- [x] 6.2 `npm run test:unit:run` y `npx playwright test` en verde
- [x] 6.3 Comprobar que `/podcasts/[slug]` sigue intacta: reproductor, notas, invitados y plataformas
- [x] 6.4 Commit siguiendo conventional commits, referenciando este change
