## ADDED Requirements

### Requirement: El perfil lleva el fragmento de la búsqueda de la terminal

El payload de `/api/profile.json` SHALL incluir el campo `tiburoncin` con el quinto de los seis fragmentos de la búsqueda final de terminal.eduardoalvarez.dev. Agregarlo SHALL NO cambiar `version`.

#### Scenario: Leer el perfil
- **WHEN** se pide `/api/profile.json`
- **THEN** el cuerpo SHALL contener `tiburoncin` con un texto que empieza por `🦈 5/6`
- **THEN** `version` SHALL seguir siendo `1`
