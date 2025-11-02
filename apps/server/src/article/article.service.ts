import db from "@newsletter-io/db";
import { subDays, subWeeks, subMonths } from "date-fns";

import { NotFoundException } from "@/exceptions/NotFoundException";
import CategoryService from "../category/category.service";
import { CreateArticleDto } from "./dto/create.article.dto";
import {
  GetArticleDetailsDto,
  GetArticleDto,
  ListArticlesDto,
  ListArticlesFeedInput,
  ListArticlesInput,
} from "./dto/get.article.dto";
import { BadRequestException } from "@/exceptions/BadRequestException";

export default class UserService {
  constructor(
    private readonly model: typeof db.article = db.article,
    private readonly categoryService = new CategoryService()
  ) {}

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
  ): Promise<GetArticleDto> {
    const category = await this.categoryService.findOne(input.category_id);

    const slug = this.generateSlug(input.title);
    const existSlug = await this.model.findUnique({ where: { slug } });

    if (existSlug) {
      throw new BadRequestException(
        `The slug defined by the title ${input.title} already exists.`
      );
    }

    const article = await this.model.create({
      data: {
        title: input.title,
        slug,
        content: input.content,
        authorId: userId,
        categoryId: category.id,
        coverImage: input.cover_image,
        published: input.published,
        ...(input.published && {
          publishedAt: new Date(),
        }),
      },
    });

    return {
      id: article.id,
      title: article.title,
      slug: article.slug,
      content: article.content,
      cover_image: article.coverImage ?? null,
      published: article.published,
      category: {
        id: category.id,
        name: category.name,
      },
      published_at: article.publishedAt ?? null,
      created_at: article.createdAt,
      updated_at: article.updatedAt,
    };
  }

  public async update(
    id: string,
    input: Partial<CreateArticleDto>
  ): Promise<GetArticleDto> {
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

    const { category_id, ...rest } = input;

    const updated = await this.model.update({
      data: {
        ...rest,
        ...(rest.published && {
          publishedAt: new Date(),
        }),
        ...(category_id && {
          categoryId: category_id,
        }),
      },
      where: { id },
      include: { category: true },
    });

    return {
      id: updated.id,
      title: updated.title,
      slug: updated.slug,
      content: updated.content,
      cover_image: updated.coverImage ?? null,
      published: updated.published,
      category: {
        id: updated.category.id,
        name: updated.category.name,
      },
      published_at: updated.publishedAt ?? null,
      created_at: updated.createdAt,
      updated_at: updated.updatedAt,
    };
  }

  public async delete(id: string): Promise<void> {
    const article = await this.model.findUnique({ where: { id } });
    if (!article) {
      throw new NotFoundException("Article not found");
    }

    await this.model.delete({ where: { id } });
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
