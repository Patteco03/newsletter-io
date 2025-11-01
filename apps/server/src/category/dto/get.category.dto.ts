import { PaginationDto } from "@/interfaces/pagination";

export interface GetCategoryDto {
  id: string;
  name: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface ListCategoryInput {
  page: number
  limit: number
}

export interface ListCategoriesDto extends PaginationDto<GetCategoryDto> {}
