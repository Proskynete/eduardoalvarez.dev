import Giscus from "@giscus/react";

interface GiscusProps {
  slug: string;
}

const GiscusWrapper = ({ slug }: GiscusProps) => {
  const giscusRepo = import.meta.env.PUBLIC_GISCUS_REPO;
  const giscusRepoId = import.meta.env.PUBLIC_GISCUS_REPO_ID;
  const giscusCategoryId = import.meta.env.PUBLIC_GISCUS_CATEGORY_ID;

  // Validar que todas las variables de entorno estén configuradas
  const isMissingConfig = !giscusRepo || !giscusRepoId || !giscusCategoryId;

  if (isMissingConfig) {
    return (
      <div className="rounded border border-surface-border bg-surface p-6">
        <h3 className="mb-2 text-sm font-medium text-text-secondary">Comentarios no disponibles</h3>
        <p className="text-sm text-text-muted">
          La configuración de Giscus no está completa. Variables de entorno faltantes:
        </p>
        <ul className="mt-2 list-inside list-disc text-sm text-text-muted">
          {!giscusRepo && <li>PUBLIC_GISCUS_REPO</li>}
          {!giscusRepoId && <li>PUBLIC_GISCUS_REPO_ID</li>}
          {!giscusCategoryId && <li>PUBLIC_GISCUS_CATEGORY_ID</li>}
        </ul>
      </div>
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
      theme="transparent_dark"
      lang="es"
      loading="lazy"
    />
  );
};

export { GiscusWrapper };
