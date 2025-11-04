import db from "@newsletter-io/db";
import { subDays, subWeeks, subMonths } from "date-fns";
import { queue } from "@/queue";

import { NotFoundException } from "@/exceptions/NotFoundException";
import CategoryService from "../category/category.service";
import { CreateArticleDto } from "./dto/create.article.dto";
import {
  GetArticleDetailsDto,
  ListArticlesDto,
  ListArticlesFeedInput,
  ListArticlesInput,
} from "./dto/get.article.dto";
import { BadRequestException } from "@/exceptions/BadRequestException";

export default class UserService {
  constructor(
    private readonly model: typeof db.article = db.article,
    private readonly categoryService = new CategoryService()
  ) { }

  public async getOne(id: string): Promise<GetArticleDetailsDto> {
    const article = await this.model.findUnique({
      where: { id },
      include: { category: true, author: true },
    });

    if (!article) {
      throw new NotFoundException("Article not found");
    }

    return {
      id: article.id,
      title: article.title,
      slug: article.slug,
      content: article.content,
      cover_image: article.coverImage ?? null,
      published: article.published,
      category: {
        id: article.category.id,
        name: article.category.name,
      },
      author: {
        id: article.author.id,
        name: article.author.name,
      },
      published_at: article.publishedAt,
      created_at: article.createdAt,
      updated_at: article.updatedAt,
    };
  }

  public async getFeed({
    page,
    limit,
    period,
  }: ListArticlesFeedInput): Promise<ListArticlesDto> {
    const skip = (page - 1) * limit;

    const where = {
      published: true,
      ...(period && { publishedAt: this.getDateRange(period) }),
    };

    const [data, total] = await Promise.all([
      this.model.findMany({
        skip,
        take: limit,
        orderBy: { publishedAt: "desc" },
        where,
        include: { category: true },
      }),
      this.model.count({ where }),
    ]);

    return {
      data: data.map((article) => ({
        id: article.id,
        title: article.title,
        slug: article.slug,
        content: article.content,
        cover_image: article.coverImage ?? null,
        published: article.published,
        category: {
          id: article.category.id,
          name: article.category.name,
        },
        published_at: article.publishedAt,
        created_at: article.createdAt,
        updated_at: article.updatedAt,
      })),
      meta: {
        page,
        limit,
        total,
      },
    };
  }

  public async getArticlesByUser(
    userId: string,
    { page, limit }: ListArticlesInput
  ): Promise<ListArticlesDto> {
    const skip = (page - 1) * limit;

    const where = { authorId: userId };
    const [data, total] = await Promise.all([
      this.model.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        where,
        include: { category: true },
      }),
      this.model.count({ where }),
    ]);

    return {
      data: data.map((article) => ({
        id: article.id,
        title: article.title,
        slug: article.slug,
        content: article.content,
        cover_image: article.coverImage ?? null,
        published: article.published,
        category: {
          id: article.category.id,
          name: article.category.name,
        },
        published_at: article.publishedAt ?? null,
        created_at: article.createdAt,
        updated_at: article.updatedAt,
      })),
      meta: {
        page,
        limit,
        total,
      },
    };
  }

  public async create(
    userId: string,
    input: CreateArticleDto
  ): Promise<void> {
    const checkCategory = await this.categoryService.findOne(input.category_id);

    if (!checkCategory) {
      throw new NotFoundException("Category not found");
    }

    const slug = this.generateSlug(input.title);
    const existSlug = await this.model.findUnique({ where: { slug } });

    if (existSlug) {
      throw new BadRequestException(
        `The slug defined by the title ${input.title} already exists.`
      );
    }

    await queue.publish("article.create.queue", { userId, payload: { ...input, slug } });
  }

  public async update(
    id: string,
    input: Partial<CreateArticleDto>
  ): Promise<void> {
    const article = await this.model.findUnique({ where: { id } });
    if (!article) {
      throw new NotFoundException("Article not found");
    }

    if (input.category_id && input.category_id !== article.categoryId) {
      await this.categoryService.findOne(input.category_id);
    }

    if (input.title && input.title !== article.title) {
      Object.assign(input, { slug: this.generateSlug(input.title) });
    }

    await queue.publish("article.update.queue", { id, payload: input });
  }

  public async delete(id: string): Promise<void> {
    const article = await this.model.findUnique({ where: { id } });
    if (!article) {
      throw new NotFoundException("Article not found");
    }

    await this.model.softDelete({ id });
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  private getDateRange(period: "day" | "week" | "month") {
    const now = new Date();

    switch (period) {
      case "day":
        return { gte: subDays(now, 1) };
      case "week":
        return { gte: subWeeks(now, 1) };
      case "month":
        return { gte: subMonths(now, 1) };
    }
  }
}
