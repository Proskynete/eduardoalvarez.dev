# Análisis Técnico: Accesibilidad con Screen Readers

## Índice

1. [Visión General](#visión-general)
2. [Conceptos Fundamentales](#conceptos-fundamentales)
3. [Diagnóstico del Estado Actual](#diagnóstico-del-estado-actual)
4. [Arquitectura de Navegación por Teclado](#arquitectura-de-navegación-por-teclado)
5. [Jerarquía Semántica](#jerarquía-semántica)
6. [Referencias WCAG 2.1](#referencias-wcag-21)
7. [Herramientas de Testing](#herramientas-de-testing)

---

## Visión General

### Objetivo

Implementar una experiencia de navegación coherente y eficiente para usuarios de lectores de pantalla en todas las vistas del sitio web, permitiendo:

1. **Comprensión inmediata** del contenido principal mediante landmarks semánticos
2. **Navegación eficiente** a través de secciones y subsecciones usando Tab
3. **Jerarquía clara** que permita saltar entre regiones sin leer todo el contenido
4. **Contexto constante** sobre dónde se encuentra el usuario en cada momento

### Alcance

- ✅ Página principal (Home)
- ✅ Vista de todos los artículos (Artículos listing)
- ✅ Vista de charlas y talleres
- ✅ Contenido de artículo individual

### Principios de Diseño

1. **Progresión lógica**: El orden de lectura debe seguir el flujo visual
2. **Agrupación coherente**: Elementos relacionados deben estar en la misma región
3. **Saltos eficientes**: Landmarks permiten saltar secciones completas
4. **Información contextual**: ARIA labels claros y descriptivos

---

## Conceptos Fundamentales

### 1. Landmarks (Regiones)

Los landmarks son puntos de referencia que permiten a los lectores de pantalla saltar rápidamente entre secciones principales.

#### Landmarks HTML5 Nativos

```html
<header>     → banner (uno por página)
<nav>        → navigation (múltiples permitidos)
<main>       → main (uno por página)
<aside>      → complementary
<footer>     → contentinfo (uno por página)
<section>    → region (con aria-label o aria-labelledby)
<article>    → article
<form>       → form (con aria-label o aria-labelledby)
<search>     → search
```

#### Roles ARIA Complementarios

```html
role="banner"        → Header principal del sitio
role="navigation"    → Menú de navegación
role="main"          → Contenido principal
role="complementary" → Contenido relacionado (sidebar)
role="contentinfo"   → Footer del sitio
role="region"        → Sección genérica importante
role="search"        → Funcionalidad de búsqueda
```

### 2. Headings (Encabezados)

Los headings crean un **índice de contenidos** que los screen readers pueden navegar.

#### Jerarquía Correcta

```
h1 - Título principal de la página (uno por vista)
  h2 - Sección principal
    h3 - Subsección
      h4 - Sub-subsección
```

#### Reglas

- ✅ **UN SOLO H1** por página
- ✅ No saltar niveles (h2 → h4)
- ✅ Orden lógico y secuencial
- ❌ No usar headings solo por estilo
- ❌ No duplicar textos de heading

### 3. Navegación por Teclado

#### Teclas Principales

| Tecla | Función |
|-------|---------|
| `Tab` | Navega al siguiente elemento interactivo |
| `Shift + Tab` | Navega al elemento interactivo anterior |
| `Enter` | Activa links y botones |
| `Space` | Activa botones, checkboxes |
| `Arrow Keys` | Navegación dentro de componentes (dropdowns, tabs) |
| `Esc` | Cierra modales, menús |

#### Navegación de Screen Readers

| Comando | NVDA | JAWS | VoiceOver (Mac) |
|---------|------|------|-----------------|
| Siguiente heading | `H` | `H` | `VO + Cmd + H` |
| Landmark | `D` | `R` | `VO + U` (rotor) |
| Lista | `L` | `L` | `VO + Cmd + X` |
| Link | `K` | `INS + F7` | `VO + Cmd + L` |
| Formulario | `F` | `F` | `VO + Cmd + J` |

### 4. ARIA (Accessible Rich Internet Applications)

#### Atributos Esenciales

```html
<!-- Nombres accesibles -->
aria-label="Descripción del elemento"
aria-labelledby="id-del-elemento-que-etiqueta"
aria-describedby="id-del-elemento-que-describe"

<!-- Estado -->
aria-hidden="true"           → Oculta del árbol de accesibilidad
aria-expanded="true/false"   → Estado de expansión
aria-current="page/step"     → Elemento actual en navegación
aria-live="polite/assertive" → Anuncia cambios dinámicos

<!-- Estructura -->
aria-level="2"              → Nivel de heading (si no es h1-h6)
role="heading"              → Define como heading
```

### 5. Focus Management

#### Focus Visible

```css
/* Estilos de focus actuales del proyecto */
*:focus-visible {
  outline: 2px solid rgb(236, 72, 153); /* pink-500 */
  outline-offset: 3px;
}
```

#### Reglas de Focus

- ✅ Todo elemento interactivo debe ser focusable
- ✅ El focus debe ser visible (outline)
- ✅ Orden lógico de tabulación (document flow o tabindex)
- ❌ No usar `tabindex` positivo (1, 2, 3...)
- ✅ Usar `tabindex="-1"` para elementos programáticamente focusables
- ✅ Skip links para saltar al contenido principal

---

## Diagnóstico del Estado Actual

### Fortalezas Existentes

#### ✅ Landmarks Básicos

```astro
<!-- src/layouts/base/index.astro -->
<header>...</header>
<main>...</main>
<footer>...</footer>
```

#### ✅ Sistema de Focus

```css
/* src/assets/styles/base.css */
/* Sistema completo de outlines con pink-500 */
```

#### ✅ Skip Link

```astro
<a href="#main-content" class="skip-to-content">
  Saltar al contenido principal
</a>
```

#### ✅ Semantic HTML

- Uso de `<article>` para contenido
- `<section>` para agrupaciones
- `<nav>` para navegación

### Oportunidades de Mejora

#### ❌ Falta de ARIA Labels en Landmarks

**Problema**: Múltiples `<section>` sin identificar

```astro
<!-- Actual -->
<section class="space-y-5 mb-20">
  <h2>Últimos artículos</h2>
</section>

<!-- Mejorado -->
<section aria-labelledby="latest-articles-heading" class="space-y-5 mb-20">
  <h2 id="latest-articles-heading">Últimos artículos</h2>
</section>
```

#### ❌ Elementos No Semánticos como Contenedores

**Problema**: Uso de `<div>` donde debería haber landmarks

```astro
<!-- Actual -->
<div class="flex flex-col md:flex-row">
  <!-- Perfil del autor -->
</div>

<!-- Mejorado -->
<section aria-label="Perfil del autor">
  <!-- Contenido -->
</section>
```

#### ❌ Listas No Semánticas

**Problema**: Links de redes sociales sin estructura de lista

```astro
<!-- Actual (src/pages/index.astro:50-68) -->
{config.social_network
  .filter((social) => social.show)
  .map((social, i) => (
    <span class="inline-flex rounded-md shadow-sm">
      <a href={social.link}>...</a>
    </span>
  ))
}

<!-- Mejorado -->
<nav aria-label="Redes sociales">
  <ul>
    {config.social_network
      .filter((social) => social.show)
      .map((social) => (
        <li>
          <a href={social.link}>...</a>
        </li>
      ))
    }
  </ul>
</nav>
```

#### ❌ Falta de Contexto en Artículos

**Problema**: Tarjetas de artículos sin estructura clara

```astro
<!-- Actual -->
<li class="py-6 first:pt-0">
  <Article article={frontmatter} />
</li>

<!-- Mejorado -->
<li class="py-6 first:pt-0">
  <article aria-labelledby="article-title-{slug}">
    <Article article={frontmatter} />
  </article>
</li>
```

#### ❌ Metadata No Anunciada

**Problema**: Fechas y tiempos de lectura sin contexto

```astro
<!-- Actual -->
<time datetime={date}>
  {formatDate(date)}
</time>

<!-- Mejorado -->
<time datetime={date} aria-label={`Publicado el ${formatDate(date, 'long')}`}>
  {formatDate(date)}
</time>
```

#### ❌ Imágenes Decorativas Sin Ocultar

**Problema**: Imágenes que no aportan info al lector

```astro
<!-- Actual -->
<Image src={talk.image} alt={talk.title} />

<!-- Si es decorativa -->
<Image src={talk.image} alt="" aria-hidden="true" />

<!-- Si aporta información -->
<Image src={talk.image} alt={`Imagen de la charla ${talk.title} en ${talk.location.name}`} />
```

---

## Arquitectura de Navegación por Teclado

### Flujo de Navegación Esperado

```
1. Página carga
   ↓
2. Focus en Skip Link (invisible hasta Tab)
   ↓
3. Tab → Header / Logo
   ↓
4. Tab → Búsqueda (Algolia)
   ↓
5. Tab → Navegación principal (Home, Artículos, Charlas)
   ↓
6. Enter en Skip Link → Salto a <main>
   ↓
7. Tab → Contenido principal
   ↓
8. Navegación por headings (H) y landmarks (D/R)
   ↓
9. Tab → Footer links
```

### Mapa de Navegación por Vista

#### Home

```
Skip Link
├─ Header
│  ├─ Logo (focusable)
│  ├─ Search (Algolia)
│  └─ Nav (Home, Artículos, Charlas)
├─ Main
│  ├─ Section: Perfil
│  │  ├─ Imagen (focusable con focus:outline)
│  │  ├─ Heading h1: "¡Hola! Mi nombre es Eduardo Álvarez"
│  │  ├─ Párrafo bio
│  │  └─ Nav: Redes sociales (list)
│  ├─ Section: Últimos artículos
│  │  ├─ Heading h2: "Últimos artículos"
│  │  └─ List de artículos
│  │     └─ Article (cada uno)
│  │        ├─ Heading h3: Título del artículo
│  │        ├─ Metadata (fecha, lectura)
│  │        └─ Descripción
│  └─ Section: Newsletter
│     ├─ Heading h2: "Newsletter"
│     └─ Form (name, email, submit)
└─ Footer
   ├─ Nav: Redes sociales
   └─ Copyright
```

#### Artículos Listing

```
Skip Link
├─ Header (igual que Home)
├─ Main
│  └─ Section: Artículos
│     ├─ Hgroup
│     │  ├─ Heading h1: "Artículos"
│     │  └─ Párrafo descripción
│     ├─ List de artículos
│     │  └─ Article (cada uno)
│     └─ Nav: Paginación
│        ├─ Link: Anteriores
│        └─ Link: Siguientes
└─ Footer (igual que Home)
```

#### Charlas y Talleres

```
Skip Link
├─ Header (igual que Home)
├─ Main
│  └─ Section: Charlas
│     ├─ Hgroup
│     │  ├─ Heading h1: "Charlas y Talleres"
│     │  └─ Párrafo descripción
│     └─ List de charlas
│        └─ Article (cada charla)
│           ├─ Heading h2: Título charla
│           ├─ Metadata (lugar, fecha)
│           ├─ Descripción
│           ├─ Dropdown: Recursos
│           ├─ Lista: Organizaciones
│           └─ Imagen
└─ Footer (igual que Home)
```

#### Artículo Individual

```
Skip Link
├─ Header (igual que Home)
├─ Main
│  └─ Article
│     ├─ Header del artículo
│     │  ├─ Heading h1: Título artículo
│     │  ├─ Metadata (fecha, lectura, categorías)
│     │  └─ Imagen destacada
│     ├─ Aside: Sidebar
│     │  ├─ Nav: Tabla de contenidos
│     │  │  └─ List de secciones
│     │  └─ Section: Artículos relacionados
│     │     ├─ Heading h2: "Anterior"
│     │     └─ Heading h2: "Siguiente"
│     ├─ Section: Contenido del artículo
│     │  └─ Headings h2, h3, h4...
│     ├─ Section: Comentarios (Giscus)
│     └─ Link flotante: Compartir
└─ Footer (igual que Home)
```

---

## Jerarquía Semántica

### Principio de Agrupación

Los elementos deben agruparse de lo general a lo específico:

```html
<main>                                     ← Nodo más grande
  <section aria-label="Sección A">        ← Región
    <h2>Título de la sección</h2>         ← Encabezado de región
    <article>                             ← Contenido individual
      <h3>Título del contenido</h3>       ← Encabezado de contenido
      <p>Descripción...</p>               ← Detalles
    </article>
  </section>
</main>
```

### Lectura por Niveles

Un screen reader puede navegar por:

1. **Nivel 1 - Landmarks**: Saltar entre `<header>`, `<main>`, `<footer>`
2. **Nivel 2 - Regiones**: Saltar entre `<section>` dentro de `<main>`
3. **Nivel 3 - Artículos**: Saltar entre `<article>` dentro de `<section>`
4. **Nivel 4 - Headings**: Navegar por h2, h3, h4 dentro de contenido

### Ejemplo Práctico

```html
<!-- Usuario presiona "D" (landmark) -->
<main id="main-content">  ← "Main landmark, Artículos"

  <!-- Usuario presiona "H" (heading) -->
  <h1>Artículos</h1>  ← "Heading level 1, Artículos"

  <!-- Usuario presiona "H" nuevamente -->
  <section aria-labelledby="latest">
    <h2 id="latest">Últimos artículos</h2>  ← "Heading level 2, Últimos artículos"

    <!-- Usuario presiona "L" (list) -->
    <ul>  ← "List with 3 items"
      <li>
        <!-- Usuario presiona "H" -->
        <article>
          <h3>Título del artículo</h3>  ← "Heading level 3, Título del artículo"
        </article>
      </li>
    </ul>
  </section>
</main>
```

---

## Referencias WCAG 2.1

### Criterios Aplicables

#### 1.3.1 Info and Relationships (Level A)

> "Information, structure, and relationships conveyed through presentation can be programmatically determined or are available in text."

**Aplicación**:
- Usar landmarks semánticos
- Estructura de headings correcta
- Listas con `<ul>`, `<ol>`, `<li>`
- Uso de `<article>` para contenido independiente

#### 1.3.2 Meaningful Sequence (Level A)

> "When the sequence in which content is presented affects its meaning, a correct reading sequence can be programmatically determined."

**Aplicación**:
- Orden del DOM coincide con orden visual
- Skip links al inicio del documento
- Contenido principal antes que sidebars en el DOM

#### 2.1.1 Keyboard (Level A)

> "All functionality of the content is operable through a keyboard interface."

**Aplicación**:
- Todos los links y botones son focusables
- Dropdowns navegables con flechas
- Mobile menu con gestión de focus

#### 2.4.1 Bypass Blocks (Level A)

> "A mechanism is available to bypass blocks of content that are repeated on multiple Web pages."

**Aplicación**:
- Skip link: "Saltar al contenido principal"
- Landmarks para navegación rápida

#### 2.4.3 Focus Order (Level A)

> "If a Web page can be navigated sequentially and the navigation sequences affect meaning or operation, focusable components receive focus in an order that preserves meaning and operability."

**Aplicación**:
- TabIndex management en mobile menu
- Orden lógico de formularios
- Modal traps focus cuando está abierto

#### 2.4.6 Headings and Labels (Level AA)

> "Headings and labels describe topic or purpose."

**Aplicación**:
- Headings descriptivos
- ARIA labels claros
- Labels de formularios asociados

#### 2.4.7 Focus Visible (Level AA)

> "Any keyboard operable user interface has a mode of operation where the keyboard focus indicator is visible."

**Aplicación**:
- Sistema de focus con outline pink-500
- :focus-visible en todos los elementos interactivos

#### 4.1.2 Name, Role, Value (Level A)

> "For all user interface components, the name and role can be programmatically determined."

**Aplicación**:
- Botones con aria-label
- Landmarks con aria-label
- Forms con labels asociados

#### 4.1.3 Status Messages (Level AA)

> "In content implemented using markup languages, status messages can be programmatically determined through role or properties."

**Aplicación**:
- Mensajes de éxito/error en formularios con aria-live
- Loading states anunciados

---

## Herramientas de Testing

### Lectores de Pantalla

#### NVDA (Windows - Gratis)

```bash
# Descargar de: https://www.nvaccess.org/
# Comandos básicos:
NVDA + Down Arrow  → Leer siguiente línea
NVDA + H           → Siguiente heading
NVDA + D           → Siguiente landmark
NVDA + L           → Siguiente lista
NVDA + F           → Siguiente campo de formulario
```

#### JAWS (Windows - Pago)

```bash
# Más usado profesionalmente
# Demo gratuita: https://www.freedomscientific.com/
```

#### VoiceOver (macOS - Incluido)

```bash
# Activar: Cmd + F5
# Comandos:
VO + A                  → Iniciar lectura
VO + Right Arrow        → Siguiente elemento
VO + Cmd + H            → Siguiente heading
VO + U                  → Rotor (navegación por headings, landmarks, links)
VO + Shift + Down Arrow → Entrar en grupo
```

#### TalkBack (Android - Incluido)

```bash
# Activar en: Configuración → Accesibilidad → TalkBack
```

### Extensiones de Navegador

#### axe DevTools

```bash
# Chrome/Firefox/Edge
# https://www.deque.com/axe/devtools/
# Detecta automáticamente problemas de accesibilidad
```

#### WAVE

```bash
# Chrome/Firefox
# https://wave.webaim.org/extension/
# Visualización de estructura y errores
```

#### Accessibility Insights

```bash
# Chrome/Edge
# https://accessibilityinsights.io/
# FastPass, Assessment, Ad-hoc tools
```

### Herramientas CLI

#### axe-core CLI

```bash
npm install -g @axe-core/cli

# Auditar URL local
axe http://localhost:4321 --exit

# Auditar con reglas específicas
axe http://localhost:4321 --rules landmark-one-main,page-has-heading-one
```

#### Pa11y

```bash
npm install -g pa11y

# Auditar
pa11y http://localhost:4321

# Con reporter HTML
pa11y http://localhost:4321 --reporter html > report.html
```

### Testing Manual

#### Checklist de Validación

- [ ] **Navegación por teclado**
  - [ ] Tab recorre todos los elementos interactivos
  - [ ] Orden lógico de tabulación
  - [ ] Skip link funcional
  - [ ] Focus visible en todo momento
  - [ ] No hay focus traps accidentales

- [ ] **Lectores de pantalla**
  - [ ] H: Navega correctamente por headings
  - [ ] D/R: Landmarks identificados correctamente
  - [ ] L: Listas detectadas
  - [ ] Contenido se lee en orden lógico
  - [ ] ARIA labels descriptivos

- [ ] **Estructura HTML**
  - [ ] Un solo h1 por página
  - [ ] Jerarquía de headings correcta
  - [ ] Landmarks principales presentes
  - [ ] Imágenes con alt apropiado
  - [ ] Forms con labels asociados

- [ ] **ARIA**
  - [ ] aria-label en landmarks
  - [ ] aria-current en navegación
  - [ ] aria-expanded en elementos expandibles
  - [ ] aria-hidden en contenido decorativo

---

## Próximos Pasos

1. ✅ **Análisis técnico** (este documento)
2. ⏳ **Plan de implementación** (02_plan-implementacion.md)
3. ⏳ **Guías por vista**:
   - 03_guia-home.md
   - 04_guia-articulos-listing.md
   - 05_guia-charlas-talleres.md
   - 06_guia-articulo-individual.md
4. ⏳ **Testing y validación**

---

## Glosario

| Término | Definición |
|---------|------------|
| **Screen Reader** | Software que lee el contenido de la pantalla en voz alta |
| **Landmark** | Región semántica de la página (header, main, footer, nav) |
| **Focus** | Elemento que actualmente recibe input del teclado |
| **TabIndex** | Atributo que controla el orden de tabulación |
| **ARIA** | Set de atributos para mejorar accesibilidad |
| **Semantic HTML** | HTML que describe el significado del contenido |
| **Skip Link** | Link que permite saltar al contenido principal |
| **Focus Trap** | Técnica que mantiene el focus dentro de un contenedor (ej: modal) |
| **Rotor** | Herramienta de VoiceOver para navegar por tipo de elemento |

---

**Documento creado**: 2025-12-03
**Última actualización**: 2025-12-03
**Versión**: 1.0.0
**Autor**: Eduardo Álvarez
**Estado**: ✅ Completo
