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
Podcast         → /podcasts
```

**Hidden from nav (accessible via URL):**
```
Admin           → /admin      (internal tool)
Newsletter      → /newsletter (linked from footer and subscribe CTAs)
Projects        → /projects   (linked from homepage and about)
```

El podcast sale de "Hidden from nav". Estaba declarado como `Podcast → /podcast (no-index, no nav link)` y el enlace se activó en `d3cb5b0` sin actualizar este spec; la ruta real es `/podcasts`, en plural. El `no-index` que esta requirement declaraba nunca llegó a implementarse —`head.astro` emite `robots: index, follow` en todas las páginas y el sitemap ya incluye `/podcasts/` y sus episodios— así que se retira del texto en lugar de seguir describiendo un comportamiento que el sitio no tiene.

#### Scenario: Desktop navigation renders all items
- **WHEN** the page is viewed on a viewport ≥ 1024px
- **THEN** all seven nav items SHALL be visible inline in the header

#### Scenario: Active link is highlighted
- **WHEN** the user is on the `/articles` page
- **THEN** the "Articles" nav item SHALL have the `accent` color applied to indicate current page

#### Scenario: El podcast es alcanzable desde la navegación
- **WHEN** se carga cualquier página del sitio
- **THEN** la navegación primaria SHALL contener un enlace a `/podcasts`
- **THEN** ese enlace SHALL aparecer también en el cajón de navegación móvil
