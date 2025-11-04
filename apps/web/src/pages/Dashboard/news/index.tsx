import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Plus, Edit, Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import type { NewsItem, NewsResponse } from "./news-manager.interface";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NewsManagementPage() {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNews = async (pageNum: number = page, limitNum: number = limit) => {
    setLoading(true);
    try {
      const response = await api.get<NewsResponse>("/news", {
        params: {
          page: pageNum,
          limit: limitNum,
        },
      });
      setNews(response.data.data);
      setTotal(response.data.meta.total);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(page, limit);
  }, [page, limit]);

  const totalPages = Math.ceil(total / limit);
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/news/${id}`);
      toast.success("Notícia excluída com sucesso!");

      setDeleteId(null);
      
      // Se deletar o último item da página e não for a primeira página, volta uma página
      if (news.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        await fetchNews(page, limit);
      }
    } catch (error) {
      console.error("Error deleting news:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o site
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Gerenciar Notícias</h1>
              <p className="text-muted-foreground mt-2">
                Crie, edite ou delete suas notícias
              </p>
            </div>
            <Link to="/dashboard/news/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Notícia
              </Button>
            </Link>
          </div>
        </div>

        {/* Table Card */}
        <Card>
          <CardHeader>
            <CardTitle>Todas as Notícias</CardTitle>
            <CardDescription>
              Mostrando {startItem} a {endItem} de {total} notícias
            </CardDescription>
          </CardHeader>
          <CardContent>
            {total === 0 && !loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  Nenhuma notícia criada ainda
                </p>
                <Link to="/dashboard/news/create">
                  <Button>Criar primeira notícia</Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead className="text-right">
                          Visualizações
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <div className="text-muted-foreground">Carregando...</div>
                          </TableCell>
                        </TableRow>
                      ) : news.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <div className="text-muted-foreground">Nenhuma notícia encontrada</div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        news.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium max-w-xs truncate">
                              {item.title}
                            </TableCell>
                            <TableCell>{item.category.name}</TableCell>
                            <TableCell>
                              {new Date(item.created_at).toLocaleDateString(
                                "pt-BR"
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <span className="inline-flex items-center gap-1 text-sm">
                                <Eye className="h-4 w-4" />0
                              </span>
                            </TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  item.published
                                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                                }`}
                              >
                                {item.published ? "Publicada" : "Rascunho"}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Link to={`/dashboard/news/${item.id}/edit`}>
                                  <Button variant="ghost" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setDeleteId(item.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Pagination Controls */}
                {total > 0 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Itens por página:</span>
                      <Select
                        value={limit.toString()}
                        onValueChange={(value) => {
                          setLimit(Number(value));
                          setPage(1);
                        }}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Página {page} de {totalPages}
                      </span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                          disabled={page === 1 || loading}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                          disabled={page === totalPages || loading}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja deletar esta notícia? Esta ação não
              pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Deletar
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
