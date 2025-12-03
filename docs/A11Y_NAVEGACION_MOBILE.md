# Accesibilidad de Navegación Mobile

## Resumen

Implementación de mejoras de accesibilidad para la navegación mobile, garantizando que los elementos del menú no sean accesibles por teclado cuando el menú está cerrado y mejorando la experiencia de navegación con tecnologías asistivas.

## Problemas Identificados

### 1. Menú Mobile en Tab Order Cuando Está Oculto
**Síntoma**: Al navegar con la tecla Tab por la página en desktop, el foco del teclado entraba en los elementos del menú mobile aunque éste estuviera visualmente oculto (translate-x-full).

**Impacto**:
- Usuarios de teclado tabulaban a través de elementos invisibles
- Experiencia confusa y desorientadora
- Violación de principios de accesibilidad WCAG

### 2. Navegación Mobile Sin Indicadores ARIA
**Síntoma**: No había indicadores para tecnologías asistivas sobre el estado del menú (abierto/cerrado).

**Impacto**:
- Usuarios de lectores de pantalla no sabían si el menú estaba abierto o cerrado
- Falta de contexto para la interacción

## Soluciones Implementadas

### 1. Atributo `inert`

**Ubicación**: `src/layouts/base/components/header/components/mobile.tsx:44`

```tsx
<div
  className={`... ${navShow ? "translate-x-0" : "translate-x-full"}`}
  aria-hidden={!navShow}
  inert={!navShow ? "" : undefined}
>
```

**Función**: El atributo `inert` hace que TODO el contenedor del menú y sus descendientes sean:
- No focusables por teclado
- No seleccionables
- Ignorados por tecnologías asistivas
- Excluidos del tab order

**Por qué funciona**: Es una solución holística que previene cualquier interacción con el contenido oculto, sin necesidad de manejar cada elemento hijo individualmente.

### 2. Atributo `aria-hidden`

**Ubicación**: `src/layouts/base/components/header/components/mobile.tsx:43`

```tsx
aria-hidden={!navShow}
```

**Función**: Comunica a las tecnologías asistivas que el menú está oculto cuando `navShow` es false.

**Complementariedad**: Trabaja junto con `inert` para una solución completa:
- `inert`: Previene interacción física (teclado, mouse)
- `aria-hidden`: Comunica el estado a lectores de pantalla

### 3. Atributo `aria-expanded`

**Ubicación**: `src/layouts/base/components/header/components/mobile.tsx:21`

```tsx
<button
  aria-label="Toggle Menu"
  aria-expanded={navShow}
  onClick={onToggleNav}
  className="sm:hidden"
>
```

**Función**: Indica si el botón controla un elemento expandible y su estado actual (true/false).

**Beneficio**: Los usuarios de lectores de pantalla escuchan "Toggle Menu, button, expanded" o "Toggle Menu, button, collapsed".

### 4. Gestión de `tabIndex` en Enlaces

**Ubicación**: `src/layouts/base/components/header/components/mobile.tsx:86`

```tsx
<a href={link.href} className="text-gray-100" tabIndex={navShow ? 0 : -1}>
```

**Función**:
- `tabIndex={0}`: Incluye el link en el tab order normal (cuando menú abierto)
- `tabIndex={-1}`: Excluye el link del tab order (cuando menú cerrado)

**Redundancia intencional**: Aunque `inert` ya maneja esto, agregamos `tabIndex` como:
- Fallback para navegadores sin soporte completo de `inert`
- Defensa en profundidad
- Claridad de intención en el código

### 5. Gestión de `tabIndex` en Botón de Cierre

**Ubicación**: `src/layouts/base/components/header/components/mobile.tsx:50`

```tsx
<button
  className="absolute h-8 w-8 top-11 right-5 z-20"
  aria-label="Close Menu"
  onClick={onToggleNav}
  tabIndex={navShow ? 0 : -1}
>
```

**Función**: Igual que los enlaces, previene que el botón de cierre reciba foco cuando el menú está cerrado.

### 6. Fix de Logo Outline

**Ubicación**: `src/layouts/base/components/header/index.astro`

**Cambio**:
```diff
- <a href="/" aria-label="Eduardo Alvarez logo" class="focus:outline">
+ <a href="/" aria-label="Eduardo Alvarez logo" class="inline-block">
```

**Problema original**: La clase `focus:outline` de Tailwind estaba interfiriendo con los estilos CSS personalizados de outline.

