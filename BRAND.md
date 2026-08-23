# BRAND.md

**Registro de implementación** del sistema «Identidad Eduardo Álvarez · v1 · 2026».

La fuente de verdad de la marca es el **handoff de diseño** (`design_handoff_identidad/`):
concepto, paleta, tipografía, niveles de marca, componentes, slides y merch. Este archivo
no lo duplica. Documenta tres cosas que el handoff no puede saber:

1. **Dónde vive cada token** en los cinco repositorios.
2. **Qué se corrigió** del handoff y por qué, con la medición.
3. **Qué queda pendiente.**

---

## 1. Correcciones aplicadas sobre el handoff

Verifiqué las afirmaciones de contraste del handoff de forma independiente. El modo oscuro
está bien —dos valores incluso mejor de lo que afirma—. **El modo claro tenía dos fallos
AA**, y ese modo cubre `cursos` entero, más PDF e impresión.

| Token | El handoff afirma | Medido | Implementado | Resultado |
| --- | --- | --- | --- | --- |
| `accent.dark` sobre paper | 4.6:1 | `#0f8f80` → **3.57:1** | `#0d7c6f` | 4.55:1 |
| `warm.dark` sobre paper | 4.8:1 | `#b4632a` → **3.95:1** | `#a65b27` | 4.54:1 |

Son colores de link y de acento en modo claro, o sea **texto**: bajo 4.5:1 no cumplen AA.
Las correcciones conservan tono y saturación; solo bajan luminosidad. Si se prefieren los
originales del handoff, son dos valores y están comentados en cada archivo.

El resto de lo afirmado se sostiene o es conservador:

| Token | Afirma | Real |
| --- | --- | --- |
| `text.primary` | 16.9:1 | 16.84:1 |
| `text.secondary` | 8.9:1 | **9.50:1** |
| `text.muted` | 4.9:1 | **5.57:1** |
| `accent` bioluz | 10.7:1 | 10.31:1 |
| `warm` arena | 9.4:1 | 9.28:1 |
| `mascota.cuerpo` | 4.3:1 | 4.22:1 — por eso es **solo relleno, nunca texto** |

**El diagnóstico central quedó resuelto.** Los neutros del sistema anterior estaban a
**0.0% de saturación** mientras la mascota vive al 65% en la familia azul: no había un solo
puente cromático y la ilustración se veía pegada encima. Los neutros v1 están entre 57% y
64%.

---

## 2. Dónde vive cada token

| Proyecto | Stack | Archivo de tokens | Modo |
| --- | --- | --- | --- |
| `eduardoalvarez.dev` | Astro · Tailwind **v3** | `tailwind.config.mjs` | oscuro |
| `links` | Astro · Tailwind **v4** | `src/assets/css/styles.css` (`@theme`) | oscuro |
| `cursos.eduardoalvarez.dev` | Next · Tailwind v4 · shadcn | `app/globals.css` (`:root` + `.dark`) | **claro** ⚠ ver §4 |
| `blog-content-manager` | Next · Tailwind v4 · shadcn | `src/app/globals.css` | oscuro |
| `resume` | Vite · Tailwind v4 | `src/assets/styles/index.css` (`@theme`) | **claro** (es un documento) |

### Notas por proyecto

- **`resume` va en la rama `paper`, no en la del abismo.** Es el README de GitHub y un CV
  imprimible: un documento, no una pantalla. Con los tokens oscuros los títulos de sección
  quedaban en espuma sobre blanco, invisibles. Sus nombres `primary`/`secondary`/`tertiary`
  se conservan como alias (están en 12 lugares) repuntados al sistema.
- **`cursos` conserva el token `gold`** como alias de `warm`: mismo rol semántico (logro,
  diplomas, celebración) y evita reescribir decenas de usos.
- **`links`** perdió su `tailwind.config.mjs` v3 muerto (`primary: colors.pink`, fuentes
  `Hero`/`roboto`) y los binarios de fuentes que nadie cargaba. Cero referencias, verificado.

### Tipografía

Trío del sistema: **Bricolage Grotesque** (display, solo titulares), **Geist** (cuerpo),
**JetBrains Mono** (código, rutas, etiquetas, metadatos, firma CLI).

