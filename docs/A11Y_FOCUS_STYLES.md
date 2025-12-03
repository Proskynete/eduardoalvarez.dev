# Estilos de Focus - Navegación por Teclado

**Fecha**: 2025-12-02
**Proyecto**: eduardoalvarez.dev
**Archivo**: `src/assets/styles/base.css`

---

## Resumen

Este documento describe los estilos de focus implementados para mejorar la navegación por teclado y la accesibilidad del sitio.

---

## Especificaciones de Diseño

### Color Principal de Focus
- **Color**: `rgb(236, 72, 153)` (pink-500)
- **Razón**: Color primario del sitio, alta visibilidad sobre fondo oscuro
- **Contraste**: Cumple WCAG AA sobre fondo negro/95

### Grosor y Offset
- **Links**: 3px outline, 4px offset
- **Botones**: 3px outline, 3px offset
- **Inputs**: 2px outline, 2px offset
- **Headings**: 2px outline, 3px offset
- **Imágenes**: 3px outline, 4px offset

---

## Elementos con Focus Outline

### 1. Links (`<a>`)
```css
a:focus-visible {
  outline: 3px solid rgb(236, 72, 153);
  outline-offset: 4px;
  border-radius: 0.375rem;
}
```

**Comportamiento**:
- Outline grueso y visible (3px)
- Offset amplio (4px) para separación clara
- Border radius para suavizar esquinas

**Ejemplo**:
```html
<a href="/articulos">Ver artículos</a>
<!-- Al hacer Tab, muestra outline rosa de 3px -->
```

---

### 2. Botones (`<button>`)
```css
button:focus-visible {
  outline: 3px solid rgb(236, 72, 153);
  outline-offset: 3px;
  border-radius: 0.375rem;
}
```

**Comportamiento**:
- Outline grueso (3px)
- Offset moderado (3px)
- Consistente con diseño de botones

**Ejemplo**:
```html
<button type="submit">Suscribirme</button>
<!-- Al hacer Tab, muestra outline rosa -->
```

---

### 3. Inputs, Textareas, Selects
```css
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: 2px solid rgb(236, 72, 153);
  outline-offset: 2px;
  border-color: rgb(236, 72, 153);
}
```

**Comportamiento**:
- Outline delgado (2px) para no interferir con el contenido
- Offset pequeño (2px)
- Border también cambia a rosa para doble indicación

**Ejemplo**:
```html
<input type="email" placeholder="tu@email.com">
<!-- Al hacer focus: outline rosa + border rosa -->
```

---

### 4. Labels
```css
label:focus-visible {
  outline: 2px dashed rgb(236, 72, 153);
  outline-offset: 2px;
  border-radius: 0.25rem;
}
```

**Comportamiento**:
- Outline dashed (punteado) para diferenciarlo de inputs
- Útil cuando labels tienen `tabindex="0"` para accesibilidad

---

### 5. Imágenes (`<img>`, `<picture>`)
```css
img:focus-visible,
picture:focus-visible {
  outline: 3px solid rgb(236, 72, 153);
  outline-offset: 4px;
  border-radius: 0.5rem;
}
```

**Comportamiento**:
- Outline grueso (3px)
- Offset amplio (4px) para no ocultar bordes de imagen
- Border radius más grande (0.5rem) para mejor estética

**Nota**: Las imágenes solo son focusables si:
- Están dentro de un link (`<a><img></a>`)
- Tienen `tabindex="0"` explícitamente
- Tienen evento click handler

---

### 6. Headings (`<h1>` - `<h6>`)
```css
h1:focus-visible,
h2:focus-visible,
h3:focus-visible,
h4:focus-visible,
h5:focus-visible,
h6:focus-visible {
  outline: 2px solid rgb(236, 72, 153);
  outline-offset: 3px;
  border-radius: 0.25rem;
}
```

**Comportamiento**:
- Outline delgado (2px)
- Solo se aplica si el heading está **fuera de un link**

---

## Regla Especial: Headings dentro de Links

### Problema
En tarjetas de artículos, los headings están dentro de links:

```html
<a href="/articulos/mi-articulo">
  <h3>Título del Artículo</h3>
</a>
```

Si tanto el link como el h3 fueran focusables, habría:
- Redundancia (dos tabs para el mismo destino)
- Confusión (¿qué elemento tiene focus?)
- Mala UX (navegación innecesariamente larga)

