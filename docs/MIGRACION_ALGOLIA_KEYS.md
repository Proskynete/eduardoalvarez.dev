# Migracion a API Keys de Solo Lectura - Completada

## Resumen de Cambios

Se ha implementado exitosamente la migracion de Algolia Admin API Key a Search-Only API Key para mejorar la seguridad del sitio web. Ahora el cliente solo tiene acceso de lectura (busqueda), mientras que las operaciones de escritura (indexacion) permanecen seguras en el servidor durante el build.

**Optimizacion adicional**: Se unificaron las variables de entorno para evitar duplicacion, usando variables `PUBLIC_*` compartidas entre cliente y servidor donde es posible.

## Archivos Modificados

### 1. `.env.template`
- Se organizaron las variables en compartidas y especificas por contexto
- Variables compartidas (`PUBLIC_ALGOLIA_APPLICATION_ID`, `PUBLIC_ALGOLIA_INDEX_NAME`) se usan tanto en cliente como servidor
- Se agrego `PUBLIC_ALGOLIA_SEARCH_API_KEY` para busquedas en el cliente (solo lectura)
- Se mantiene `ALGOLIA_ADMIN_API_KEY` privada para indexacion en el servidor
- **NO hay duplicacion** de `APPLICATION_ID` ni `INDEX_NAME`

### 2. `src/layouts/base/index.astro`
- Se actualizo el objeto `algolia` para usar `PUBLIC_ALGOLIA_SEARCH_API_KEY` en lugar de `ALGOLIA_ADMIN_API_KEY`
- Se agregan comentarios explicativos sobre el uso de la Search-Only API Key

### 3. `src/layouts/base/components/header/components/use-algolia-search.ts`
- Se actualizo la interfaz `AlgoliaConfig` para usar `ALGOLIA_SEARCH_API_KEY`
- Se modifico la inicializacion del cliente de Algolia para usar la nueva key
- Se agregaron comentarios sobre el uso de read-only key

### 4. `src/scripts/algolia.ts`
- **SE MODIFICO** para leer las variables `PUBLIC_*` compartidas
- Ahora usa `PUBLIC_ALGOLIA_APPLICATION_ID` y `PUBLIC_ALGOLIA_INDEX_NAME`
- Continua usando `ALGOLIA_ADMIN_API_KEY` (privada) para operaciones de escritura
- Solo se ejecuta en server-side (build time)

## Instrucciones para Actualizar tu Archivo .env.local

Para que tu entorno local funcione correctamente, debes actualizar tu archivo `.env.local` con las nuevas variables:

### Paso 1: Obtener la Search-Only API Key de Algolia

1. Ve al dashboard de Algolia: https://dashboard.algolia.com/account/api-keys/all
2. Busca la seccion "Search-Only API Key" (o crea una nueva key con permisos de solo lectura)
3. Copia el valor de esta key

### Paso 2: Actualizar .env.local

Edita tu archivo `.env.local` y actualiza las variables asi:

```bash
# ========================================
# ALGOLIA CONFIGURATION
# ========================================

# Variables compartidas (usadas en cliente y servidor)
PUBLIC_ALGOLIA_APPLICATION_ID=tu_application_id
PUBLIC_ALGOLIA_INDEX_NAME=tu_index_name

# Client-side: Search-Only API Key (solo lectura)
PUBLIC_ALGOLIA_SEARCH_API_KEY=tu_search_only_key_aqui  # La nueva key de solo lectura

# Server-side: Admin API Key (solo para indexacion durante build)
ALGOLIA_ADMIN_API_KEY=tu_admin_key_aqui  # Mantener la admin key para indexacion
```

**Nota importante**: Las variables `PUBLIC_ALGOLIA_APPLICATION_ID` y `PUBLIC_ALGOLIA_INDEX_NAME` se comparten entre cliente y servidor. NO necesitas duplicarlas.

### Paso 3: Verificar que Funciona

1. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Abre DevTools (F12 o Cmd+Option+I)

3. Ve a la pestana "Network" (Red)

4. Realiza una busqueda en tu sitio

5. Busca las peticiones a `algolia.net` o `algolianet.com`

6. Verifica en los headers que solo aparece la `PUBLIC_ALGOLIA_SEARCH_API_KEY` (la Search-Only key)

### Paso 4: Verificar Seguridad

Para confirmar que la seguridad esta funcionando, abre la consola del navegador y ejecuta:

```javascript
// Esto deberia mostrar la Search-Only API Key (es seguro que sea visible)
console.log(import.meta.env.PUBLIC_ALGOLIA_SEARCH_API_KEY);

// Esto deberia ser undefined (no deberia estar disponible en el cliente)
console.log(import.meta.env.ALGOLIA_ADMIN_API_KEY);
```

## Cambios en Vercel (Variables de Entorno)

Si tu sitio esta desplegado en Vercel, debes actualizar las variables de entorno en el dashboard:

1. Ve a tu proyecto en Vercel
2. Ve a Settings > Environment Variables
3. **Elimina las variables antiguas** (si existen):
   - `ALGOLIA_APPLICATION_ID` (sin prefijo PUBLIC_)
   - `ALGOLIA_INDEX_NAME` (sin prefijo PUBLIC_)
4. Agrega/actualiza las nuevas variables:
   - `PUBLIC_ALGOLIA_APPLICATION_ID` - Compartida entre cliente y servidor
   - `PUBLIC_ALGOLIA_INDEX_NAME` - Compartida entre cliente y servidor
   - `PUBLIC_ALGOLIA_SEARCH_API_KEY` - Para busquedas en el cliente (solo lectura)
   - `ALGOLIA_ADMIN_API_KEY` - Para indexacion durante el build (privada)
5. Re-deploya el sitio para que tome las nuevas variables

**Ventaja**: Solo necesitas 4 variables en lugar de 6, eliminando duplicacion.

## Beneficios de Seguridad

Ahora que has migrado:

- El ADMIN API KEY ya NO esta expuesto en el bundle del cliente
- Los usuarios NO pueden modificar el indice de Algolia desde DevTools
- Los usuarios NO pueden eliminar datos del indice
- Los usuarios NO pueden abusar de la cuota de API con operaciones de escritura
- La busqueda sigue funcionando normalmente con la Search-Only API Key

## Validacion Final

Para confirmar que todo esta funcionando correctamente:

1. La busqueda debe funcionar correctamente
2. En DevTools > Network > Headers solo debe aparecer la Search-Only API Key
3. Intenta realizar una operacion de escritura desde el cliente (deberia fallar con error 403)
4. El build debe completarse exitosamente y seguir indexando articulos en Algolia

## Notas Importantes

- Las variables con prefijo `PUBLIC_` en Astro son automaticamente incluidas en el bundle del cliente
- Las variables SIN prefijo `PUBLIC_` solo estan disponibles en server-side (build time, API routes)
- El ADMIN API KEY debe permanecer en variables de entorno privadas para el proceso de indexacion durante el build
- No compartas tu ADMIN API KEY en repositorios publicos o en el codigo del cliente

## Migracion Completada

Status: COMPLETADO
Fecha: 2025-11-11
Prioridad: CRITICA (Seguridad)
