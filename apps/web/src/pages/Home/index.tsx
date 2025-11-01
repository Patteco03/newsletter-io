import { NewsCard } from "@/components/news-card";
import api from "@/lib/api";
import { formatRelativeTime, truncateText } from "@/lib/utils";
import { useEffect, useState } from "react";
import type { ArticleItem, ArticleResponse } from "./article.interface";

function App() {
  const [news, setNews] = useState<ArticleItem[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get<ArticleResponse>("/news/feed");
        setNews(response.data.data);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);


  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6">Últimas Notícias</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((article, index) => (
          <NewsCard
            key={index}
            title={article.title}
            excerpt={truncateText(article.content, 100)}
            category={article.category.name}
            date={formatRelativeTime(article.published_at)}
            image={article.cover_image}
            href={`/news/${article.slug}`}
          />
        ))}
      </div>
    </div>
  )
}

export default App;
