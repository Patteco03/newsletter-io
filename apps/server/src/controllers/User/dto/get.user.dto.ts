export interface GetUserDto {
  id: string;
  email: string;
  name: string;
  role: "READER" | "ADMIN" | "EDITOR" | "AUTHOR";
  created_at: Date;
  updated_at: Date;
}
