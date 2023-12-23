type Title = "Desarrollo web" | "JavaScript";

export interface SanityCategory {
  _updatedAt: string;
  _createdAt: string;
  _rev: string;
  _type: string;
  _id: string;
  title: Title;
}

export interface Category {
  _ref: string;
  _type: string;
  _key: string;
}

export interface Post {
  title: string;
  description: string;
  publishedAt: string;
  categories: Category[];
  slug: {
    current: string;
  };
}
