## 1. Decisión

- [x] 1.1 `isEurope()` por zona horaria, con Europa como valor seguro si no se puede leer
- [x] 1.2 `cookie-consent` como JSON v2; migración de `granted` / `denied`; región por defecto sin persistir
- [x] 1.3 `getConsent`, `setConsent`, `onConsentChange`, `openCookiePreferences`
- [x] 1.4 GA carga o se apaga (con `ga-disable` y borrado de `_ga*`) según la decisión
- [x] 1.5 El tema no se recuerda sin consentimiento para «Preferencias»

## 2. Interfaz

- [x] 2.1 Aviso de primera visita según la región, sin bloquear el scroll
- [x] 2.2 Panel con Dialog, Switch, Accordion y Table de arrecife; foco atrapado y devuelto, Esc cierra
- [x] 2.3 «./cookies» en el pie abre el panel

## 3. Inventario y analítica sin cookies

- [x] 3.1 `src/settings/cookies.ts` con cada cookie y clave de almacenamiento
- [x] 3.2 Vercel Web Analytics con `@vercel/analytics/astro`

## 4. Cierre

- [x] 4.1 Tests de la tienda (migración, región, persistir solo al actuar) y del panel
- [x] 4.2 Lint, unitarios y build con y sin `PUBLIC_GA_ID`; verificación en navegador con zona horaria de Europa y de América