**Solución**: Remover la clase conflictiva y agregar `inline-block` para asegurar que el elemento tenga dimensiones definidas para el outline.

## Compatibilidad del Atributo `inert`

### Soporte de Navegadores

| Navegador | Versión Mínima |
|-----------|---------------|
| Chrome | 102+ (Mayo 2022) |
| Edge | 102+ (Mayo 2022) |
| Firefox | 112+ (Abril 2023) |
| Safari | 15.5+ (Mayo 2022) |

### Polyfill para Navegadores Antiguos

Si se necesita soporte para navegadores más antiguos, se puede usar:

```bash
npm install wicg-inert
```

```javascript
import 'wicg-inert';
```

**Decisión actual**: No usar polyfill porque:
1. Soporte nativo excelente (>95% de usuarios)
2. Tenemos fallbacks con `tabIndex`
3. Minimiza dependencias y tamaño del bundle

## Jerarquía de Soluciones

La implementación usa defensa en profundidad:

```
┌─────────────────────────────────────────┐
│ Nivel 1: inert (solución principal)    │  ← Previene toda interacción
├─────────────────────────────────────────┤
│ Nivel 2: aria-hidden                    │  ← Comunica estado a lectores
├─────────────────────────────────────────┤
│ Nivel 3: tabIndex=-1                    │  ← Fallback para navegadores
└─────────────────────────────────────────┘
```

## Testing Manual

### Desktop (viewport > 640px)

1. **Tab a través de la navegación**:
   - ✅ El menú mobile NO debe estar en el tab order
   - ✅ Solo elementos visibles reciben foco

2. **Verificar que no se puede acceder al menú mobile**:
   - ✅ Tab salta directamente del header al contenido principal

### Mobile (viewport < 640px)

1. **Abrir menú con botón hamburguesa**:
   - ✅ Presionar Tab entra al botón "Close Menu"
   - ✅ Continuar con Tab navega por los links del menú
   - ✅ Los links tienen focus outline visible

2. **Cerrar menú**:
   - ✅ Tab ya no entra al menú cerrado
   - ✅ Tab continúa con elementos visibles de la página

3. **Lector de pantalla**:
   - ✅ Anuncia "Toggle Menu, button, collapsed" cuando cerrado
   - ✅ Anuncia "Toggle Menu, button, expanded" cuando abierto
   - ✅ No lee elementos del menú cuando está cerrado

## Verificación con Herramientas

### axe DevTools
```bash
# No debe reportar violaciones relacionadas con:
# - Elementos ocultos en tab order
# - Falta de atributos ARIA en botones
# - Nombres accesibles en botones
```

### Keyboard Navigation Test
```
1. Tab desde la barra de direcciones
2. Verificar que solo elementos visibles reciben foco
3. En mobile, verificar que menú cerrado no recibe foco
4. En mobile con menú abierto, verificar navegación correcta
```

## Archivos Modificados

1. `src/layouts/base/components/header/components/mobile.tsx`
   - Línea 21: Agregado `aria-expanded`
   - Línea 43-44: Agregado `aria-hidden` e `inert`
   - Línea 48-50: Cambiado aria-label y agregado `tabIndex` al botón close
   - Línea 86: Agregado `tabIndex` a todos los links de navegación

2. `src/layouts/base/components/header/index.astro`
   - Cambio de clase `focus:outline` a `inline-block` en logo

## Referencias

- [MDN: inert attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inert)
- [WCAG 2.1: 2.4.3 Focus Order](https://www.w3.org/WAI/WCAG21/Understanding/focus-order.html)
- [ARIA: aria-expanded](https://www.w3.org/TR/wai-aria-1.2/#aria-expanded)
- [ARIA: aria-hidden](https://www.w3.org/TR/wai-aria-1.2/#aria-hidden)

## Resultados

### Antes
- ❌ Menú mobile accesible por Tab cuando estaba oculto
- ❌ Sin indicadores ARIA de estado
- ❌ Experiencia confusa para usuarios de teclado
- ❌ Logo sin outline visible

### Después
- ✅ Menú mobile completamente inerte cuando está cerrado
- ✅ Estados comunicados correctamente con ARIA
- ✅ Navegación por teclado limpia y predecible
- ✅ Logo con outline visible en focus
- ✅ Cumple con WCAG 2.1 Level AA para navegación por teclado
