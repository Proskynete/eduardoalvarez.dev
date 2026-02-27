## ADDED Requirements

### Requirement: La navegación principal indica visualmente la página activa

El header de navegación SHALL mostrar un indicador visual claro en el link correspondiente a la página actual. El indicador debe ser coherente con la estética terminal del sitio.

El link activo MUST tener `aria-current="page"` para cumplir con WCAG 2.1.

#### Scenario: Página home activa

- **WHEN** el usuario está en la URL `/`
- **THEN** el link `~/eduardoalvarez.dev` aparece visualmente destacado
- **THEN** los demás links no tienen el indicador activo

#### Scenario: Página de artículos activa

- **WHEN** el usuario está en la URL `/articulos` o cualquier sub-ruta como `/articulos/algun-articulo`
- **THEN** el link `./artículos` aparece visualmente destacado
- **THEN** los demás links no tienen el indicador activo

#### Scenario: Página de charlas activa

- **WHEN** el usuario está en la URL `/charlas-talleres`
- **THEN** el link `./charlas-talleres` aparece visualmente destacado

#### Scenario: Página de podcasts activa

- **WHEN** el usuario está en la URL `/podcasts` o sub-rutas como `/podcasts/episodio-1`
- **THEN** el link `./podcasts` aparece visualmente destacado

#### Scenario: Indicador accesible

- **WHEN** el link de la página activa es renderizado
- **THEN** el elemento tiene el atributo `aria-current="page"`
- **THEN** los otros links NO tienen `aria-current`

---

### Requirement: El dropdown de navegación mobile también refleja el estado activo

El menú desplegable mobile/tablet SHALL aplicar el mismo indicador visual al link de la página activa.

#### Scenario: Estado activo en menú mobile

- **WHEN** el usuario abre el menú de navegación en viewport mobile
- **THEN** el link de la página actual está visualmente destacado de forma consistente con el header desktop