- Astro autoaloja en `public/fonts/`; Next las carga con `next/font/google`.
- La display se aplica en la capa base a `h1,h2,h3`, no con utilidades sueltas, para que no
  se escape a párrafos por descuido — el handoff la prohíbe en cuerpo.
- Geist Mono queda derogada en los cinco proyectos, incluida la excepción que tenía `cursos`
  de usarla como voz de titular.

### Bloques de código

`src/settings/shiki-arrecife.ts` sigue la spec del handoff al pie: keywords arena, strings
bioluz, comentarios plancton, identificadores espuma, sobre fondo casco `#0B1524`. Son
cuatro colores a propósito. Los literales numéricos y booleanos van con los strings —el
handoff no los asigna y agruparlos es más coherente que inventar un quinto color.
Todos pasan AA. Monokai, el tema anterior, dejaba los comentarios en 3.7:1.

---

## 3. Regeneración de assets

Los assets de marca no se editan a mano:

```
scripts/brand.mjs                    ← geometría, colores y escalas. Se edita ACÁ.
scripts/generate-manifest-icons.mjs  ← favicons, .ico, manifest, safari-pinned-tab
scripts/generate-og-default.mjs      ← imagen Open Graph

npm run brand:assets                 ← regenera todo
```

> Ambos generadores venían apuntando a `isotipo-solid.svg` —el EA-01 retirado— con
> `#0a0a0a` horneado. Correrlos habría revertido el rebranding en silencio. Ya están
> corregidos; conviene revisar este tipo de trampa antes de cerrar cualquier cambio
> de identidad.

---

## 4. Escala tipográfica

Aplicada en los cinco proyectos, en la capa base. Los máximos son los del handoff;
van envueltos en `clamp()` porque el handoff especifica la escala de escritorio y el
móvil necesita bajar:

| Rol | Máximo | Cómo se usa |
| --- | --- | --- |
| display | 76px / 800 / −0.035em / 0.96 | clase `.t-display` — solo el titular principal |
| h1 | 44px / 700 / −0.03em / 1.05 | elemento `h1` |
| h2 | 30px / 600 / −0.02em / 1.1 | elemento `h2` |
| h3 | 25px / 600 / −0.02em / 1.15 | elemento `h3` |
| ui | 15px | clase `.t-ui` |
| label | 13px | clase `.t-label` |
| eyebrow | 12px / mono / 0.12em / uppercase | clase `.t-eyebrow` |

**Se retiraron las utilidades de tamaño solo de la jerarquía de documento** (los `h1` de
página y los `h2` de sección principal). Los `h2`/`h3` con `text-xl`, `text-lg` o `text-sm`
son títulos de tarjeta y etiquetas de sidebar: ahí 30px sería un error, así que conservan
su tamaño. La escala es jerarquía, no un martillo.

---

## 5. Modo por proyecto

`cursos` está **en claro**, como asigna el handoff. Al conmutarlo aparecieron dos defectos
que solo se ven ejecutando, y quedan documentados porque se repetirán en cualquier
superficie que cambie de modo:

1. **La aleta espuma es invisible sobre fondo claro.** Es la «regla crítica de la aleta» del
   propio handoff: fondo oscuro → `fin-espuma.png`; fondo claro → `fin.png` (dos azules).
   El componente `Logo` tiene la prop `sobre` y en cursos su default es `"claro"`.
2. **Arena tiene dos roles que no se pueden mezclar.** Como **relleno** (botón, píldora)
   es `#f2a65a` en ambos modos, con tinta `#2a1605` encima. Como **texto sobre fondo claro**
   es `#a65b27`, porque `#f2a65a` sobre paper no llega al mínimo AA. El token `gold` de
   cursos resuelve a la variante de texto, consciente del modo; los dos rellenos usan
   `bg-warm text-warm-ink`.

Verificado en `/login`, `/privacidad` y `/terminos`. Las rutas con datos no se pudieron
comprobar: requieren la base local corriendo.

---

## 6. Librería de componentes

`Design System.dc.html` (v1.0.0) está implementado como capa `@layer components` en
`src/assets/styles/base.css`. Los valores salen literalmente del archivo del sistema.

