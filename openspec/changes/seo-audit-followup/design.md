## Context

El audit SEO del 19 de abril 2026 (score 69/100) se ejecutó 5 días después del archivado de `2026-04-14-seo-geo-aeo-optimization`. Parte de los warnings que reporta ya están mitigados por JSON-LD, FAQ en artículos recientes y schemas de Event/Service/Collection, pero quedan gaps en tres ejes:

1. **Longitud de título**: Astro concatena ` | ${settings.title}` (18 chars) cuando `seo.title` está presente. Varios títulos cortos (< 15 chars) y largos (> 42 chars en el prop) caen fuera del rango SERP recomendado de 30–60 chars.
2. **FAQ schema en páginas no-artículo**: el componente `ArticleFAQ` solo se usa desde `src/layouts/article/index.astro`. `/working-with-me` tiene intención de conversión pero no emite `FAQPage` JSON-LD — es la única página donde una FAQ resulta natural (ver §D6).
3. **Señales visibles de autoría y contexto**: el audit GEO detecta "Lack of clear author identification" en páginas que sí tienen `Person` JSON-LD pero no texto visible — los crawlers que generan citaciones para LLMs dan más peso al DOM que al structured data en esta etapa.

## Goals / Non-Goals

**Goals:**
- Llevar el `<title>` de las 14 páginas crawleadas a 30–60 chars sin perder claridad semántica.
- Exponer `FAQPage` JSON-LD en `/working-with-me` (la única página donde aporta valor real al lector — ver §D6).
- Mover el score AEO hacia arriba sin forzar FAQs artificiales donde no pertenecen.
- Hacer visible la autoría en todas las páginas índice, no solo en JSON-LD.

**Non-Goals:**
- Rescribir la voz editorial de los artículos para "sonar más voice-search friendly" (daña la marca personal).
- Añadir citaciones bibliográficas a artículos de opinión — falso positivo del audit.
- Modificar el sistema de JSON-LD ya consolidado en `head.astro` (solo se consume).
- Crear `/es/` o versiones internacionalizadas.
- Pautas SEM (Google Ads, etc.) — el sitio no monetiza tráfico pago.

## Decisions

### D1 — Title suffix condicional según longitud final

**Decisión:** En `src/layouts/base/components/head.astro`, calcular `candidate = ${title} | ${settings.title}`. Si `candidate.length > 60` y `title` existe, usar solo `title` como `<title>`. Si no, usar `candidate`.

**Alternativa considerada:** Truncar el sufijo con `…`.
**Rechazada porque:** Un título con `… | Eduardo Álva…` se ve peor que sin sufijo. La marca personal aparece en el dominio y en el JSON-LD de `Person`; no es crítico repetirla en cada `<title>` cuando el título individual ya es descriptivo.

**Alternativa considerada:** Lanzar warning en build si el título excede 60.
**Rechazada porque:** Añade fricción a la autoría sin resolver el problema. El guard silencioso es suficiente.

### D2 — `PageFAQ` como único componente FAQ del sitio (eliminamos `ArticleFAQ`)

**Decisión:** Crear `src/components/page-faq/index.astro` como único componente FAQ del sitio y eliminar `src/components/article-faq/`. Consistente con §D6 (el FAQ en artículos no aportaba valor y se descartó tanto para artículos legacy como para los 2 artículos que inicialmente lo habían adoptado). Al no haber ningún artículo consumidor, mantener `ArticleFAQ` era código muerto.

**Alternativa considerada:** Mantener ambos componentes por si en el futuro algún artículo adopta FAQ.
**Rechazada porque:** Hipotético. YAGNI. Si un artículo lo requiere en el futuro, se puede crear entonces o consumir directamente `PageFAQ`.

**Alternativa considerada:** Inyectar FAQ inline en cada página sin componente.
**Rechazada porque:** Rompería DRY. `/working-with-me` hoy lo consume y es plausible que más páginas lo adopten.

### D3 — FAQ data co-localizado con datos de la página, no en `settings/faq.ts`

**Decisión:** Para `/working-with-me`, añadir `faq: FAQItem[]` al export de `src/settings/working-with-me.ts` (junto a `engagements`). Para `/speaking`, crear `src/settings/speaking.ts` con el export `faq` (no mezclar con `talks.ts` que es un dataset dinámico).

**Alternativa considerada:** Centralizar todos los FAQ en `src/settings/faq.ts` indexado por slug de página.
**Rechazada porque:** Fragmenta el contexto editorial. Mantener los datos cerca de donde se usan facilita el mantenimiento por parte del autor.

### D4 — Bio inline con el mismo texto en todas las páginas

**Decisión:** Definir un string único `authorInlineBio` en `src/settings/index.ts` (1–2 líneas + link a `/about`) y reusarlo en páginas que carezcan de contexto de autor. Un solo punto de verdad.

