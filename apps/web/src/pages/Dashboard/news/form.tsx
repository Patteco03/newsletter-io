import { z } from "zod";
import api from "@/lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { ArticleItem } from "@/pages/Home/article.interface";

import type {
  CategoryItem,
  CategoryResponse,
} from "@/pages/Category/category.interface";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const createArticleFormSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres.").trim(),
  content: z
    .string()
    .min(10, "O conteúdo deve ter pelo menos 10 caracteres.")
    .max(1000, "O conteúdo deve ter no máximo 1000 caracteres."),
  category_id: z.string().min(1, "Categoria é obrigatória"),
  published: z.boolean().default(false),
});

type CreateArticleFormData = z.infer<typeof createArticleFormSchema>;

export default function NewsFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const form = useForm<CreateArticleFormData>({
    defaultValues: {
      title: "",
      content: "",
      category_id: "",
      published: false,
    },
    resolver: zodResolver(createArticleFormSchema),
  });

  useEffect(() => {
    if (id) {
      setLoading(true);
      const getNews = async () => {
        try {
          const response = await api.get<ArticleItem>(`/news/${id}`);
          form.setValue("title", response.data.title);
          form.setValue("content", response.data.content);
          form.setValue("category_id", response.data.category.id);
          form.setValue("published", response.data.published);
        } catch (error) {
          console.error("Error fetching news:", error);
        } finally {
          setLoading(false);
        }
      };
      getNews();
    }
  }, [form, id]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get<CategoryResponse>("/categories");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const onSubmit = async (data: CreateArticleFormData) => {
    setLoading(true);
    try {
      if (id) {
        await api.put(`/news/${id}`, data);
        toast.success("Notícia atualizada com sucesso!");
      } else {
        await api.post("/news", data);
        toast.success("Notícia criada com sucesso!");
      }

      setTimeout(() => navigate("/dashboard/news"), 1000);
    } catch (error) {
      console.error("Error creating news:", error);

      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || "Ocorreu um erro");
        return;
      }

      toast.error("Ocorreu um erro ao tentar executar a operação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard/news"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para notícias
          </Link>

          <h1 className="text-3xl font-bold">Criar Nova Notícia</h1>
          <p className="text-muted-foreground mt-2">
            Preencha os dados abaixo para criar uma nova notícia
          </p>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Notícia</CardTitle>
            <CardDescription>
              Todos os campos com asterisco são obrigatórios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o título da notícia"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category and Published Status */}
                <div className="flex flex-col md:flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="w-full border rounded-md p-2 bg-background text-foreground"
                          >
                            <option value="">Selecione uma categoria</option>
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="published"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <FormControl>
                          <select
                            value={field.value ? "published" : "draft"}
                            onChange={(e) =>
                              field.onChange(e.target.value === "published")
                            }
                            className="w-full border rounded-md p-2 bg-background text-foreground"
                          >
                            <option value="draft">Rascunho</option>
                            <option value="published">Publicado</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Excerpt */}

                {/* Content */}
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conteúdo</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Digite o conteúdo da notícia..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Buttons */}
                <div className="flex gap-3 justify-end">
                  <Link to="/dashboard/news">
                    <Button variant="outline" disabled={loading}>
                      Cancelar
                    </Button>
                  </Link>
                  <Button type="submit" disabled={loading}>
                    {id ? "Atualizar" : "Criar Notícia"}{" "}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
