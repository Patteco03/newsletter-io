export const userRole = {
  READER: "READER",
  AUTHOR: "AUTHOR",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
} as const;

export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: keyof typeof userRole;
  created_at: string;
  updated_at: string;
}

export interface UserResponse {
  data: UserItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}
