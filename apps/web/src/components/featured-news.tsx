
import { Card, CardContent } from "@/components/ui/card"
import { Clock, ArrowRight } from "lucide-react"

export function FeaturedNews() {
  return (
    <Card className="overflow-hidden border-0 bg-linear-to-br from-primary/5 to-primary/10">
      <CardContent className="p-0">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="aspect-4/3 relative overflow-hidden bg-muted">
            <img src="/breaking-news-journalism.jpg" alt="Notícia em destaque" className="object-cover w-full h-full" />
          </div>
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-medium text-primary uppercase tracking-wide">Destaque</span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Há 2 horas</span>
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance leading-tight">
              Governo anuncia novo pacote de investimentos em infraestrutura
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Medidas incluem R$ 150 bilhões para modernização de rodovias, ferrovias e portos nos próximos cinco anos,
              com foco em sustentabilidade e desenvolvimento regional.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all"
            >
              Ler matéria completa
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
