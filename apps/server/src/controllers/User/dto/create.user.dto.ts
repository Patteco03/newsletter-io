export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
  role?: "READER" | "ADMIN" | "EDITOR" | "AUTHOR";
}
