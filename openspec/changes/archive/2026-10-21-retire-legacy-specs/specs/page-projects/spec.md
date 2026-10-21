## REMOVED Requirements

### Requirement: Projects page

**Reason**: La página `/projects` se retiró y su contenido no estaba al día.

**Migration**: `/projects` redirige a `/about` (301, `vercel.json`). `src/settings/projects.ts` queda sin importar.

### Requirement: Project card component

**Reason**: Se retiró junto con la página `/projects`.

**Migration**: Ninguna.

### Requirement: Project filtering by status

**Reason**: Se retiró junto con la página `/projects`.

**Migration**: Ninguna.
