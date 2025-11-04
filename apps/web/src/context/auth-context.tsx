import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api";

interface LoginResponse {
  token: string;
  type: string;
  expires_in: number;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: "READER" | "AUTHOR" | "EDITOR" | "ADMIN";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post<LoginResponse>('/users/login', { email, password });
      const user = response.data;
      localStorage.setItem("token", user.token);

      const responseMe = await api.get('/users/me');
      const me = responseMe.data;
      localStorage.setItem("user", JSON.stringify(me));
      setUser(me);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
