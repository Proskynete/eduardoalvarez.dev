## MODIFIED Requirements

### Requirement: Primary navigation structure
The site SHALL have a primary navigation with the following links. The navigation SHALL be consistent across all pages via the base layout header.

**Nav items (in order):**
```
Articles        → /articles
Speaking        → /speaking
Now             → /now
Stack           → /stack
About           → /about
Working with Me → /working-with-me
```

**Hidden from nav (accessible via URL):**
```
Admin           → /admin      (internal tool)
Newsletter      → /newsletter (linked from footer and subscribe CTAs)
Projects        → /projects   (linked from homepage and about)
```

**Behind a switch (not reachable at all while it is off):**
```
Podcast         → /podcasts   (`podcastsEnabled` in src/settings/podcasts.ts)
```

El podcast no está «oculto de la navegación»: está apagado. Mientras la llave sea `false` no hay enlace y tampoco hay ruta, así que la distinción con las tres de arriba —alcanzables escribiendo la URL— es real y por eso lleva lista propia.

#### Scenario: Desktop navigation renders all items
- **WHEN** the page is viewed on a viewport ≥ 1024px
- **THEN** all six nav items SHALL be visible inline in the header

#### Scenario: Active link is highlighted
- **WHEN** the user is on the `/articles` page
- **THEN** the "Articles" nav item SHALL have the `accent` color applied to indicate current page

#### Scenario: Con la llave apagada no hay enlace al podcast
- **WHEN** `podcastsEnabled` es `false`
- **THEN** ni la barra ni el cajón móvil SHALL contener un enlace a `/podcasts`

#### Scenario: Con la llave encendida el podcast cierra la navegación
- **WHEN** `podcastsEnabled` es `true`
- **THEN** SHALL aparecer un enlace a `/podcasts`, en último lugar