**Texto propuesto:** "Escrito por **Eduardo Álvarez**, Engineering Leader con foco en liderazgo técnico, plataformas y la era de la IA — [conoce más →](/about)."

**Alternativa considerada:** Bio distinta por página para mejor contextualización.
**Rechazada porque:** Genera drift y mantenimiento. Una bio única reduce esfuerzo y es suficiente para el objetivo GEO.

### D6 — FAQ solo en `/working-with-me`, no en `/speaking` ni en artículos legacy

**Decisión:** El audit marcó FAQ como fix prioritario en `/speaking` y en 6 artículos legacy con headings interrogativos, pero tras revisar el contenido se descarta para ambos casos:

- **`/speaking`** es un listado histórico de charlas dadas, no una página de catálogo de servicios. Las preguntas que un visitante tendría (disponibilidad, honorarios, remoto) ya se resuelven con el CTA de contacto inline. Añadir FAQ convertiría la página en un folleto comercial y rompería el propósito de archivo.
- **Artículos legacy**: cuando un artículo ya responde las preguntas en el cuerpo, duplicarlas al final en un bloque FAQ genera contenido repetido que suena a SEO-spam en lugar de información útil para el lector. Los LLMs igual pueden citar el contenido del artículo sin necesidad de un bloque FAQ dedicado.
- **Artículos recientes (`es-la-ia-la-nueva-droga-de-los-programadores`, `no-estas-obligado-a-aprender-todo-el-tiempo`)**: también se revierten. Mismo razonamiento: las preguntas resultaban paráfrasis del cuerpo. Dado que no queda ningún artículo con FAQ, se elimina por completo el componente `ArticleFAQ` y la prop `faq` del interface `Article` (antes `src/components/article-faq/` + `faq?: FAQItem[]`).

**Alternativa considerada:** Implementar FAQ en todos los puntos marcados por el audit para maximizar score.
**Rechazada porque:** Optimizar para el auditor en vez de para el lector deteriora la marca editorial. La única página donde FAQ añade valor genuino es `/working-with-me`, donde las preguntas (tiempo mínimo, facturación, remoto) no están respondidas en el cuerpo y corresponden a decisiones pre-compra reales del visitante.

**Implicación para el score AEO**: se acepta un impacto menor al esperado (probablemente 48 → ~60 en vez de 48 → ≥65 proyectado) a cambio de mantener consistencia editorial. Se documenta explícitamente para que en futuros audits no se re-abra esta discusión.

### D5 — TL;DRs escritos como párrafo natural, no lista

**Decisión:** Los resúmenes de 40–60 palabras se renderizan como `<p>` dentro del hero, no como `<ul>` de bullet points. Razón: los LLMs extraen párrafos como featured snippets; listas se citan peor.

**Ubicación:** Inmediatamente después del `<h1>` y subtítulo existente, antes de los CTAs.

## Risks / Trade-offs

- **[Risk] TL;DRs pueden sonar repetitivos respecto al subtítulo existente** → Mitigation: Escribir cada TL;DR con un ángulo distinto al subtítulo (subtítulo = claim emocional; TL;DR = resumen funcional del contenido de la página).
- **[Risk] Añadir FAQ en `/working-with-me` puede diluir el CTA principal** → Mitigation: Colocar FAQ DESPUÉS de los engagements y del CTA primario, nunca antes.
- **[Risk] Omitir sufijo de sitio en títulos largos puede reducir reconocimiento de marca en SERPs** → Mitigation: El dominio (`eduardoalvarez.dev`) ya aparece debajo del título en SERPs de Google — el reconocimiento de marca no depende del sufijo del `<title>`.
- **[Risk] FAQ en artículos de 2019-2022 puede sonar forzado** → Mitigation: Limitar a 3 preguntas por artículo legacy; si no hay 3 preguntas genuinas, no añadir.

## Migration Plan

1. Cambios textuales: aditivos. Ningún contenido existente se borra, solo se expande.
2. Nuevo componente `PageFAQ`: se importa solo donde se usa; no afecta páginas que no lo consumen.
3. Ajuste de `head.astro`: la lógica del sufijo es transparente para todo llamador existente (si el resultado cabe en 60 chars, se comporta idéntico a hoy).
4. Deploy normal a Vercel.
5. Re-validar en `https://search.google.com/test/rich-results` con URLs representativas.
6. Re-ejecutar el SEO Analyzer para confirmar score ≥80 en SEO y ≥65 en AEO.

## Open Questions

- ¿Mantener la bio inline en solo 2 páginas o extenderla a `/articles` y `/now`? → Por ahora limitar a `/speaking` y `/newsletter` (las flagged por el audit). Otras páginas ya tienen contexto suficiente.
- ¿Añadir `LastReviewed` o `dateModified` visible en páginas índice? → Fuera de scope; el `dateModified` en JSON-LD ya está cubierto por el change anterior. Mostrarlo visible es candidato para una iteración posterior.
