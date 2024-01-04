import Giscus from "@giscus/react";
import { useEffect, useState } from "react";

interface GiscusProps {
  slug: string;
}

const GiscusWrapper = ({ slug }: GiscusProps) => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") {
          setDarkMode(
            (mutation.target as HTMLElement).classList.contains("dark")
          );
        }
      });
    });
    observer.observe(document.documentElement, {
      attributes: true,
    });
  }, [darkMode]);

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
      theme={darkMode ? "dark" : "light"}
      lang="es"
      loading="lazy"
    />
  );
};

export { GiscusWrapper };
