## 1. Cabecera

- [x] 1.1 En `src/pages/podcasts/[slug].astro`, eliminar el contenedor `h-64 md:h-80` con el degradado y el velo `from-black/90`
- [x] 1.2 Reconstruir la cabecera sobre la superficie de la página: badge `Episodio {n}`, meta (`fecha · duración · con invitados`) usando `formatDuration` y `formatGuests` de `src/utils/podcasts.ts`, y `<h1>` con el token de texto primario
- [x] 1.3 Mover los badges de tema a la cabecera y eliminar la sección "Temas tratados" con su `h2`
- [x] 1.4 Renderizar `image` como portada junto a la cabecera sólo cuando exista, sin contenedor de altura fija cuando no
- [x] 1.5 Verificar en tema claro que el `<h1>` se lee (era la excepción de "texto blanco fijo")

## 2. Reproductor

- [x] 2.1 Sacar `AudioPlayer` de la `Card` y eliminar `CardHeader`/`CardTitle` "Escuchar episodio"
- [x] 2.2 Quitar `title={podcast.title}` del reproductor: el título ya está en el `<h1>` justo encima
- [x] 2.3 Verificar a 390×844 que el botón de play es visible sin scroll

## 3. Orden por ancho

- [x] 3.1 Separar el aside en dos bloques: invitados por un lado, plataformas y compartir por otro
- [x] 3.2 Ordenar con `order` en móvil —invitados antes que el cuerpo, acciones después— manteniendo un único árbol en el DOM
- [x] 3.3 Verificar en desktop que el raíl derecho conserva los tres bloques en su orden actual
- [x] 3.4 Comprobar que ningún bloque quedó duplicado para móvil y escritorio

## 4. Verificación

- [x] 4.1 Capturar a 390px, 820px y 1440px y comparar con el diseño
- [x] 4.2 Confirmar un solo `<h1>` y que el reproductor no repite el título
- [x] 4.3 Recorrer con teclado: orden de tabulación coherente con el orden visual en ambos anchos
- [x] 4.4 Medir el alto total en móvil antes y después
- [x] 4.5 Revisar en tema claro

## 5. Tests

- [x] 5.1 Ampliar `tests/e2e/podcasts.spec.ts` con un bloque para la página de episodio
- [x] 5.2 Test: un solo `<h1>`, y no existe el encabezado "Escuchar episodio"
- [x] 5.3 Test: no existe el encabezado "Temas tratados" y los badges de tema están en la cabecera
- [x] 5.4 Test: en móvil los invitados aparecen antes que las notas
- [x] 5.5 Test: el reproductor sigue montando su `<audio>`
- [x] 5.6 Dejar la suite en verde

## 6. Cierre

- [x] 6.1 `npm run build` con `astro check` en 0 errores
- [x] 6.2 Unitarios y e2e en verde
- [x] 6.3 Commit siguiendo conventional commits, referenciando este change

## 7. Segunda pasada: componer, no sólo quitar

- [x] 7.1 Componer el panel de escucha: número en mono, ruta, `<h1>`, meta, invitados y reproductor sobre el tinte de acento del sistema
- [x] 7.2 Rejilla en el panel para que en móvil el número comparta fila con la ruta y el título ocupe el ancho entero
- [x] 7.3 Crear `src/components/podcast-guest-chips/index.tsx` — `Avatar` es de Radix y su contexto no cruza una plantilla `.astro`
- [x] 7.4 Pasar el reproductor a `compact` con `title`, y verificar que el flotante aparece al dejar atrás el panel
- [x] 7.5 Añadir `withHeadingAnchors` e `initials` a `src/utils/podcasts.ts`, con tests
- [x] 7.6 Renderizar el índice "En este episodio" con anclas reales
- [x] 7.7 Añadir la navegación anterior/siguiente al pie
- [x] 7.8 Ampliar los e2e: panel, flotante, anclas del índice y navegación entre episodios
