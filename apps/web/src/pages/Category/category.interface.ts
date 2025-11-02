export interface CategoryItem {
  id: string;
  name: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CategoryResponse {
  data: CategoryItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}
