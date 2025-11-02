export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  cover_image: string | null;
  published: boolean;
  published_at: string | null;
  category: { id: string; name: string };
  created_at: string;
  updated_at: string;
}

export interface NewsResponse {
  data: NewsItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}