### Solución Implementada

```css
/* Headings dentro de links NO son focusables */
a h1,
a h2,
a h3,
a h4,
a h5,
a h6 {
  pointer-events: none; /* No reciben eventos de mouse */
  outline: none !important; /* Nunca muestran outline */
}

/* El link padre tiene outline mejorado */
a:has(h1, h2, h3, h4, h5, h6):focus-visible {
  outline: 3px solid rgb(236, 72, 153);
  outline-offset: 4px;
  border-radius: 0.5rem;
}
```

**Resultado**:
- Solo el link recibe focus (un Tab)
- El heading no es interactivo
- El outline rodea toda la tarjeta del artículo
- UX mejorada y accesible

**Ejemplo Práctico**:
```html
<!-- ANTES (malo): -->
<a href="/articulos/mi-articulo">  <!-- Tab 1 -->
  <h3>Mi Artículo</h3>              <!-- Tab 2 (redundante) -->
</a>

<!-- DESPUÉS (bueno): -->
<a href="/articulos/mi-articulo">  <!-- Tab 1 (único) -->
  <h3>Mi Artículo</h3>              <!-- No focusable -->
</a>
```

---

## Focus vs Focus-Visible

### `:focus`
- Se activa con cualquier tipo de interacción (mouse, teclado, touch)
- **En este proyecto**: Removido con `outline: none`

### `:focus-visible`
- Solo se activa con navegación por teclado
- **En este proyecto**: Todos los outlines usan `:focus-visible`

**Razón**: Los outlines solo aparecen cuando son necesarios (teclado), no cuando se hace click con mouse.

```css
/* Removemos outline en focus general */
*:focus {
  outline: none;
}

/* Solo mostramos outline con teclado */
*:focus-visible {
  outline: 2px solid rgb(236, 72, 153);
  outline-offset: 3px;
  border-radius: 0.25rem;
}
```

---

## Casos de Uso

### Navegación en Home
1. Tab → Skip to content (azul)
2. Tab → Logo
3. Tab → Link "articulos"
4. Tab → Link "charlas-talleres"
5. Tab → Search toggle button
6. ...

### Navegación en Listado de Artículos
1. Tab → Artículo 1 (outline rodea toda la tarjeta)
2. Tab → Artículo 2 (outline rodea toda la tarjeta)
3. ...

**Nota**: El h3 dentro de cada artículo NO recibe focus individual.

### Formulario de Suscripción
1. Tab → Input nombre (outline + border rosa)
2. Tab → Input email (outline + border rosa)
3. Tab → Botón suscribir (outline rosa)

---

## Testing

### Manual (Teclado)
1. Abrir sitio
2. Presionar Tab repetidamente
3. Verificar que todos los elementos interactivos muestran outline rosa
4. Verificar que headings dentro de links NO reciben focus individual

### Automatizado (axe-core)
```bash
npm run a11y:audit
```

Debe pasar sin errores de focus.

---

## Compatibilidad

### Navegadores Soportados
- ✅ Chrome/Edge (soporte completo)
- ✅ Firefox (soporte completo)
- ✅ Safari (soporte completo)
- ⚠️ IE11 (no soporta `:focus-visible`, usa `:focus` como fallback)

### Selector `:has()`
- ✅ Chrome 105+
- ✅ Firefox 121+
- ✅ Safari 15.4+

**Fallback**: En navegadores antiguos, los headings dentro de links podrían ser focusables, pero es un degradado aceptable.

---

## Mejores Prácticas

### ✅ Hacer
- Usar `:focus-visible` en lugar de `:focus`
- Outline de al menos 2px de grosor
- Offset de al menos 2px
- Color con alto contraste sobre fondo
- Evitar headings focusables dentro de links

### ❌ Evitar
- `outline: none` sin alternativa
- Outline del mismo color que el fondo
- Outline muy delgado (< 1px)
- Hacer headings focusables dentro de links
- Usar solo cambios de color (insuficiente para algunos usuarios)

---

## Referencias

- [WCAG 2.1 - Focus Visible](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html)
- [MDN - :focus-visible](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible)
- [WebAIM - Keyboard Accessibility](https://webaim.org/techniques/keyboard/)
