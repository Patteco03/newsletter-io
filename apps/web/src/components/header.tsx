import { Button } from "@/components/ui/button"
import { Menu, User } from "lucide-react"
import { Link } from "react-router-dom"

export function Header() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <Link to="/" className="text-2xl font-bold tracking-tight">
              Notícias
            </Link  >
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
                Início
              </Link>
              <Link to="" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Política
              </Link>
              <Link to="" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Economia
              </Link>
              <Link to="" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Tecnologia
              </Link>
              <Link to="" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Esportes
              </Link>
            </nav>
          </div>
          <Link to="/login">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Entrar</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
