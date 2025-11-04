import db from "@newsletter-io/db";
import { CreateArticleDto } from "../dto/create.article.dto";

export interface CreateArticleEventPayload extends CreateArticleDto {
  slug: string;
}

export default class CreateArticleEvent {
  constructor( private readonly model: typeof db.article = db.article) {}
  
  public async execute(userId: string, payload: CreateArticleEventPayload): Promise<void> {
    await this.model.create({
      data: {
        title: payload.title,
        slug: payload.slug,
        content: payload.content,
        authorId: userId,
        categoryId: payload.category_id,
        coverImage: payload.cover_image,
        published: payload.published,
        ...(payload.published && {
          publishedAt: new Date(),
        }),
      },
    });
  }
}