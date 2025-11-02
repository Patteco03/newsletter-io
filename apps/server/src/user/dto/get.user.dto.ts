import { PaginationDto } from "@/interfaces/pagination";

export const userRole ={
  ADMIN: "ADMIN",
  EDITOR: "EDITOR",
  AUTHOR: "AUTHOR",
  READER: "READER"
} as const

export interface GetUserDto {
  id: string;
  email: string;
  name: string;
  role: keyof typeof userRole;
  created_at: Date;
  updated_at: Date;
}

export interface ListUsersInput {
  page: number
  limit: number
}

export interface ListUsersDto extends PaginationDto<GetUserDto> {}
