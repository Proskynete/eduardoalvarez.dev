# site-navigation Specification

## Purpose
Navegación principal, navegación móvil, cabecera, pie y redirecciones de rutas.
## Requirements
### Requirement: Primary navigation structure
The site SHALL have a primary navigation with the following links, defined in `src/layouts/base/components/header/constants/index.ts`. The navigation SHALL be consistent across all pages via the base layout header.

**Nav items (in order):**
```
Artículos → /articles
Charlas   → /speaking
Cursos    → https://cursos.eduardoalvarez.dev   (externo)
Sobre_mí  → /about
```

**Hidden from nav (accessible via URL):**
```
Newsletter → /newsletter (linked from footer and subscribe CTAs)
```

**Behind a switch (not reachable at all while it is off):**
```
Podcast    → /podcasts   (`podcastsEnabled` in src/settings/podcasts.ts)
```

El podcast no está «oculto de la navegación»: está apagado. Mientras la llave sea `false` no hay enlace y tampoco hay ruta, así que la distinción con la newsletter —alcanzable escribiendo la URL— es real y por eso lleva lista propia.

#### Scenario: Desktop navigation renders all items
- **WHEN** the page is viewed on a viewport ≥ 1024px
- **THEN** the four nav items SHALL be visible inline in the header

#### Scenario: Active link is highlighted
- **WHEN** the user is on the `/articles` page
- **THEN** the "Artículos" nav item SHALL have the `accent` color applied to indicate current page

#### Scenario: El enlace a cursos se mide
- **WHEN** se pulsa «Cursos» en la barra o en el cajón móvil
- **THEN** SHALL enviarse `select_content` (ver `observability`)

#### Scenario: Con la llave apagada no hay enlace al podcast
- **WHEN** `podcastsEnabled` es `false`
- **THEN** ni la barra ni el cajón móvil SHALL contener un enlace a `/podcasts`

#### Scenario: El podcast es alcanzable desde la navegación
- **WHEN** `podcastsEnabled` es `true`
- **THEN** SHALL aparecer un enlace a `/podcasts`, en último lugar
- **THEN** ese enlace SHALL aparecer también en el cajón de navegación móvil

### Requirement: Mobile navigation
The site SHALL have a mobile navigation that collapses the primary nav into a hamburger menu on viewports < 768px.

**Behavior:**
- Hamburger icon (☰) appears in header replacing inline links
- Clicking opens a full-width overlay or slide-in drawer
- Drawer shows all nav items vertically, large touch targets (min 44px height)
- Clicking any link or the close button (✕) closes the drawer
- Opening the drawer traps focus inside (accessibility)

#### Scenario: Mobile nav opens on tap
- **WHEN** user taps the hamburger icon on mobile
- **THEN** the navigation drawer SHALL open with all nav items visible

#### Scenario: Mobile nav closes on navigation
- **WHEN** user selects a nav item in the mobile drawer
- **THEN** the drawer SHALL close and the page SHALL navigate to the selected route

#### Scenario: Focus is trapped in open mobile nav
- **WHEN** the mobile nav drawer is open
- **THEN** Tab key navigation SHALL cycle only within the drawer elements

---

### Requirement: Header layout and behavior
The header SHALL be sticky (fixed to top), 64px tall, with the wordmark on the left and navigation on the right.

**Header structure:**
```
[Logo/Wordmark] ←————————————→ [Nav items] [Search icon]
```

**Behavior:**
- Sticky on scroll (position: fixed, top: 0)
- Background: `surface` (#111111) with bottom border `surface-border`
- On scroll > 0: subtle backdrop-blur added for depth
- Search icon (🔍) opens Algolia search modal (existing functionality, restyled)

#### Scenario: Header is always visible on scroll
- **WHEN** the user scrolls down any page
- **THEN** the header SHALL remain fixed at the top of the viewport

#### Scenario: Header shows blur on scroll
- **WHEN** the user scrolls past 1px
- **THEN** a `backdrop-blur-sm` effect SHALL be applied to the header background

---

### Requirement: Footer layout
The footer SHALL be arrecife's `Footer`, composed in `src/layouts/base/components/footer/site-footer.tsx`: the brand (isotipo + "Eduardo Álvarez"), one row of social links, and the «Creado con Arrecife» signature (`builtWith`).

**Social row (in order, Phosphor glyphs at one weight):**
```
GitHub · LinkedIn · X · Instagram · RSS · Correo · Newsletter
```

**Cookies:** when the cookie preferences panel exists (production build with `PUBLIC_GA_ID`), a «./cookies» button under the footer SHALL open it (see `cookie-preferences`).

#### Scenario: Footer links are accessible
- **WHEN** a keyboard user tabs through the footer
- **THEN** all links SHALL be focusable with visible focus indicators

#### Scenario: Social icons have accessible labels
- **WHEN** a screen reader reaches a social icon
- **THEN** each icon link SHALL have an `aria-label` describing the destination

#### Scenario: Sin panel no hay enlace a cookies
- **WHEN** el build no es de producción o falta `PUBLIC_GA_ID`
- **THEN** el pie SHALL NO contener «./cookies»

### Requirement: URL redirects for renamed routes
The system SHALL serve 301 redirects for all URLs that changed or were retired.

**Redirects (in `vercel.json`):**
```
/articulos             → /articles          (301)
/articulos/:path*      → /articles/:path*   (301)
/charlas-talleres      → /speaking          (301)
/donaciones            → /                  (301, donations removed)
/stack                 → /about             (301, page retired)
/projects              → /about             (301, page retired)
/working-with-me       → /about             (301, page retired)
```

#### Scenario: Old article URL redirects correctly
- **WHEN** a user visits `/articulos/el-javascript-necesario-para-react-parte-1`
- **THEN** the browser SHALL be redirected to `/articles/el-javascript-necesario-para-react-parte-1` with a 301 status

#### Scenario: Old talks URL redirects
- **WHEN** a user visits `/charlas-talleres`
- **THEN** the browser SHALL be redirected to `/speaking` with a 301 status

#### Scenario: Retired pages redirect to about
- **WHEN** a user visits `/stack`, `/projects` or `/working-with-me`
- **THEN** the browser SHALL be redirected to `/about` with a 301 status