| Clase | Spec |
| --- | --- |
| `.btn .btn-primario` | bg `#35D6C0` · tinta `#06171A` · 15/500 · pad 12×22 · r10 · focus ring 2px offset 3px |
| `.btn .btn-secundario` | borde `#2C4D5D` · transparente · **nunca se rellena**, ni en hover |
| `.btn .btn-conversion` | bg `#F2A65A` · tinta `#2A1605` · solo cursos, charlas y mentoría |
| `.btn-terciario` | mono, formato `./algo →`, hover bioluz subrayado offset 4px |
| `.btn-sm` / `.btn-lg` / `.btn-icono` | 8×14 r8 · 15×30 r12 · 42×42 r10 |
| `.campo` | bg `#0B1620` · borde `#22414F` · r10 · pad 13×16 · **foco sin outline**, solo borde bioluz |
| `.pill-categoria` | píldora r999 mono 11.5px arena, borde `#4A3A25` |
| `.pill-estado` | cuadrada r6, fondo al 8% del color semántico, borde al 22% |
| `.tarjeta` | bg `#0B1620` · borde `#1E3441` · r14 · pad 26 · hover borde `#2C4D5D` |
| `.aviso` | r12, glifo mono a la izquierda — **nunca emoji** |
| `.estado-vacio` | cara 66px + título 15/500 + explicación 13.5 muted |
| `.skeleton` | shimmer 1.4s lineal, respeta `prefers-reduced-motion` |

**Regla que conviene no olvidar:** un solo botón arena por pantalla. Es el de conversión.

### Verificación con Playwright

`tests/e2e/design-system.spec.ts` — 14 pruebas que **no comprueban que se vea bien, sino
que los valores siguen ahí**. Es lo que evita la deriva silenciosa: alguien cambia un token
por un hex a mano y nadie se entera hasta seis meses después.

```
npx playwright test design-system
```

Cubre: fondo abismo, display en titulares, JetBrains en la nav, ausencia total de colores
del sistema anterior, nav de 64px con blur 14px, los tres estados del botón primario, que
el secundario nunca se rellene, el anillo de foco, la tarjeta completa, la píldora de
categoría, que los artículos sean objetos y no filas, y la aleta en nav y bloque de código.

> De paso arreglé una inestabilidad previa en `tests/e2e/accessibility.spec.ts`: usaba
> `waitForLoadState("networkidle")`, que con el dev server nunca se asienta (HMR, prefetch)
> y hacía fallar por timeout una página distinta en cada corrida — sin llegar a ejecutar
> axe. Ahora espera una condición real del DOM. Las 7 pasan.

---

## 7. Modo claro

Se activa con `data-tema="claro"` en `<html>`. El conmutador vive en la nav y persiste
en `localStorage`.

**El oscuro es el default y no se conmuta solo por el ajuste del sistema operativo** —
es el modo primario de la marca. El claro es una elección explícita.

Para que el modo claro cambie *todo* el sitio y no solo los componentes propios, los
colores de Tailwind pasaron a **variables CSS en tripletas R G B**
(`rgb(var(--c-surface) / <alpha-value>)`). Con hex fijos, `data-tema` no podía tocar las
utilidades —`bg-surface`, `text-text-primary`— que son la mayor parte del marcado. La
sintaxis `<alpha-value>` conserva los modificadores de opacidad tipo `bg-surface/40`.

**Regla que manda en claro:** el acento NO se usa como fondo de botón primario. Bioluz y
arena no dan contraste con texto oscuro encima, así que el primario pasa a casco sólido
(`#0b1524` sobre `#f6f2ea`) y los acentos viven en sus variantes oscuras.

**La aleta conmuta sola.** El componente `Isotipo` renderiza las dos variantes y el CSS
elige: la de espuma desaparece sobre papel y la de dos azules sobre abismo. Se resuelve
en el componente y no en cada sitio de uso, que es justo donde se olvida.

El bootstrap vive en `public/tema.js` y se carga al final del `<head>`. No está inline
porque el compilador de Astro no acepta un `<script>` en la parte alta de `head.astro`
—ni escrito a mano ni vía `set:html`—; el error aparece en la línea siguiente al script,
lo que despista. Al final del `<head>` sigue ejecutándose antes de pintar el `<body>`,
así que no hay destello.

---

## 8. Secciones de página

El sistema define **dos patrones y nada más**, y la asimetría entre ellos es deliberada.

