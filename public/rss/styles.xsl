<?xml version="1.0" encoding="utf-8"?>
<!--
  What a person sees when they open /rss.xml in a browser. Static file, so the
  colours are written out: they are arrecife's dark palette (abismo, fosa,
  espuma, bruma, plancton, bioluz, hairline), the same way browserconfig.xml
  carries the tile colour.
-->
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="es">
      <head>
        <title><xsl:value-of select="/rss/channel/title"/> · feed RSS</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="robots" content="noindex"/>
        <style type="text/css">
          body { margin: 0; background: #091319; color: #EDF4F3; font: 16px/1.7 system-ui, -apple-system, "Segoe UI", sans-serif; }
          main { max-width: 760px; margin: 0 auto; padding: 48px 16px 64px; }
          .aviso { background: #10202B; border: 1px solid #1E3441; border-radius: 14px; padding: 16px 20px; color: #A7BCC4; font-size: 15px; }
          .aviso strong { color: #EDF4F3; }
          h1 { font-size: 36px; line-height: 1.1; margin: 32px 0 8px; }
          .bajada { color: #A7BCC4; margin: 0 0 16px; }
          h2 { font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; color: #71919C; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; margin: 40px 0 8px; }
          a { color: #35D6C0; text-decoration: none; }
          a:hover { text-decoration: underline; }
          .item { border-top: 1px solid #1E3441; padding: 20px 0; }
          .item h3 { font-size: 20px; line-height: 1.3; margin: 0 0 6px; }
          .item p { margin: 0 0 6px; color: #A7BCC4; font-size: 15px; }
          .fecha { color: #71919C; font-size: 13px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
        </style>
      </head>
      <body>
        <main>
          <p class="aviso">
            <strong>Esto es un feed RSS.</strong> Copia la dirección de esta página en tu lector de RSS para recibir
            cada artículo nuevo.
          </p>
          <h1><xsl:value-of select="/rss/channel/title"/></h1>
          <p class="bajada"><xsl:value-of select="/rss/channel/description"/></p>
          <a>
            <xsl:attribute name="href"><xsl:value-of select="/rss/channel/link"/></xsl:attribute>
            ./ir_al_sitio →
          </a>
          <h2>Últimos artículos</h2>
          <xsl:for-each select="/rss/channel/item">
            <div class="item">
              <h3>
                <a>
                  <xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>
                  <xsl:value-of select="title"/>
                </a>
              </h3>
              <p><xsl:value-of select="description"/></p>
              <span class="fecha"><xsl:value-of select="pubDate"/></span>
            </div>
          </xsl:for-each>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
