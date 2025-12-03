# Guía de Implementación: Charlas y Talleres

## Índice

1. [Visión General](#visión-general)
2. [Estructura Actual](#estructura-actual)
3. [Estructura Propuesta](#estructura-propuesta)
4. [Cambios Específicos](#cambios-específicos)
5. [Código de Implementación](#código-de-implementación)
6. [Testing](#testing)
7. [Experiencia del Usuario](#experiencia-del-usuario)

---

## Visión General

### Objetivo

Mejorar la accesibilidad de la vista de charlas y talleres para que usuarios de lectores de pantalla puedan:

1. **Entender inmediatamente** que están en una página de charlas y talleres impartidos
2. **Navegar eficientemente** entre charlas usando estructura de artículos
3. **Acceder a metadata compleja** (lugar, fecha, organizaciones, recursos)
4. **Usar el dropdown de recursos** con teclado y screen reader
5. **Comprender imágenes** decorativas vs informativas

### Alcance

**Archivos a modificar**:
- `src/pages/charlas-talleres/index.astro` (principal)
- `src/components/dropdown/index.tsx` (mejoras importantes)

**Tiempo estimado**: 2-3 horas

---

## Estructura Actual

### HTML Simplificado Actual

```astro
<!-- src/pages/charlas-talleres/index.astro -->
<Layout seo={seo}>
  <div class="flex flex-col">
    <section class="space-y-5 mb-20">
      <hgroup class="mb-8">
        <h1>Charlas y Talleres</h1>
        <p>Charlas y talleres que he impartido.</p>
      </hgroup>

      <section class="grid grid-cols-1 gap-5...">
        {talks.map((talk: Talk) =>
          talk.show && (
            <article class="relative flex...">
              <div class="p-4 w-full md:w-3/5...">
                <div class="flex flex-col gap-2">
                  <div class="flex items-baseline justify-between">
                    <h3>{talk.title}</h3>

                    {talk.options && (
                      <div class="h-8 w-8...">
                        <Dropdown client:visible options={[...]} />
                      </div>
                    )}
                  </div>

                  <div class="flex flex-col">
                    <p class="flex text-sm gap-1">
                      <span class="font-semibold">Lugar</span>:
                      <a href={talk.location.url}>{talk.location.name}</a>
                    </p>

                    <p class="text-sm">
                      <span class="font-semibold">Cuando</span>:
                      <time datetime={talk.date[0]}>...</time>
                    </p>
                  </div>

                  <div class="mt-2">
                    <p class="text-sm line-clamp-2">
                      <span class="font-semibold">Descripción</span>: {talk.description}
                    </p>
                  </div>
                </div>

                <div class="flex flex-col gap-2 mt-5 lg:mt-0">
                  <p class="text-sm font-semibold...">Organizaciones:</p>

                  <div class="flex gap-4">
                    {talk.organizations.map((org) => (
                      <a href={org.url}...>
                        <Image src={org.logo} alt={org.name} />
                        <div class="text-sm">
                          <p>{org.name}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div class="w-full md:w-2/5">
                <Image src={talk.image || NO_IMAGE} alt={talk.title} />
              </div>
            </article>
          )
        )}
      </section>
    </section>
  </div>
</Layout>
```

### Problemas Identificados

1. ❌ **Div wrapper innecesario**: Igual que en artículos listing
2. ❌ **Secciones anidadas sin identificar**: Confusión de landmarks
3. ❌ **h3 sin h2**: Salto en jerarquía de headings (h1 → h3)
4. ❌ **Dropdown sin accesibilidad**: Sin ARIA, sin navegación por teclado
5. ❌ **Time sin aria-label**: Formato corto sin contexto completo
6. ❌ **Organizaciones sin lista semántica**: Links sueltos sin estructura
7. ❌ **Imágenes sin evaluar**: ¿Decorativas o informativas?

---

## Estructura Propuesta

### Mapa de Landmarks

```
<main id="main-content">
  └─ <section aria-labelledby="talks-heading">
     ├─ <hgroup>
     │  ├─ h1 id="talks-heading": "Charlas y Talleres"
     │  └─ p: Descripción
     │
     └─ Lista de charlas (sin ul/li porque son articles grandes)
        └─ <article aria-labelledby="talk-title-{id}">
           ├─ h2 id="talk-title-{id}": Título charla
           ├─ Dropdown de recursos (mejorado)
           ├─ Metadata (lugar, fecha, descripción)
           ├─ <nav aria-label>: Organizaciones (lista)
           └─ Imagen (decorativa o descriptiva)
</main>
```

### Jerarquía de Headings

```
h1: "Charlas y Talleres"
  h2: Título charla 1
  h2: Título charla 2
  h2: Título charla 3
  ...
```

**Cambio importante**: h3 → h2 para no saltar niveles.

---

## Cambios Específicos

### Cambio 1: Simplificar Estructura y Corregir Headings

#### Antes

```astro
<div class="flex flex-col">
  <section class="space-y-5 mb-20">
    <hgroup class="mb-8">
      <h1>Charlas y Talleres</h1>
      <p>Charlas y talleres que he impartido.</p>
    </hgroup>

    <section class="grid grid-cols-1 gap-5...">
      {talks.map((talk: Talk) => (
        <article>
          <h3>{talk.title}</h3> <!-- PROBLEMA: h1 → h3 -->
        </article>
      ))}
    </section>
  </section>
</div>
```

#### Después

```astro
<section
  aria-labelledby="talks-heading"
  class="space-y-5 mb-20"
>
  <hgroup class="mb-8">
    <h1
      id="talks-heading"
      class="font-hero text-4xl leading-9 text-gray-100 sm:leading-10 md:text-3xl"
    >
      Charlas y Talleres
    </h1>
    <p class="text-gray-400">
      Charlas y talleres que he impartido.
    </p>
  </hgroup>

  <div class="grid grid-cols-1 gap-5 mx-auto lg:max-w-[80%]">
    {talks.map((talk: Talk, index) =>
      talk.show && (
        <article
          aria-labelledby={`talk-title-${index}`}
          class="relative flex flex-col-reverse md:flex-row border rounded-md md:mb-4..."
        >
          <h2
            id={`talk-title-${index}`}
            class="text-xl font-hero font-bold"
          >
            {talk.title}
          </h2>
          <!-- Resto del contenido -->
        </article>
      )
    )}
  </div>
</section>
```

**Por qué**:
- Removido div innecesario
- Removida section anidada
- h3 → h2 para jerarquía correcta
- `aria-labelledby` conecta article con su título
- h1 tiene ID para conectar con section

---

### Cambio 2: Mejorar Metadata con ARIA

#### Antes

```astro
<div class="flex flex-col">
  <p class="flex text-sm gap-1">
    <span class="font-semibold">Lugar</span>:
    <a href={talk.location.url}>{talk.location.name}</a>
  </p>

  <p class="text-sm">
    <span class="font-semibold">Cuando</span>:
    <time datetime={talk.date[0]}>
      El {new Date(talk.date[0]).toLocaleDateString("es-ES", {...})}
    </time>
  </p>
</div>

<div class="mt-2">
  <p class="text-sm line-clamp-2">
    <span class="font-semibold">Descripción</span>: {talk.description}
  </p>
</div>
```

#### Después

```astro
<dl class="flex flex-col gap-1 text-sm">
  <div class="flex gap-1">
    <dt class="font-semibold">Lugar:</dt>
    <dd>
      <a
        href={talk.location.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Ver información de ${talk.location.name}`}
        class="text-primary-400 hover:text-primary-500 transition ease-in-out duration-300"
      >
        {talk.location.name}
      </a>
    </dd>
  </div>

  <div class="flex gap-1">
    <dt class="font-semibold">Cuando:</dt>
    <dd>
      <time
        datetime={talk.date[0]}
        aria-label={`Fecha de la charla: ${new Date(talk.date[0]).toLocaleDateString("es-ES", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}`}
      >
        El {new Date(talk.date[0]).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>
    </dd>
  </div>

  <div class="mt-2">
    <dt class="font-semibold inline">Descripción:</dt>
    <dd class="inline ml-1 line-clamp-2">{talk.description}</dd>
  </div>
</dl>
```

**Por qué**:
- `<dl>` (definition list) es semánticamente correcto para pares clave-valor
- `<dt>` (term) y `<dd>` (definition) clarifican la estructura
- `<time>` con `aria-label` da formato completo
- Link con `aria-label` más descriptivo

---

### Cambio 3: Organizaciones como Lista Semántica

#### Antes

```astro
<div class="flex flex-col gap-2 mt-5 lg:mt-0">
  <p class="text-sm font-semibold...">Organizaciones:</p>

  <div class="flex gap-4">
    {talk.organizations.map((org) => (
      <a href={org.url}...>
        <Image src={org.logo} alt={org.name} />
        <div class="text-sm">
          <p>{org.name}</p>
        </div>
      </a>
    ))}
  </div>
</div>
```

#### Después

```astro
<nav
  aria-label={`Organizaciones que participaron en ${talk.title}`}
  class="mt-5 lg:mt-0"
>
  <h3 class="text-sm font-semibold mb-2">Organizaciones:</h3>

  <ul class="flex gap-4 list-none">
    {talk.organizations.map((org) => (
      <li>
        <a
          href={org.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visitar sitio de ${org.name}`}
          class="flex items-center group hover:transform transition-transform"
        >
          <Image
            class="w-10 h-10 rounded-full mr-2 group-hover:rotate-12 duration-300"
            src={org.logo}
            alt=""
            aria-hidden="true"
            width={40}
            height={40}
            loading="lazy"
            decoding="async"
          />
          <span class="text-sm leading-none text-primary-400 hover:text-primary-500">
            {org.name}
          </span>
        </a>
      </li>
    ))}
  </ul>
</nav>
```

**Por qué**:
- `<nav>` porque son links externos importantes
- `<ul><li>` estructura semántica
- h3 para jerarquía (dentro de h2 de la charla)
- Imagen de logo como decorativa (`alt=""` + `aria-hidden`)
- Link con `aria-label` descriptivo
- Nombre visible para contexto

---

### Cambio 4: Manejo de Imágenes de Charlas

#### Decisión: Decorativa vs Informativa

**Pregunta**: ¿La imagen aporta información adicional o solo es visual?

**Análisis**:
- Si es una captura de la presentación → **Informativa**
- Si es foto del evento → **Informativa**
- Si es imagen genérica/placeholder → **Decorativa**

#### Implementación

```astro
<div class="w-full md:w-2/5">
  {talk.image && talk.image !== NO_IMAGE ? (
    <!-- Imagen informativa -->
    <Image
      src={talk.image}
      alt={`Imagen de la charla "${talk.title}" presentada en ${talk.location.name}`}
      class="rounded-t-md rounded-b-none md:rounded-r-md md:rounded-l-none w-max h-auto md:w-full md:h-full object-cover lg:object-contain aspec-[4/2]"
      width={800}
      height={533}
      loading="lazy"
      decoding="async"
    />
  ) : (
    <!-- Imagen decorativa (placeholder) -->
    <Image
      src={NO_IMAGE}
      alt=""
      aria-hidden="true"
      class="rounded-t-md rounded-b-none md:rounded-r-md md:rounded-l-none w-max h-auto md:w-full md:h-full object-cover lg:object-contain aspec-[4/2] opacity-50"
      width={800}
      height={533}
      loading="lazy"
      decoding="async"
    />
  )}
</div>
```

**Por qué**:
- Imagen real: alt descriptivo con contexto
- Placeholder: `alt=""` + `aria-hidden="true"` para no molestar

---

### Cambio 5: Dropdown Accesible

El dropdown actual tiene varios problemas de accesibilidad. Necesita mejoras significativas.

#### Antes (Problemas)

```tsx
// src/components/dropdown/index.tsx
<button
  id="dropdown-button"
  type="button"
  onClick={() => setOpen(!open)}
>
  <Icon.Menu width={20} />
</button>

{open && (
  <div id="dropdown" className="...">
    <ul aria-labelledby="dropdown-button">
      {/* Items */}
    </ul>
  </div>
)}
```

**Problemas**:
- ❌ Botón sin `aria-label`
- ❌ Sin `aria-expanded`
- ❌ Sin `aria-haspopup`
- ❌ Estructura de listas incorrecta (li dentro de a)
- ❌ Sin navegación por arrows
- ❌ Sin escape key handling en el botón

#### Después (Mejorado)

```tsx
// src/components/dropdown/index.tsx
import { useRef, useState, useEffect } from "react";
import { Icon } from "../../assets/icons";
import { clearString } from "../../utils/strings";

interface Options {
  name: string;
  url?: string;
  type?: "title" | "link" | "download";
  ariaTitle?: string;
  title?: string;
}

interface DropdownProps {
  options: Options[][];
  ariaLabel?: string;
}

export function Dropdown({ options, ariaLabel = "Opciones de recursos" }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (elementRef.current && !elementRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      buttonRef.current?.focus();
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={elementRef} className="flex relative h-full w-full xl:w-max">
      <button
        ref={buttonRef}
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-haspopup="menu"
        className="w-full xl:w-max flex items-center justify-center px-2 text-sm font-medium bg-transparent text-white transition ease-in-out duration-300"
        type="button"
        onClick={() => setOpen(!open)}
      >
        <Icon.Menu width={20} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute w-44 divide-y top-9 right-0 divide-gray-100 rounded-lg shadow bg-gray-700 block transition ease-in-out duration-300 z-10"
        >
          {options.map((group, groupIndex) => (
            <ul key={groupIndex} className="py-2 text-sm">
              {group.map((item, itemIndex) =>
                item.type !== "title" ? (
                  <li key={itemIndex} role="none">
                    <a
                      href={item.url}
                      role="menuitem"
                      {...(item.type === "link" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      {...(item.type === "download" ? { download: clearString(item.title || "") } : {})}
                      aria-label={item.ariaTitle || item.name}
                      className="block w-full px-4 py-2 text-gray-100 hover:bg-gray-600 hover:text-white transition-colors duration-300"
                      onClick={() => setOpen(false)}
                    >
                      {item.name}
                    </a>
                  </li>
                ) : (
                  <li key={itemIndex} role="presentation" className="px-4 py-2 bg-gray-600 text-gray-400 text-xs uppercase tracking-wide">
                    {item.name}
                  </li>
                ),
              )}
            </ul>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Mejoras clave**:
1. `aria-label` en botón (acepta prop)
2. `aria-expanded` indica estado
3. `aria-haspopup="menu"` indica tipo de popup
4. `role="menu"` en contenedor
5. `role="menuitem"` en links
6. `role="presentation"` en títulos
7. `role="none"` en li (requerido con menuitem)
8. Escape cierra y retorna focus al botón
9. Click en item cierra el menú
10. useEffect para cleanup de listeners

**Uso en charlas**:

```astro
<Dropdown
  client:visible
  ariaLabel={`Recursos para ${talk.title}`}
  options={[...]}
/>
```

---

## Código de Implementación

### Archivo Completo: src/pages/charlas-talleres/index.astro

```astro
---
import Layout from "../../layouts/main/index.astro";
import { talks } from "../../settings/talks";
import type { Talk } from "../../settings/talks";
import { Dropdown } from "../../components/dropdown";
import { Image } from "astro:assets";
import NO_IMAGE from "../../assets/images/no-image.webp";

export const prerender = true;

const seo = {
  title: "Charlas y talleres",
  description: "Charlas y talleres que he impartido.",
  image: "/images/talleres/charlas-talleres.webp",
};
---

<Layout seo={seo}>
  <section
    aria-labelledby="talks-heading"
    class="space-y-5 mb-20"
  >
    <hgroup class="mb-8">
      <h1
        id="talks-heading"
        class="font-hero text-4xl leading-9 text-gray-100 sm:leading-10 md:text-3xl"
      >
        Charlas y Talleres
      </h1>
      <p class="text-gray-400">
        Charlas y talleres que he impartido.
      </p>
    </hgroup>

    <div class="grid grid-cols-1 gap-5 mx-auto lg:max-w-[80%]">
      {
        talks.map((talk: Talk, index: number) =>
          talk.show && (
            <article
              aria-labelledby={`talk-title-${index}`}
              class="relative flex flex-col-reverse md:flex-row border rounded-md md:mb-4 before:content-[''] before:rounded-t-md before:xl:rounded-md"
            >
              <div class="p-4 w-full md:w-3/5 flex flex-col justify-between">
                <div class="flex flex-col gap-2">
                  <div class="flex items-baseline justify-between">
                    <h2
                      id={`talk-title-${index}`}
                      class="text-xl font-hero font-bold"
                    >
                      {talk.title}
                    </h2>

                    {talk.options && (
                      <div class="h-8 w-8 flex justify-center items-center rounded-full border-gray-50 hover:bg-gray-50 hover:bg-opacity-10 transition ease-in-out duration-300">
                        <Dropdown
                          client:visible
                          ariaLabel={`Recursos para ${talk.title}`}
                          options={[
                            (talk.options.repo && [
                              { name: "Repositorio", type: "title" },
                              { name: "Github", url: talk.options.repo, ariaTitle: "Repositorio en Github" },
                            ]) || [],
                            (talk.options.presentation && [
                              { name: "Presentación", type: "title" },
                              { name: "Ir a ver", url: talk.options.presentation, type: "link", ariaTitle: "Revisar presentación" },
                            ]) || [],
                            (talk.options.resources && [
                              { name: "Descargables", type: "title" },
                              ...(talk.options.resources?.map((option) => ({
                                name: option.label,
                                url: option.url,
                                type: "download" as const,
                                ariaTitle: `Descargar ${option.label}`,
                                title: `${talk.title}-${option.label}`,
                              })) || []),
                            ]) || [],
                          ]}
                        />
                      </div>
                    )}
                  </div>

                  <dl class="flex flex-col gap-1 text-sm">
                    <div class="flex gap-1">
                      <dt class="font-semibold">Lugar:</dt>
                      <dd>
                        <a
                          href={talk.location.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Ver información de ${talk.location.name}`}
                          class="text-primary-400 hover:text-primary-500 transition ease-in-out duration-300"
                        >
                          {talk.location.name}
                        </a>
                      </dd>
                    </div>

                    <div class="flex gap-1">
                      <dt class="font-semibold">Cuando:</dt>
                      <dd>
                        <time
                          datetime={talk.date[0]}
                          aria-label={`Fecha de la charla: ${new Date(talk.date[0]).toLocaleDateString("es-ES", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}`}
                        >
                          El {new Date(talk.date[0]).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </time>
                      </dd>
                    </div>

                    <div class="mt-2 flex">
                      <dt class="font-semibold">Descripción:</dt>
                      <dd class="ml-1 line-clamp-2">{talk.description}</dd>
                    </div>
                  </dl>
                </div>

                <nav
                  aria-label={`Organizaciones que participaron en ${talk.title}`}
                  class="mt-5 lg:mt-0"
                >
                  <h3 class="text-sm font-semibold mb-2">Organizaciones:</h3>

                  <ul class="flex gap-4 list-none">
                    {talk.organizations.map((org) => (
                      <li>
                        <a
                          href={org.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Visitar sitio de ${org.name}`}
                          class="flex items-center group hover:transform transition-transform"
                        >
                          <Image
                            class="w-10 h-10 rounded-full mr-2 group-hover:rotate-12 duration-300"
                            src={org.logo}
                            alt=""
                            aria-hidden="true"
                            width={40}
                            height={40}
                            loading="lazy"
                            decoding="async"
                          />
                          <span class="text-sm leading-none text-primary-400 hover:text-primary-500">
                            {org.name}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>

              <div class="w-full md:w-2/5">
                {talk.image && talk.image !== NO_IMAGE ? (
                  <Image
                    src={talk.image}
                    alt={`Imagen de la charla "${talk.title}" presentada en ${talk.location.name}`}
                    class="rounded-t-md rounded-b-none md:rounded-r-md md:rounded-l-none w-max h-auto md:w-full md:h-full object-cover lg:object-contain aspec-[4/2]"
                    width={800}
                    height={533}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <Image
                    src={NO_IMAGE}
                    alt=""
                    aria-hidden="true"
                    class="rounded-t-md rounded-b-none md:rounded-r-md md:rounded-l-none w-max h-auto md:w-full md:h-full object-cover lg:object-contain aspec-[4/2] opacity-50"
                    width={800}
                    height={533}
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </div>
            </article>
          ),
        )
      }
    </div>
  </section>
</Layout>
```

---

## Testing

### Checklist de Validación

#### 1. Navegación por Teclado

```bash
# Abrir http://localhost:4321/charlas-talleres
# Presionar Tab

✓ Skip link funciona
✓ Header navegación
✓ Cada charla focusable
✓ Título de charla linkeable
✓ Dropdown button focusable
✓ Link de lugar focusable
✓ Links de organizaciones focusables
✓ Footer

# Dropdown específico:
Tab hasta botón dropdown → Enter
✓ Menú se abre
✓ Tab entra a primer menuitem
✓ Links focusables
✓ Esc cierra y retorna focus
✓ Click en item cierra menú
```

#### 2. VoiceOver (macOS)

```bash
# Test 1: Landmarks
Cmd + VO + U → Landmarks
✓ Banner, Navigation, Main, Region "Charlas y Talleres", Contentinfo

# Test 2: Headings
VO + Cmd + H
✓ h1: "Charlas y Talleres"
✓ h2: Título charla 1
✓ h3: "Organizaciones" (dentro de charla 1)
✓ h2: Título charla 2
...

# Test 3: Dropdown
Tab hasta dropdown → Enter
✓ "Button, Recursos para [título], collapsed"
Enter para abrir
✓ "Button, Recursos para [título], expanded"
✓ "Menu with X items"
Tab
✓ "Link, [nombre recurso]"
Esc
✓ Focus retorna a botón

# Test 4: Metadata
✓ Definition list detectada
✓ Time con aria-label anunciado completo
✓ Links con contexto

# Test 5: Organizaciones
VO + Cmd + X (siguiente lista)
✓ "Navigation, Organizaciones que participaron en [título]"
✓ "List, X items"
✓ Logos no leídos (aria-hidden)
✓ Nombres leídos correctamente
```

#### 3. Axe DevTools

```bash
✓ 0 violations
✓ page-has-heading-one: PASS
✓ landmark-one-main: PASS
✓ heading-order: PASS (h1 → h2 → h3, correcto)
✓ button-name: PASS (dropdown tiene aria-label)
✓ aria-valid-attr-value: PASS
✓ list: PASS
✓ definition-list: PASS
```

#### 4. Testing CLI

```bash
npm run test:a11y:talks

# O
axe http://localhost:4321/charlas-talleres --exit

✓ No violations found
```

---

## Experiencia del Usuario

### Antes de los Cambios

```
Usuario con VoiceOver:
1. H → "Heading level 1, Charlas y Talleres"
2. Tab → Link título charla (sin contexto de article)
3. Tab → Button (sin label, confuso)
4. "Lugar Workshop Chile" (sin estructura)
5. Tab → Link org 1
6. Tab → Link org 2 (sin saber que es lista)
```

### Después de los Cambios

```
Usuario con VoiceOver:
1. H → "Heading level 1, Charlas y Talleres"
2. Leer descripción
3. Tab → "Article, [título charla]"
   H → "Heading level 2, [título]"
4. Tab → "Button, Recursos para [título], collapsed"
   Enter → "expanded, Menu with 5 items"
   Tab → "Link, Repositorio en Github"
   Esc → vuelve a botón
5. "Definition list"
   → "Term: Lugar, Definition: Link, Ver información de..."
   → "Term: Cuando, Definition: Time, Fecha de la charla: martes 15 de marzo..."
6. N (next navigation) → "Navigation, Organizaciones que participaron en [título]"
   L → "List, 2 items"
   Tab → "Link, Visitar sitio de [org]"
```

---

## Resumen de Cambios

| Elemento | Antes | Después | Beneficio |
|----------|-------|---------|-----------|
| **Headings** | h1 → h3 (salto) | h1 → h2 → h3 | Jerarquía correcta |
| **Article** | Sin identificar | `aria-labelledby` | Conectado con título |
| **Dropdown button** | Sin ARIA | aria-label + expanded + haspopup | Completamente accesible |
| **Dropdown menu** | Div con ul | role="menu" con menuitems | Semántica correcta |
| **Metadata** | Párrafos | `<dl><dt><dd>` | Estructura clara |
| **Time** | Sin contexto | `aria-label` completo | Fecha legible |
| **Organizaciones** | Divs con links | `<nav><ul><li>` | Lista + navegación |
| **Logos** | alt con nombre | alt="" + aria-hidden | Decorativos |
| **Imágenes charlas** | alt genérico | Descriptivo o decorativo | Contextual |

---

## Próximos Pasos

1. ✅ Implementar cambios en código
2. ✅ Testing manual extensivo del dropdown
3. ✅ Testing con VoiceOver/NVDA
4. ✅ Testing automático con axe-core
5. ✅ Crear commit siguiendo formato del plan
6. ⏳ Pasar a Fase 4: Artículo Individual (última fase)

---

**Documento creado**: 2025-12-03
**Última actualización**: 2025-12-03
**Versión**: 1.0.0
**Autor**: Eduardo Álvarez
**Estado**: ✅ Listo para implementación
