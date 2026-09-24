## ADDED Requirements

### Requirement: La sección se apaga entera con una sola llave

`podcastsEnabled` SHALL gobernar la existencia pública de la sección. Con la llave apagada, la sección SHALL ser inalcanzable por cualquier vía, no sólo desde la navegación.

#### Scenario: El listado redirige a la home
- **WHEN** `podcastsEnabled` es `false` y se pide `/podcasts`
- **THEN** la respuesta SHALL ser un 302 con `Location: /`

#### Scenario: Ningún episodio existe
- **WHEN** `podcastsEnabled` es `false` y se pide `/podcasts/{cualquier-slug}`
- **THEN** la respuesta SHALL ser un 302 con `Location: /`
- **THEN** el build SHALL NO emitir ninguna página de episodio

#### Scenario: El sitemap no anuncia una puerta cerrada
- **WHEN** `podcastsEnabled` es `false`
- **THEN** el sitemap SHALL NO contener ninguna URL bajo `/podcasts`

#### Scenario: Encender la llave devuelve la sección entera
- **WHEN** `podcastsEnabled` pasa a `true`
- **THEN** el índice, las páginas de episodio y el enlace de navegación SHALL volver sin más cambios que la llave; restituir `prerender = true` en el índice y en el episodio es una optimización, no un requisito
