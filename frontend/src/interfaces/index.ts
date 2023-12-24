export interface Post {
  title: string;
  description: string;
  publishedAt: string;
  category: string;
  slug: {
    current: string;
  };
}
