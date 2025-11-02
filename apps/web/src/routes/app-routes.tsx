import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "../components/protected-router";

import PublicLayout from "../layouts/public-layout";
import DashboardLayout from "../layouts/dashboard-layout";

import Home from "@/pages/Home";
import Login from "@/pages/Login";
import NewsDetail from "@/pages/NewsDetail";
import NotFound from "@/pages/NotFound";
import UsersManagementPage from "@/pages/Dashboard/users";
import NewsManagementPage from "@/pages/Dashboard/news";
import NewsFormPage from "@/pages/Dashboard/news/form";

export function AppRoutes() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/news/:slug" element={<NewsDetail />} />
      </Route>

      {/* Rotas protegidas (Dashboard) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route
            path="/dashboard"
            element={<Navigate to="/dashboard/news" replace />}
          />
          <Route path="/dashboard/users" element={<UsersManagementPage />} />
          <Route path="/dashboard/news" element={<NewsManagementPage />} />
          <Route path="/dashboard/news/create" element={<NewsFormPage />} />
          <Route path="/dashboard/news/:id/edit" element={<NewsFormPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
