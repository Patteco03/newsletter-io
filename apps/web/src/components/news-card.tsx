import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"
import { Link } from "react-router-dom"

interface NewsCardProps {
  title: string
  excerpt: string
  category: string
  date: string
  image: string
  href: string
}

export function NewsCard({ title, excerpt, category, date, image, href }: NewsCardProps) {
  return (
    <Link to={href}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
        <div className="aspect-video relative overflow-hidden bg-muted">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-medium text-primary uppercase tracking-wide">{category}</span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{date}</span>
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2 line-clamp-2 text-balance leading-snug">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{excerpt}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
