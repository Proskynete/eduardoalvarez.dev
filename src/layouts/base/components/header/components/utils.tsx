interface SearchResult {
  objectID: string;
  title: string;
  slug: string;
  description?: string;
  categories?: string[];
  link?: string;
}

export const getArticleUrl = (result: SearchResult): string => {
  if (result.link) {
    return result.link;
  }
  if (result.slug) {
    return `/articulos/${result.slug}`;
  }
  return "#";
};

export const renderHighlightedText = (text: string, query: string) => {
  if (!query.trim()) return <>{text}</>;

  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={index} className="bg-transparent text-accent font-semibold not-italic">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
};
