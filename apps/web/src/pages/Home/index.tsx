import { NewsCard } from "@/components/news-card";
import api from "@/lib/api";
import { formatRelativeTime, truncateText } from "@/lib/utils";
import { useEffect, useState, useRef, useCallback } from "react";
import type { ArticleItem, ArticleResponse } from "./article.interface";

function App() {
  const [news, setNews] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);
  const currentPageRef = useRef(1);
  const limit = 10;

  const fetchNews = useCallback(async (pageNum: number, append = false) => {
    setLoading(true);
    try {
      const response = await api.get<ArticleResponse>("/news/feed", {
        params: {
          page: pageNum,
          limit,
        },
      });
      
      if (append) {
        setNews((prev) => {
          const newNews = [...prev, ...response.data.data];
          const totalLoaded = newNews.length;
          setHasMore(totalLoaded < response.data.meta.total);
          return newNews;
        });
      } else {
        setNews(response.data.data);
        setHasMore(response.data.data.length < response.data.meta.total);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchNews(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (initialLoad || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !initialLoad) {
          const nextPage = currentPageRef.current + 1;
          currentPageRef.current = nextPage;
          fetchNews(nextPage, true);
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, initialLoad, fetchNews]);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6">Últimas Notícias</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((article, index) => (
          <NewsCard
            key={`${article.slug}-${index}`}
            title={article.title}
            excerpt={truncateText(article.content, 100)}
            category={article.category.name}
            date={formatRelativeTime(article.published_at)}
            image={article.cover_image}
            href={`/news/${article.slug}`}
          />
        ))}
      </div>
      
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Carregando mais notícias...</div>
        </div>
      )}
      
      {!hasMore && news.length > 0 && (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Você viu todas as notícias!</div>
        </div>
      )}
      
      <div ref={observerTarget} className="h-4" />
    </div>
  )
}

export default App;
