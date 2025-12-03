# Plan de Implementación: Accesibilidad con Screen Readers

## Índice

1. [Estrategia General](#estrategia-general)
2. [Fases de Implementación](#fases-de-implementación)
3. [Checklist por Vista](#checklist-por-vista)
4. [Patrones Comunes](#patrones-comunes)
5. [Testing y Validación](#testing-y-validación)
6. [Criterios de Aceptación](#criterios-de-aceptación)

---

## Estrategia General

### Enfoque Incremental

Implementaremos las mejoras de accesibilidad en 4 fases, una por vista, permitiendo:

1. **Validación temprana**: Testing después de cada fase
2. **Aprendizaje continuo**: Aplicar lecciones a siguientes fases
3. **Commits atómicos**: Un commit por vista completada
4. **Rollback seguro**: Si hay problemas, solo afecta una vista

### Orden de Implementación

```
Fase 1: Home (página principal)
  ↓ Validación
Fase 2: Artículos Listing
  ↓ Validación
Fase 3: Charlas y Talleres
  ↓ Validación
Fase 4: Artículo Individual
  ↓ Validación Final
```

### Principios de Cada Fase

1. **Análisis**: Revisar estructura HTML actual
2. **Diseño**: Planificar landmarks y headings
3. **Implementación**: Modificar componentes
4. **Testing Manual**: Navegar con Tab y screen reader
5. **Testing Automático**: axe-core, Pa11y
6. **Documentación**: Actualizar guía de la vista
7. **Commit**: Cambios validados

---

## Fases de Implementación

### Fase 1: Home (Estimado: 2-3 horas)

#### Archivos a Modificar

```
src/pages/index.astro                      ← Estructura principal
src/components/article/index.astro         ← Tarjetas de artículos
src/components/subscribe/index.astro       ← Formulario newsletter
src/layouts/main/index.astro               ← Layout base (si necesario)
```

#### Tareas

1. **Sección de Perfil**
   - [ ] Envolver en `<section aria-label="Perfil del autor">`
   - [ ] Verificar h1 único
   - [ ] Convertir links de redes sociales a `<nav><ul><li>`
   - [ ] Agregar aria-label descriptivo a links externos

2. **Sección de Artículos**
   - [ ] Agregar `aria-labelledby` a `<section>`
   - [ ] Asegurar cada tarjeta es un `<article>`
   - [ ] Agregar aria-label a tiempo de lectura
   - [ ] Mejorar formato de fecha con aria-label

3. **Sección de Newsletter**
   - [ ] Verificar labels asociados correctamente
   - [ ] Agregar aria-required a campos obligatorios
   - [ ] Mejorar mensajes de error con aria-live
   - [ ] Asociar errores con campos (aria-describedby)

4. **Testing**
   - [ ] Tab order lógico
   - [ ] H navega correctamente (h1 → h2 → h3)
   - [ ] Screen reader lee secciones coherentemente
   - [ ] axe-core sin errores

#### Resultado Esperado

```
VoiceOver: "Main landmark, contenido de la página"
  → "Region, Perfil del autor"
    → "Heading level 1, ¡Hola! Mi nombre es Eduardo Álvarez"
    → "Navigation, Redes sociales, list 4 items"
  → "Region, Últimos artículos"
    → "Heading level 2, Últimos artículos"
    → "List 3 items"
      → "Article, Título del artículo..."
```

---

### Fase 2: Artículos Listing (Estimado: 1-2 horas)

#### Archivos a Modificar

```
src/pages/articulos/[...page].astro        ← Vista de listado
src/components/article/index.astro         ← Tarjetas (ya mejorado en Fase 1)
src/components/pagination/index.astro      ← Paginación
```

#### Tareas

1. **Encabezado de Página**
   - [ ] Verificar `<hgroup>` con h1 + descripción
   - [ ] Asegurar h1 único y descriptivo
   - [ ] hgroup dentro de landmark apropiado

2. **Lista de Artículos**
   - [ ] Envolver en `<section aria-labelledby>`
   - [ ] Mantener estructura de lista `<ul><li>`
   - [ ] Cada artículo en `<article>`
   - [ ] Asegurar h3 dentro de cada article

3. **Paginación**
   - [ ] Envolver en `<nav aria-label="Paginación de artículos">`
   - [ ] Agregar aria-label descriptivo a cada link
   - [ ] Indicar página actual con aria-current (si aplica)
   - [ ] Disabled links como `<span>` no `<a>`

4. **Testing**
   - [ ] Tab order: header → artículos → paginación → footer
   - [ ] Landmarks: navegación por D/R funcional
   - [ ] Lista detectada correctamente
   - [ ] Paginación anunciada como navigation

#### Resultado Esperado

```
VoiceOver: "Main landmark"
  → "Heading level 1, Artículos"
  → "List 8 items"
    → "Article 1 of 8"
      → "Heading level 3, Título del artículo"
  → "Navigation, Paginación de artículos"
    → "Link, Artículos más recientes"
    → "Link, Artículos anteriores"
```

---

### Fase 3: Charlas y Talleres (Estimado: 2-3 horas)

#### Archivos a Modificar

```
src/pages/charlas-talleres/index.astro     ← Vista principal
src/components/dropdown/index.tsx          ← Dropdown de recursos (verificar)
```

#### Tareas

1. **Encabezado de Página**
   - [ ] Verificar `<hgroup>` semántico
   - [ ] h1 único

2. **Lista de Charlas**
   - [ ] Cada charla envuelta en `<article>`
   - [ ] Agregar aria-labelledby="talk-title-{id}"
   - [ ] h2 para título de cada charla
   - [ ] Sección dentro de landmark apropiado

3. **Metadata de Charlas**
   - [ ] Lugar: Verificar link accesible
   - [ ] Fecha: Agregar aria-label con formato largo
   - [ ] Descripción: Verificar semántica

4. **Dropdown de Recursos**
   - [ ] Verificar navegación por teclado (Arrow keys)
   - [ ] Agregar aria-expanded al botón
   - [ ] Agregar aria-haspopup="menu"
   - [ ] Items del menú con roles apropiados
   - [ ] Focus management al abrir/cerrar

5. **Organizaciones**
   - [ ] Envolver en lista semántica
   - [ ] Links con aria-label descriptivo
   - [ ] Imágenes con alt apropiado o aria-hidden

6. **Imágenes de Charlas**
   - [ ] Evaluar si son decorativas o informativas
   - [ ] Decorativas: alt="" aria-hidden="true"
   - [ ] Informativas: alt descriptivo

4. **Testing**
   - [ ] Tab order lógico en cada tarjeta
   - [ ] Dropdown navegable con teclado
   - [ ] Screen reader anuncia charlas correctamente
   - [ ] Metadata legible y con contexto

#### Resultado Esperado

```
VoiceOver: "Main landmark"
  → "Heading level 1, Charlas y Talleres"
  → "List 5 items"
    → "Article, Charla sobre Vue.js"
      → "Heading level 2, Arquitectura de componentes en Vue"
      → "Link, Workshop Chile"
      → "Time, Publicado el 15 de marzo de 2024"
      → "Button, Opciones de recursos, collapsed"
      → "List, Organizaciones, 2 items"
```

---

### Fase 4: Artículo Individual (Estimado: 3-4 horas)

#### Archivos a Modificar

```
src/layouts/article/index.astro            ← Layout de artículo
src/layouts/article/components/head.astro  ← Header del artículo
src/layouts/article/components/aside.astro ← Sidebar (TOC + relacionados)
src/layouts/article/components/giscus.tsx  ← Sección de comentarios (verificar)
```

#### Tareas

1. **Estructura Principal**
   - [ ] `<article>` como contenedor principal
   - [ ] h1 único en el header del artículo
   - [ ] Verificar orden del DOM (aside antes o después de content)

2. **Header del Artículo**
   - [ ] Envolver metadata en región apropiada
   - [ ] Tiempo de lectura con aria-label
   - [ ] Fecha con formato largo en aria-label
   - [ ] Categorías como lista semántica

3. **Sidebar (Aside)**
   - [ ] `<aside>` con aria-label="Navegación del artículo"
   - [ ] Tabla de contenidos:
     - [ ] `<nav aria-label="Tabla de contenidos">`
     - [ ] Lista `<ul>` con links a secciones
     - [ ] Verificar que links apunten a IDs correctos
   - [ ] Artículos relacionados:
     - [ ] `<section aria-label="Artículos relacionados">`
     - [ ] h2 visualmente oculto o con aria-labelledby
     - [ ] Links con contexto ("Anterior:", "Siguiente:")

4. **Contenido del Artículo**
   - [ ] Envolver en `<section aria-label="Contenido del artículo">`
   - [ ] Verificar jerarquía de headings (h2 → h3 → h4)
   - [ ] Code blocks con lenguaje identificado (aria-label)
   - [ ] Imágenes con alt descriptivo
   - [ ] Links externos con indicador (aria-label o visual)

5. **Giscus (Comentarios)**
   - [ ] Envolver en `<section aria-label="Comentarios">`
   - [ ] h2 "Comentarios" (visualmente oculto si necesario)
   - [ ] Verificar que iframe tiene title

6. **Botón de Compartir**
   - [ ] Verificar aria-label descriptivo
   - [ ] Focus visible
   - [ ] Posición en tab order apropiada

7. **Testing**
   - [ ] Navegación por headings crea un índice coherente
   - [ ] TOC funcional con Tab y Enter
   - [ ] Aside no interfiere con lectura del contenido
   - [ ] Comentarios identificados como región separada

#### Resultado Esperado

```
VoiceOver: "Main landmark"
  → "Article"
    → "Heading level 1, Título del artículo"
    → "Time, Publicado el 15 de marzo de 2024"
    → "Text, 5 minutos de lectura"
    → "Complementary, Navegación del artículo"
      → "Navigation, Tabla de contenidos, list 4 items"
      → "Region, Artículos relacionados"
    → "Region, Contenido del artículo"
      → "Heading level 2, Introducción"
      → "Heading level 2, Desarrollo"
        → "Heading level 3, Subsección"
    → "Region, Comentarios"
```

---

## Checklist por Vista

### Checklist Home

- [ ] **Landmarks**
  - [ ] Main con id="main-content"
  - [ ] Section perfil con aria-label
  - [ ] Section artículos con aria-labelledby
  - [ ] Section newsletter con aria-label

- [ ] **Headings**
  - [ ] h1 único ("¡Hola! Mi nombre es Eduardo Álvarez")
  - [ ] h2 "Últimos artículos"
  - [ ] h2 "Newsletter" (o visualmente oculto)
  - [ ] h3 en cada tarjeta de artículo

- [ ] **Navegación**
  - [ ] Redes sociales como `<nav><ul><li>`
  - [ ] Links externos con rel apropiado

- [ ] **Formularios**
  - [ ] Labels asociados a inputs
  - [ ] Errores con aria-live
  - [ ] Campos obligatorios con aria-required

- [ ] **Tab Order**
  - [ ] Skip link → header → perfil → artículos → newsletter → footer

### Checklist Artículos Listing

- [ ] **Landmarks**
  - [ ] Main con contenido
  - [ ] Section con aria-labelledby

- [ ] **Headings**
  - [ ] h1 único ("Artículos")
  - [ ] hgroup con descripción
  - [ ] h3 en cada tarjeta de artículo

- [ ] **Navegación**
  - [ ] Paginación como `<nav aria-label>`
  - [ ] Links con aria-label descriptivo

- [ ] **Listas**
  - [ ] Artículos en `<ul><li><article>`

- [ ] **Tab Order**
  - [ ] Skip link → header → artículos → paginación → footer

### Checklist Charlas y Talleres

- [ ] **Landmarks**
  - [ ] Main con contenido
  - [ ] Cada charla como `<article>`

- [ ] **Headings**
  - [ ] h1 único ("Charlas y Talleres")
  - [ ] h2 en cada charla

- [ ] **Interactividad**
  - [ ] Dropdown accesible por teclado
  - [ ] Dropdown con aria-expanded
  - [ ] Dropdown con aria-haspopup

- [ ] **Metadata**
  - [ ] Fechas con aria-label
  - [ ] Links con contexto

- [ ] **Imágenes**
  - [ ] Alt apropiado o aria-hidden

- [ ] **Tab Order**
  - [ ] Skip link → header → charlas (incluye dropdowns) → footer

### Checklist Artículo Individual

- [ ] **Landmarks**
  - [ ] Article como contenedor
  - [ ] Aside con aria-label
  - [ ] Section contenido con aria-label
  - [ ] Section comentarios con aria-label

- [ ] **Headings**
  - [ ] h1 único (título del artículo)
  - [ ] Jerarquía correcta en contenido (h2 → h3 → h4)
  - [ ] h2 en sidebar (TOC, relacionados)

- [ ] **Navegación**
  - [ ] TOC como `<nav aria-label>`
  - [ ] TOC como lista `<ul><li>`
  - [ ] Links del TOC funcionan correctamente

- [ ] **Contenido**
  - [ ] Code blocks con lenguaje identificado
  - [ ] Imágenes con alt descriptivo
  - [ ] Links externos marcados

- [ ] **Tab Order**
  - [ ] Skip link → header → TOC → contenido → relacionados → comentarios → compartir → footer

---

## Patrones Comunes

### Pattern 1: Section con Heading

```astro
<!-- Correcto -->
<section aria-labelledby="section-heading">
  <h2 id="section-heading">Título de la sección</h2>
  <!-- Contenido -->
</section>

<!-- Alternativa (sin heading visible) -->
<section aria-label="Descripción de la sección">
  <!-- Contenido -->
</section>
```

### Pattern 2: Lista de Items

```astro
<ul>
  {items.map((item) => (
    <li>
      <article>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </article>
    </li>
  ))}
</ul>
```

### Pattern 3: Navegación de Links

```astro
<nav aria-label="Descripción del propósito">
  <ul>
    {links.map((link) => (
      <li>
        <a
          href={link.href}
          aria-label={link.ariaLabel || undefined}
          aria-current={isActive ? "page" : undefined}
        >
          {link.text}
        </a>
      </li>
    ))}
  </ul>
</nav>
```

### Pattern 4: Metadata Accesible

```astro
<!-- Fecha -->
<time
  datetime={isoDate}
  aria-label={`Publicado el ${longFormatDate}`}
>
  {shortFormatDate}
</time>

<!-- Tiempo de lectura -->
<span aria-label={`Tiempo estimado de lectura: ${time} minutos`}>
  {time} min de lectura
</span>
```

### Pattern 5: Imágenes

```astro
<!-- Informativa -->
<Image
  src={image}
  alt={`Descripción detallada de ${context}`}
/>

<!-- Decorativa -->
<Image
  src={image}
  alt=""
  aria-hidden="true"
/>
```

### Pattern 6: Formulario Accesible

```astro
<form>
  <label for="input-name" class="sr-only">
    Nombre completo
  </label>
  <input
    id="input-name"
    type="text"
    aria-required="true"
    aria-describedby="name-error name-help"
  />
  <p id="name-help" class="text-sm">
    Ingresa tu nombre completo
  </p>
  <p id="name-error" class="text-red-400 hidden" aria-live="polite">
    <!-- Error message -->
  </p>
</form>
```

### Pattern 7: Dropdown Accesible

```tsx
<button
  aria-label="Opciones de recursos"
  aria-expanded={isOpen}
  aria-haspopup="menu"
  onClick={toggle}
>
  {/* Icon */}
</button>

<ul
  role="menu"
  aria-hidden={!isOpen}
>
  {options.map((option) => (
    <li role="none">
      <a role="menuitem" href={option.url}>
        {option.name}
      </a>
    </li>
  ))}
</ul>
```

---

## Testing y Validación

### Testing Manual - Navegación por Teclado

#### Checklist General

```
1. Abrir página en navegador
2. Presionar Tab desde la barra de direcciones
3. Verificar:
   ✓ Primer elemento es Skip Link
   ✓ Focus visible en todo momento
   ✓ Orden lógico de tabulación
   ✓ Todos los elementos interactivos son alcanzables
   ✓ No hay elementos hidden en tab order
   ✓ Dropdowns navegables con arrows
   ✓ Forms navegables completos
   ✓ Enter activa links y botones
4. Presionar Shift+Tab
   ✓ Navegación inversa funciona correctamente
```

### Testing Manual - Screen Reader

#### VoiceOver (macOS)

```bash
# Activar: Cmd + F5

# Test de Landmarks
1. Cmd + VO + U (abrir Rotor)
2. Seleccionar "Landmarks"
3. Verificar:
   ✓ Banner (header)
   ✓ Navigation (múltiples si aplica)
   ✓ Main (contenido principal)
   ✓ Complementary (aside)
   ✓ Contentinfo (footer)

# Test de Headings
1. VO + Cmd + H (siguiente heading)
2. Verificar:
   ✓ h1 único y descriptivo
   ✓ Jerarquía lógica (no saltos)
   ✓ Headings cubren todas las secciones

# Test de Listas
1. VO + Cmd + X (siguiente lista)
2. Verificar:
   ✓ Artículos detectados como lista
   ✓ Navegación detectada como lista
   ✓ Número de items anunciado

# Test de Lectura Continua
1. VO + A (leer todo)
2. Verificar:
   ✓ Orden lógico
   ✓ Contexto claro
   ✓ No se lee contenido escondido
   ✓ ARIA labels apropiados
```

#### NVDA (Windows)

```bash
# Activar: Ctrl + Alt + N

# Navegación por Landmarks
NVDA + D (siguiente landmark)

# Navegación por Headings
H (siguiente heading)
1-6 (saltar a nivel específico)

# Lista de elementos
NVDA + F7 (abrir diálogo)
```

### Testing Automático

#### Script de Testing

```bash
# package.json
{
  "scripts": {
    "test:a11y:home": "axe http://localhost:4321 --exit",
    "test:a11y:articles": "axe http://localhost:4321/articulos --exit",
    "test:a11y:talks": "axe http://localhost:4321/charlas-talleres --exit",
    "test:a11y:article": "axe http://localhost:4321/articulos/[slug-ejemplo] --exit",
    "test:a11y:all": "npm run test:a11y:home && npm run test:a11y:articles && npm run test:a11y:talks && npm run test:a11y:article"
  }
}
```

#### Validación por Fase

```bash
# Fase 1: Home
npm run test:a11y:home
# Verificar: 0 violations

# Fase 2: Artículos
npm run test:a11y:articles
# Verificar: 0 violations

# Fase 3: Charlas
npm run test:a11y:talks
# Verificar: 0 violations

# Fase 4: Artículo
npm run test:a11y:article
# Verificar: 0 violations
```

---

## Criterios de Aceptación

### Criterio 1: Estructura Semántica Completa

✅ **Aceptado si**:
- Cada vista tiene landmarks principales (header, main, footer)
- Secciones importantes identificadas con `<section>` + aria-label
- Jerarquía de headings sin saltos
- Listas semánticas donde corresponde

❌ **Rechazado si**:
- Falta algún landmark principal
- Hay saltos en headings (h2 → h4)
- Múltiples h1 en una vista
- Div-soup sin estructura semántica

### Criterio 2: Navegación por Teclado Funcional

✅ **Aceptado si**:
- Tab recorre todos los elementos interactivos
- Skip link funciona correctamente
- Focus siempre visible
- Orden lógico de tabulación
- Dropdowns navegables con arrows

❌ **Rechazado si**:
- Elementos interactive no alcanzables por Tab
- Focus trap accidental
- Orden ilógico de tabulación
- Focus no visible en algún elemento

### Criterio 3: Screen Reader Coherente

✅ **Aceptado si**:
- Landmarks detectados correctamente
- Navegación por headings lógica
- Listas detectadas y anunciadas
- Contenido se lee en orden correcto
- ARIA labels descriptivos y útiles

❌ **Rechazado si**:
- Landmarks confusos o mal etiquetados
- Headings no forman índice coherente
- Lectura en orden ilógico
- ARIA labels genéricos o missing

### Criterio 4: Testing Automático Limpio

✅ **Aceptado si**:
- axe-core: 0 violations
- Pa11y: 0 errors
- HTML validator: 0 errors de semántica

❌ **Rechazado si**:
- Cualquier violation de Level A o AA
- Errores de HTML que afecten accesibilidad

### Criterio 5: Documentación Completa

✅ **Aceptado si**:
- Guía específica de la vista creada
- Cambios documentados
- Testing manual reportado
- Ejemplos de navegación incluidos

❌ **Rechazado si**:
- Falta documentación
- Cambios sin explicación
- No hay evidencia de testing

---

## Commits Sugeridos

### Fase 1: Home

```bash
git add src/pages/index.astro src/components/article/index.astro src/components/subscribe/index.astro specs/accesibilidad-screen-readers/03_guia-home.md
git commit -m "feat(a11y): improve screen reader accessibility on home page ♿️

- Add semantic sections with aria-label
- Convert social links to nav with list structure
- Improve article cards with proper aria attributes
- Enhance newsletter form with aria-required and aria-live
- Add descriptive aria-labels to time elements
- Verify single h1 and heading hierarchy

Screen reader navigation:
- Landmarks: banner → main → contentinfo
- Regions: Profile → Latest Articles → Newsletter
- Headings: h1 → h2 → h3 logical flow

Testing:
- VoiceOver: All landmarks detected
- Tab order: Logical progression
- axe-core: 0 violations

Documentation: specs/accesibilidad-screen-readers/03_guia-home.md"
```

### Fase 2: Artículos Listing

```bash
git commit -m "feat(a11y): improve screen reader accessibility on articles listing ♿️

- Add hgroup for page title and description
- Wrap articles in section with aria-labelledby
- Improve pagination with nav and descriptive aria-labels
- Ensure article cards maintain structure from Phase 1

Screen reader navigation:
- Landmarks: main with articles region
- Headings: h1 → h3 in article cards
- Navigation: Pagination detected as separate navigation

Testing:
- VoiceOver: List with correct item count announced
- Tab order: Articles → pagination
- axe-core: 0 violations

Documentation: specs/accesibilidad-screen-readers/04_guia-articulos-listing.md"
```

### Fase 3: Charlas y Talleres

```bash
git commit -m "feat(a11y): improve screen reader accessibility on talks page ♿️

- Wrap each talk in article element
- Add aria-labelledby to talk articles
- Improve dropdown with aria-expanded and aria-haspopup
- Add descriptive aria-labels to time elements
- Convert organizations to semantic list
- Handle talk images appropriately (decorative vs informative)

Screen reader navigation:
- Landmarks: main with talks region
- Headings: h1 → h2 per talk
- Interactive: Dropdown keyboard accessible

Testing:
- VoiceOver: Articles detected with proper structure
- Dropdown: Navigable with Tab and arrows
- axe-core: 0 violations

Documentation: specs/accesibilidad-screen-readers/05_guia-charlas-talleres.md"
```

### Fase 4: Artículo Individual

```bash
git commit -m "feat(a11y): improve screen reader accessibility on article pages ♿️

- Wrap article content in semantic article element
- Add aside with aria-label for sidebar navigation
- Improve TOC with nav and list structure
- Add section for article content with aria-label
- Ensure heading hierarchy in article body
- Add section for comments with aria-label
- Improve share button with descriptive aria-label

Screen reader navigation:
- Landmarks: article → aside → main content → comments
- Headings: h1 → h2 → h3 → h4 logical structure
- Navigation: TOC detected as separate navigation

Testing:
- VoiceOver: All regions properly identified
- TOC: Functional with Tab and Enter
- axe-core: 0 violations

Documentation: specs/accesibilidad-screen-readers/06_guia-articulo-individual.md"
```

---

## Próximos Pasos

### Inmediatos

1. ✅ Análisis técnico completo
2. ✅ Plan de implementación definido
3. ⏳ Crear guías específicas por vista
4. ⏳ Comenzar Fase 1: Home

### Después de Implementación

1. Testing con usuarios reales que usan screen readers
2. Crear video tutorial de navegación accesible
3. Documentar patrones en CLAUDE.md
4. Compartir findings con la comunidad

---

**Documento creado**: 2025-12-03
**Última actualización**: 2025-12-03
**Versión**: 1.0.0
**Autor**: Eduardo Álvarez
**Estado**: ✅ Completo
