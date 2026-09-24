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
    // The missing variable names go to the console for whoever deploys; the
    // visitor only needs to know the comments are not there right now.
    console.warn("Giscus is not configured:", {
      PUBLIC_GISCUS_REPO: Boolean(giscusRepo),
      PUBLIC_GISCUS_REPO_ID: Boolean(giscusRepoId),
      PUBLIC_GISCUS_CATEGORY_ID: Boolean(giscusCategoryId),
    });
    return (
      <Alert variant="warning" title="Comentarios no disponibles">
        <Text variant="meta" tone="secondary" as="p">
          Los comentarios no están disponibles por ahora. Vuelve a intentarlo más tarde.
        </Text>
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
