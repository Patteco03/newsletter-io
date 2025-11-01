import { PaginationDto } from "@/interfaces/pagination";

export interface GetArticleDto {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  content?: string;
  cover_image?: string | null;
  published_at?: Date | null;
  category: { id: string; name: string };
  created_at: Date;
  updated_at: Date;
}

interface ListArticles {
  period?: "day" | "week" | "month";
  page: number;
  limit: number;
}

export interface ListArticlesInput extends ListArticles {}

export interface ListArticlesFeedInput extends ListArticles {}

export interface ListArticlesDto extends PaginationDto<GetArticleDto> {}
