import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { LogOut, Users, FileText } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export function AdminSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold">Painel Admin</h1>
        <p className="text-sm text-slate-400 mt-2">Bem-vindo, {user?.name}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="/dashboard/news"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <FileText className="h-5 w-5" />
              <span>Notícias</span>
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/users"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <Users className="h-5 w-5" />
              <span>Usuários</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-700">
        <Button
          variant="destructive"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </aside>
  );
}
