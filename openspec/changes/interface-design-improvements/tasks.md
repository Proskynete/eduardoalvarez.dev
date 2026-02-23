# Tasks: Interface Design Improvements

## 1. Fixes críticos (bugs visibles)

- [ ] 1.1 Corregir formato de fecha en `src/layouts/article/components/head.astro`: reemplazar `toLocaleDateString()` por `toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })`
- [ ] 1.2 Verificar que el formato de fecha resultante coincide con el de la lista de artículos (ej. `29 de septiembre de 2024`)
- [ ] 1.3 Cambiar clase `bg-teal-700` por `bg-primary-500` en `src/components/scrolling-progress-bar/index.tsx`
- [ ] 1.4 Verificar que la barra de progreso se ve en color pink (#ec4899) al hacer scroll en un artículo

## 2. Categorías en tarjetas de artículos

- [ ] 2.1 Verificar si `src/utils/categories.ts` tiene un mapa de `CategoryAllowed` → etiqueta en español. Si no existe, crearlo con todos los valores: `web-development`, `javascript`, `react`, `vue`, `astro`, `node`, `express`, `sql`, `no-sql`
- [ ] 2.2 Actualizar `src/components/article/index.astro` para aceptar y renderizar la prop `categories`
- [ ] 2.3 Agregar el bloque de chips de categorías dentro del componente, debajo de la descripción, usando clases consistentes con el sistema de diseño (ej. `text-xs rounded-full px-2 py-0.5 bg-gray-800 text-gray-300`)
- [ ] 2.4 Verificar que en `/articulos` cada tarjeta muestra correctamente las categorías del artículo
- [ ] 2.5 Verificar que en la home (`/`) las 3 tarjetas de "Últimos artículos" muestran sus categorías
- [ ] 2.6 Verificar que artículos sin categorías no rompen el layout (render limpio sin chips ni espacios vacíos)

## 3. Estado activo en la navegación

- [ ] 3.1 En `src/layouts/base/components/header/index.astro`, usar `Astro.url.pathname` para determinar el link activo
- [ ] 3.2 Aplicar clases de estado activo al link correspondiente (ej. `text-white border-b border-primary-500` o equivalente coherente con la estética terminal)
- [ ] 3.3 Agregar `aria-current="page"` al link activo y asegurarse de que los demás links no lo tengan
- [ ] 3.4 Aplicar la misma lógica de estado activo al menú dropdown mobile (mismo archivo o componente relacionado)
- [ ] 3.5 Verificar en `/`, `/articulos`, `/charlas-talleres` y `/podcasts` que el link correcto se muestra activo
- [ ] 3.6 Verificar en `/articulos/algun-articulo` que el link `./artículos` sigue activo (match por prefijo)

## 4. Mejora del dropdown en Charlas/Talleres

- [ ] 4.1 En `src/components/dropdown/index.tsx`, agregar `aria-label="Ver opciones del evento"` y `title="Opciones"` al botón trigger
- [ ] 4.2 Agregar clases de hover al botón trigger: `hover:bg-gray-700 rounded-md transition-colors duration-150`
- [ ] 4.3 Verificar que el hover state es visible en `/charlas-talleres` al pasar el cursor sobre el botón `⋮`
- [ ] 4.4 Verificar que el dropdown sigue funcionando correctamente con teclado (Enter/Space para abrir, Escape para cerrar)

## 5. Correcciones de layout y tipografía

- [ ] 5.1 En `src/pages/index.astro`, cambiar la alineación del link "Ver todos los artículos →" de `text-right` a `text-left` (o eliminar la clase de alineación)
- [ ] 5.2 En `src/assets/styles/article.css`, cambiar `p { font-weight: 300; }` a `font-weight: 400`
- [ ] 5.3 En el mismo archivo, cambiar `line-height: 1.2` de los párrafos a `line-height: 1.6` para mejorar la legibilidad en lectura larga
- [ ] 5.4 Verificar que el texto de los artículos se lee cómodamente en el artículo de prueba (`/articulos/el-javascript-necesario-para-react-parte-3`)

## 6. Mejoras al formulario de suscripción

- [ ] 6.1 En `src/components/subscribe/index.astro`, cambiar el primer `<p>` con el texto "Recibe mensualmente..." a un `<h2>` (o `<h3>` si hay conflicto de jerarquía con headings existentes en la página) con clases `text-lg font-semibold font-hero`
- [ ] 6.2 Asegurarse de que el segundo párrafo de apoyo mantiene su estilo como texto secundario (`text-sm text-gray-400`)
- [ ] 6.3 Verificar que la sección de suscripción en la home tiene una jerarquía visual clara con el nuevo heading

## 7. Footer con copyright

- [ ] 7.1 En `src/layouts/base/components/footer/index.astro`, agregar un texto de copyright debajo del string terminal: `© {new Date().getFullYear()} Eduardo Álvarez`
- [ ] 7.2 Aplicar clases `text-xs text-gray-500 mt-2` al elemento de copyright para mantener la discreción visual
- [ ] 7.3 Verificar que el copyright aparece correctamente en todas las páginas y muestra el año actual (2026)

## 8. Audio player: duración del episodio

- [ ] 8.1 Agregar prop opcional `initialDuration?: string` al componente `src/components/audio-player/index.tsx`
- [ ] 8.2 Mostrar `initialDuration` en el display de duración cuando el audio no ha cargado aún (estado idle) — solo cuando `audioDuration` no está disponible
- [ ] 8.3 En `src/pages/podcasts/index.astro`, pasar la `duration` del frontmatter de cada episodio como `initialDuration` al componente `AudioPlayer`
- [ ] 8.4 Verificar en `/podcasts` que cada episodio muestra su duración real (ej. `1:18:00`) en lugar de `0:00` antes de reproducir

## 9. Verificación final

- [ ] 9.1 Recorrer todas las páginas (`/`, `/articulos`, `/articulos/[slug]`, `/charlas-talleres`, `/podcasts`) y confirmar visualmente que todos los cambios están aplicados
- [ ] 9.2 Ejecutar `npm run lint` para asegurar que no hay errores de linting introducidos
- [ ] 9.3 Ejecutar `npm run build` para confirmar que el sitio compila sin errores de TypeScript
- [ ] 9.4 Ejecutar `npm run test:run` y verificar que todos los tests existentes siguen pasando
- [ ] 9.5 Verificar en viewport mobile (375px) que la navegación activa y los chips de categoría se ven correctamente