**Hero de portada** (`.hero-portada`) — uno por sitio. Es el **único** bloque con degradado
y la **única** pose de mascota. r16 · pad 44/40/40 · texto al 62% del ancho · display 800/64
· eyebrow mono bioluz uppercase 0.12em. La pose sangra por el borde inferior derecho, nunca
centrada; en móvil baja bajo los botones y se centra.

> Ese último detalle depende del **orden del DOM**, no de una clase: la pose va después del
> contenido para que al pasar a `position: static` en móvil caiga donde debe. Con la pose
> primero, en móvil aparecía arriba del titular. Hay una aserción de geometría en
> `design-system.spec.ts` que lo bloquea.

**Encabezado de página interna** (`.encabezado-pagina`) — sin degradado, sin pose, sin
fondo. La ruta en mono muted hace de eyebrow · h1 44/700 · bajada 17px máx 62ch · contexto
15px máx 66ch. El mismo patrón en las seis internas. **Es lo que hace que la portada se
sienta especial.**

**Newsletter** (`.panel-newsletter`) — panel fosa r16 pad 30 máx 760 centrado. En fila desde
640px; bajo eso apilado y botón a ancho completo. El aviso de éxito va **bajo** el
formulario, no lo reemplaza. La cara de Tiburoncín va aquí y en el 404, en ningún otro lugar
del portfolio.

**Avisos** — el sistema pasó de hex fijos a **fondo al 10% del color semántico con el borde
al 100%**. Se expresa con `color-mix` para que siga el token del tema.

---

## 9. Trampa: `typos` mutila los nombres de clase en español

El repo usa la herramienta `typos`, y su `.typos.toml` ya venía con una lista larga de
palabras en español que hubo que ir permitiendo. Con las clases del sistema pasó lo mismo,
pero **el daño fue silencioso**:

```
.hero-portada       →  .hero-portad          (le comió la «a»)
.seccion-newsletter →  .section-newsletter
.pill-categoria     →  .pill-category
```

El CSS quedaba sintácticamente válido, así que **no hubo ningún error**: simplemente los
selectores dejaron de coincidir con el marcado y las reglas no aplicaban. El hero perdió su
posicionamiento y la píldora de categoría desapareció. Lo detectaron las pruebas de
Playwright, no el compilador ni el linter.

**Si añades una clase nueva en español, agrégala también a `.typos.toml`.** Ya están
permitidos: `portada`, `seccion`, `categoria`, `pagina`, `bajada`, `titular`, `migas`,
`indice`, `promesa`, `ilustracion`, `escritorio`, `espuma`, `aleta`, `casco`, `tema`,
`claro`, `oscuro`, `marca`, `encabezado`, `tarjeta`, `campo`, `aviso`, `arena`.

---

## 10. Contenido del artículo

- **Prose** — 18/1.75 en bruma, máximo 68ch, h2 y h3 en display.
- **Cita** — borde arena de 3px, cursiva y **sin fondo**. El sistema es explícito.
- **Código inline** — sobre corriente, r4, pad 2px 6px.
- **Índice** — resalta la sección en la que está el lector.

> El scroll-spy marca el **último encabezado que ya pasó la línea de lectura**, no el que
> esté dentro de una franja. La primera versión usaba `IntersectionObserver` con una franja
> estrecha, y en una sección larga la franja quedaba vacía: el resaltado desaparecía justo
> a media lectura, que es cuando más sirve.

---

## 11. Sin clases propias: todo en utilidades de Tailwind

La capa `@layer components` fue **eliminada por completo**. Los estilos viven como
utilidades en el marcado; lo que se repite se encapsula en un componente Astro, no en una
clase CSS. En `base.css` solo quedan los tokens, las `@font-face`, la escala tipográfica
base y dos helpers de keyframes que no se pueden expresar como utilidades
(`.wave-bar`, `.animate-cursor-ping`).

Los estados cuelgan de atributos, no de clases: `aria-[current=page]:border-accent` para
el activo de la nav, `aria-[pressed=true]:bg-surface-raised` para el tab, y
`aria-[invalid=true]:border-error` para el campo con error. El atributo **es** el estado,
así que no hay que sincronizar una clase con él desde JS.

Para las reglas que cambian de token entre temas hay una variante propia:

