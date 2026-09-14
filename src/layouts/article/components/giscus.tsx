import { Alert, Text } from "@eduardoalvarez/arrecife";
import Giscus from "@giscus/react";
import { useEffect, useState } from "react";

interface GiscusProps {
  slug: string;
}

const GiscusWrapper = ({ slug }: GiscusProps) => {
  // El tema del widget debe seguir al del sitio: con `transparent_dark` fijo,
  // los comentarios quedaban en texto claro sobre papel al pasar a modo claro.
  const [tema, setTema] = useState<"transparent_dark" | "light">("transparent_dark");

  useEffect(() => {
    const leer = () =>
      setTema(document.documentElement.getAttribute("data-theme") === "light" ? "light" : "transparent_dark");
    leer();
    const observador = new MutationObserver(leer);
    observador.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observador.disconnect();
  }, []);

  const giscusRepo = import.meta.env.PUBLIC_GISCUS_REPO;
  const giscusRepoId = import.meta.env.PUBLIC_GISCUS_REPO_ID;
  const giscusCategoryId = import.meta.env.PUBLIC_GISCUS_CATEGORY_ID;

  // Validar que todas las variables de entorno estén configuradas
  const isMissingConfig = !giscusRepo || !giscusRepoId || !giscusCategoryId;

  if (isMissingConfig) {
    return (
      /* `Alert variant="warning"` en vez de una caja dibujada a mano: falta
         configuración, que es exactamente lo que la variante nombra. Trae el
         glifo, el rol ARIA y el tinte sobre el borde, no sobre el texto. */
      <Alert variant="warning" title="Comentarios no disponibles">
        <Text variant="label" tone="secondary" as="p" className="font-normal">
          La configuración de Giscus no está completa. Variables de entorno faltantes:
        </Text>
        <ul className="mt-step-xs gap-step-xs flex flex-col">
          {!giscusRepo && (
            <Text variant="meta" tone="secondary" as="li">
              PUBLIC_GISCUS_REPO
            </Text>
          )}
          {!giscusRepoId && (
            <Text variant="meta" tone="secondary" as="li">
              PUBLIC_GISCUS_REPO_ID
            </Text>
          )}
          {!giscusCategoryId && (
            <Text variant="meta" tone="secondary" as="li">
              PUBLIC_GISCUS_CATEGORY_ID
            </Text>
          )}
        </ul>
      </Alert>
    );
  }

  return (
    <Giscus
      id="comments"
      repo={giscusRepo as `${string}/${string}`}
      repoId={giscusRepoId}
      category="Blog Comments"
      categoryId={giscusCategoryId}
      mapping="specific"
      term={`blog/${slug}`}
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme={tema}
      lang="es"
      loading="lazy"
    />
  );
};

export { GiscusWrapper };
