import { Outlet } from "react-router-dom"

export default function DashboardLayout() {
  return (
    <div className="min-h-screen">
      <Outlet />

      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 Notícias. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
