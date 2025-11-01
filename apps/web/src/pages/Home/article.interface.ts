export interface ArticleItem {
  title: string;
  slug: string;
  content: string;
  cover_image: string | null;
  published: boolean;
  published_at: string;
  category: { id: string; name: string };
  created_at: string;
  updated_at: string;
}

export interface ArticleResponse {
  data: ArticleItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}
