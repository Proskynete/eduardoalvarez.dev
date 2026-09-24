# page-about Specification

## Purpose
Contenido y estructura de la página `/about`.
## Requirements
### Requirement: About page
The `/about` route SHALL be a semi-static page communicating who Eduardo is, what he builds, and why it matters to his audience. It replaces any existing about content that was embedded in the homepage.

**Page sections:**
1. **Intro** — Short professional bio (3–5 sentences). First person, opinionated tone. No bullet list of technologies.
2. **What I work on** — Current focus areas: Spec-Driven Development, leading a development team, and teaching.
3. **Where I've been** — Career highlights (text, not a timeline). Notable companies, roles, outcomes.
4. **How I think** — 3–4 one-liners that capture the POV: "I believe X", "I've learned Y". These replace a long philosophy section.
5. **Connect** — Links: GitHub, LinkedIn, Twitter/X, Email, Resume.

**Content type:** MDX file at `src/pages/about/index.mdx` — content is authored manually, not generated from settings.

#### Scenario: About page loads with all sections
- **WHEN** user navigates to `/about`
- **THEN** all five content sections SHALL render in order

#### Scenario: Connect section links are functional
- **WHEN** user clicks a connect link
- **THEN** the link SHALL navigate to the correct external profile or open the mail client

---

### Requirement: About page profile image
The about page SHALL include a profile image. The image SHALL be `public/images/eduardo-alvarez.webp`, a 768px-wide WebP (about 80 KB), with a descriptive `alt`.

**Image spec:**
- Size: 160×160px rendered, source ≥ 320×320px
- Shape: `rounded-full` (circle)
- Position: left-aligned on desktop, centered on mobile, above the intro text

#### Scenario: Profile image renders with alt text
- **WHEN** the about page loads
- **THEN** the profile image SHALL have a descriptive `alt` attribute and render at the defined size

---

### Requirement: "How I think" statements
The about page SHALL include 3–4 short opinionated statements that reflect Eduardo's engineering philosophy. These are not a mission statement — they are concrete beliefs, in Eduardo's own words from the 2026-09-23 brand interview.

**Format:**
```
"La IA es una herramienta. No le puedo culpar al martillo si la casa no quedó bien construida: soy yo el que maneja la herramienta, no al revés."
"Un buen desarrollador no es el que escribe más rápido ni el que entrega sin bugs. Es el que entiende el problema y lo resuelve usando el código como herramienta, y ahora también la IA."
"El que no es capaz de escuchar y aprender llega a su techo más rápido."
```

**Visual:** Large `text-xl` quotes, `text-secondary`, left border `accent`, separated by spacing.

#### Scenario: Philosophy quotes render with accent border
- **WHEN** the about page loads
- **THEN** each "How I think" statement SHALL have a 3px left border in `accent` color

### Requirement: /about usa título descriptivo en rango 30–60 chars

El `seo.title` de `/about` SHALL ser más descriptivo que "Sobre mí" genérico. El `<title>` final renderizado SHALL caer en el rango 30–60 chars.

#### Scenario: `<title>` de /about cae en rango
- **WHEN** se accede a `/about`
- **THEN** el `<title>` renderizado SHALL tener entre 30 y 60 chars
- **THEN** SHALL contener el nombre del autor o su rol profesional

