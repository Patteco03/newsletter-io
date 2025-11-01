import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "../components/protected-router";

import PublicLayout from "../layouts/public-layout";
import DashboardLayout from "../layouts/dashboard-layout";

import Home from "../pages/Home";
import Login from "../pages/Login";
import NewsDetail from "../pages/NewsDetail";

export function AppRoutes() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/login" element={<Login />} />
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/news/:slug" element={<NewsDetail />} />
        <Route path="*" element={<div>Not Found</div>} />
      </Route>

      {/* Rotas protegidas (Dashboard) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<div>Dashboard Home</div>} />
          <Route path="/dashboard/users" element={<div>Gerenciar Usuários</div>} />
        </Route>
      </Route>
    </Routes>
  );
}
