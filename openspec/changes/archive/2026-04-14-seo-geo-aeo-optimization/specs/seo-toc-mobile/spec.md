## ADDED Requirements

### Requirement: Tabla de contenidos visible en mobile

El componente `src/layouts/article/components/aside.astro` SHALL renderizar la tabla de contenidos (TOC) de forma accesible en todos los tamaños de pantalla. En mobile, el TOC SHALL ser un elemento colapsable usando `<details>`/`<summary>` nativo. En desktop (`xl:`), el comportamiento actual (aside fijo lateral) SHALL no cambiar.

#### Scenario: TOC es visible en mobile cuando el artículo tiene secciones
- **WHEN** un usuario accede a un artículo con `sections` definidas en un viewport < 1280px
- **THEN** el HTML SHALL contener un elemento `<details>` con la navegación de secciones
- **THEN** el elemento SHALL ser interactuable sin JavaScript

#### Scenario: TOC mobile usa details/summary nativo
- **WHEN** el TOC mobile se renderiza
- **THEN** el HTML SHALL contener `<details>` como contenedor y `<summary>` como trigger
- **THEN** el texto del `<summary>` SHALL ser `"Secciones del artículo"` o equivalente descriptivo

#### Scenario: TOC desktop no cambia
- **WHEN** un usuario accede a un artículo en un viewport ≥ 1280px (clase `xl:`)
- **THEN** el aside fijo lateral con el TOC SHALL seguir siendo visible sin cambios de estructura ni comportamiento

#### Scenario: TOC mobile incluye todos los links de sección
- **WHEN** el TOC mobile se renderiza
- **THEN** SHALL contener un `<nav aria-label="Tabla de contenidos">` con un enlace `<a href="#anchor">` por cada sección del artículo

#### Scenario: TOC no se renderiza si el artículo no tiene secciones
- **WHEN** un artículo no tiene `sections` definidas en su frontmatter
- **THEN** el elemento `<details>` del TOC mobile SHALL no renderizarse

---

### Requirement: TOC mobile es accesible (A11y)

#### Scenario: TOC mobile es operable con teclado
- **WHEN** un usuario navega con teclado
- **THEN** el elemento `<details>` SHALL ser expandible/colapsable con la tecla Enter o Space en el `<summary>`

#### Scenario: TOC mobile tiene label accesible en la nav
- **WHEN** el TOC mobile se renderiza
- **THEN** el elemento `<nav>` SHALL tener `aria-label="Tabla de contenidos"` idéntico al del TOC desktop
