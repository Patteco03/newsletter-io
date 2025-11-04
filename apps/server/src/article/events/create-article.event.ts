import db from "@newsletter-io/db";
import { SummaryService } from "@newsletter-io/agent";
import { CreateArticleDto } from "../dto/create.article.dto";

export interface CreateArticleEventPayload extends CreateArticleDto {
  slug: string;
  excerpt?: string;
}

export default class CreateArticleEvent {
  constructor( private readonly model: typeof db.article = db.article) {}
  
  public async execute(userId: string, payload: CreateArticleEventPayload): Promise<void> {
    if (!payload.excerpt) {
      const summaryService = new SummaryService();
      const summary = await summaryService.generateSummary(payload.content);
      payload.excerpt = summary;
    }

    await this.model.create({
      data: {
        title: payload.title,
        excerpt: payload.excerpt,
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