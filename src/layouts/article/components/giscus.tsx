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
      <div className="rounded-lg border border-yellow-600 bg-yellow-50 p-6 dark:border-yellow-500 dark:bg-yellow-900/20">
        <h3 className="mb-2 text-lg font-semibold text-yellow-800 dark:text-yellow-200">
          Comentarios no disponibles
        </h3>
        <p className="text-sm text-yellow-700 dark:text-yellow-300">
          La configuración de Giscus no está completa. Por favor, verifica que las siguientes variables de entorno
          estén configuradas:
        </p>
        <ul className="mt-2 list-inside list-disc text-sm text-yellow-700 dark:text-yellow-300">
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
      repo={giscusRepo}
      repoId={giscusRepoId}
      category="Blog Comments"
      categoryId={giscusCategoryId}
      mapping="specific"
      term={`blog/${slug}`}
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme="dark"
      lang="es"
      loading="lazy"
    />
  );
};

export { GiscusWrapper };
