import { Header } from "@/components/header";
import { NewsCard } from "@/components/news-card";


const newsArticles = [
  {
    title: "Mercado financeiro revisa projeções para inflação em 2025",
    excerpt: "Analistas apontam cenário mais otimista com expectativa de queda nas taxas de juros no segundo semestre.",
    category: "Economia",
    date: "Há 3 horas",
    image: "/financial-market-economy.jpg",
    href: "#",
  },
  {
    title: "Nova tecnologia promete revolucionar energia solar no Brasil",
    excerpt: "Startup brasileira desenvolve painéis solares 40% mais eficientes e com custo reduzido de produção.",
    category: "Tecnologia",
    date: "Há 5 horas",
    image: "/solar-panel-technology.png",
    href: "#",
  },
  {
    title: "Seleção brasileira convoca novos talentos para amistosos",
    excerpt: "Técnico anuncia lista com surpresas e aposta em renovação para próximos desafios internacionais.",
    category: "Esportes",
    date: "Há 6 horas",
    image: "/soccer-football-stadium.jpg",
    href: "#",
  },
  {
    title: "Congresso aprova reforma tributária em segundo turno",
    excerpt: "Texto segue para sanção presidencial após amplo debate e negociações entre governo e oposição.",
    category: "Política",
    date: "Há 8 horas",
    image: "/congress-politics-government.jpg",
    href: "#",
  },
  {
    title: "Startups brasileiras captam recorde de investimentos",
    excerpt: "Setor de tecnologia atrai R$ 12 bilhões no primeiro trimestre, superando expectativas do mercado.",
    category: "Economia",
    date: "Há 10 horas",
    image: "/startup-business-technology.jpg",
    href: "#",
  },
  {
    title: "Descoberta arqueológica revela nova civilização antiga",
    excerpt: "Pesquisadores encontram vestígios de sociedade desconhecida na região amazônica com mais de 3 mil anos.",
    category: "Ciência",
    date: "Há 12 horas",
    image: "/archaeology-ancient-civilization.jpg",
    href: "#",
  },
]

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Últimas Notícias</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsArticles.map((article, index) => (
              <NewsCard key={index} {...article} />
            ))}
          </div>
        </div>
      </main>

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

export default App;