```js
addVariant("light", 'html[data-theme="light"] &')
```

Con eso se expresa en utilidades la regla del sistema de que en claro el botón primario
pasa a casco sólido: `bg-accent light:bg-mascota-casco`.

### Todo el código va en inglés

Clases, identificadores, nombres de archivo y comentarios. La copia de cara al usuario
sigue en español, que es el idioma del sitio. Assets en `public/brand/`
(`fin-foam.png`, `fin.png`, `face-*.png`, `pose-*.png`).

Esto además resuelve de raíz la trampa de `typos` de la sección 9: sin identificadores en
español no hay nada que la herramienta pueda mutilar.

### Las pruebas no seleccionan por clases de estilo

Cuando se movieron los estilos a utilidades, **seis pruebas se cayeron de golpe** porque
localizaban por `.tarjeta`, `.pill-categoria` y demás. Ahora usan locators semánticos
(`getByRole`, `aria-label`) o `data-testid`. El estilo puede cambiar sin tocar la suite.

---

## 12. Estado por proyecto

| Proyecto | Tokens | Clases propias | Modo claro | Aleta | Pie del sistema |
| --- | --- | --- | --- | --- | --- |
| `eduardoalvarez.dev` | ✅ | 2 (keyframes) | ✅ con conmutador | ✅ conmuta sola | ✅ |
| `links` | ✅ | 0 | ✅ con conmutador | ✅ conmuta sola | ✅ |
| `resume` | ✅ | 0 | documento claro | ✅ dos azules | — |
| `cursos` | ✅ | shadcn | ✅ es su modo | ✅ default claro | ✅ multicolumna |
| `blog-content-manager` | ✅ | shadcn | oscuro | ✅ en el sidebar | — |

Notas por proyecto:

- **`links`** es la superficie donde la mascota es protagonista: pose grande arriba, con la
  misma deriva de flotación del hero del blog.
- **`resume`** lleva la aleta de **dos azules**, no la de espuma: es un documento claro y la
  de espuma desaparecería sobre papel.
- **`cursos`** conserva el token `gold` como alias de arena, consciente del modo. Su `Logo`
  tiene el default en `light` porque toda la superficie lo es.
- **`blog-content-manager`** cambió el glifo genérico de documento por la aleta. El sistema
  le asigna solo la aleta: sin caras fuera de estados vacíos.

### La variante del tema se declara distinto según la versión de Tailwind

```
v3 (blog)   plugin(({ addVariant }) => addVariant("light", 'html[data-theme="light"] &'))
v4 (links)  @custom-variant light (html[data-theme="light"] &);
```

Mismo resultado, sintaxis distinta. Es el tipo de detalle que cuesta media hora si no
está escrito.

---

## 13. Pendiente

1. **Vectorizar la aleta, la cabeza y la mascota.** Es el bloqueo real y lo asumió Eduardo.
   Sin vectores no hay favicon nítido, bordado, pin ni print sobre 200 mm. Los assets del
   handoff son PNG recortados de una hoja de 1536×1024: cada pose queda en ~350×280 px, y
   una calcomanía de 5 cm a 300 dpi necesita ~590×590.
   - Mientras tanto, `cursos` usa `fin-espuma.png` como isotipo (`components/brand/logo.tsx`
     y `app/icon.png`). Es provisional y está marcado como tal en el código.
   - La aleta vectorial anterior (`public/logos/aleta-*.svg`) **no es la marca del handoff**:
     era solo la silueta, sin ola ni manchas. Queda fuera de circulación.
2. **Revisar `cursos` en claro con datos reales.** Las rutas que dependen de la base
   (`/`, `/cursos`, `/mis-cursos`, admin) no se pudieron ver. Volver a oscuro es reponer la
   clase `dark` en `app/layout.tsx`.
3. **Los tres focos de rigidez pendientes** del diagnóstico anterior: listados que son filas
   de tabla en vez de objetos, y 67 de 81 transiciones idénticas sin tokens de movimiento.
   El handoff dice «los estados se comunican con borde y color, no con movimiento», así que
   la parte de motion queda acotada por diseño.
4. **Reservar `@tiburoncin`** en redes y el subdominio.
5. **Generador de OG** con las dos plantillas del handoff (artículo y curso).
