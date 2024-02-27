import Giscus from "@giscus/react";

interface GiscusProps {
  slug: string;
}

const GiscusWrapper = ({ slug }: GiscusProps) => {
  return (
    <Giscus
      id="comments"
      repo="proskynete/website"
      repoId="R_kgDOJ_yh4w"
      category="Blog Comments"
      categoryId="DIC_kwDOJ_yh484CcCn6"
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
