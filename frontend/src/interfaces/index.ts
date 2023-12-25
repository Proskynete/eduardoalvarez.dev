export interface Post {
  title: string;
  description: string;
  publishedAt: string;
  category: string;
  body: string;
  slug: {
    current: string;
  };
}
