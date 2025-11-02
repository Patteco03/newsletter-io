import { AdminSidebar } from "@/components/admin-sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 bg-background">
        <Outlet />
      </main>
    </div>
  );
}
