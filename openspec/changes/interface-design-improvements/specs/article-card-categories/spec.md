## ADDED Requirements

### Requirement: Las tarjetas de artículos muestran sus categorías

El componente de tarjeta de artículo (`src/components/article/index.astro`) SHALL renderizar los chips de categoría cuando la prop `categories` contiene al menos un valor.

Las categorías deben mostrarse con etiquetas legibles en español (ej. `javascript` → `JavaScript`, `web-development` → `Desarrollo Web`), usando el mapa existente de `src/utils/categories.ts`.

Los chips deben ser visualmente consistentes con los badges de categoría ya existentes en el sidebar del artículo individual.

#### Scenario: Tarjeta con categorías asignadas

- **WHEN** el artículo tiene `categories: ["javascript", "react"]` en su frontmatter
- **THEN** la tarjeta muestra dos chips: `JavaScript` y `React`
- **THEN** los chips aparecen debajo de la descripción del artículo

#### Scenario: Tarjeta sin categorías

- **WHEN** el artículo tiene `categories: []` o la prop no está presente
- **THEN** la tarjeta no muestra ningún chip ni espacio reservado para ellos

#### Scenario: Categorías visibles en la home

- **WHEN** el usuario visita la página principal (`/`)
- **THEN** las 3 tarjetas de "Últimos artículos" muestran sus respectivas categorías

#### Scenario: Categorías visibles en el listado de artículos

- **WHEN** el usuario visita `/articulos`
- **THEN** cada tarjeta en la lista muestra sus categorías como chips

---

### Requirement: Las categorías usan etiquetas legibles en español

El sistema SHALL mapear cada valor de `CategoryAllowed` a una etiqueta en español para mostrar al usuario. Los slugs técnicos no deben ser visibles.

#### Scenario: Mapeo de categorías conocidas

- **WHEN** la categoría es `web-development`
- **THEN** el chip muestra el texto `Desarrollo Web`

- **WHEN** la categoría es `javascript`
- **THEN** el chip muestra el texto `JavaScript`

- **WHEN** la categoría es `react`
- **THEN** el chip muestra el texto `React`

- **WHEN** la categoría es `vue`
- **THEN** el chip muestra el texto `Vue`

- **WHEN** la categoría es `astro`
- **THEN** el chip muestra el texto `Astro`

- **WHEN** la categoría es `node`
- **THEN** el chip muestra el texto `Node.js`

- **WHEN** la categoría es `express`
- **THEN** el chip muestra el texto `Express`

- **WHEN** la categoría es `sql`
- **THEN** el chip muestra el texto `SQL`

- **WHEN** la categoría es `no-sql`
- **THEN** el chip muestra el texto `NoSQL`

#### Scenario: Categoría sin mapeo conocido (fallback)

- **WHEN** la categoría tiene un valor no registrado en el mapa
- **THEN** el chip muestra el slug tal cual, sin crash ni omisión
