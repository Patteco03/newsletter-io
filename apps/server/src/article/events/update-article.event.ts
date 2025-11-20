import dbImport from "@newsletter-io/db";
import { SummaryService } from "@newsletter-io/agent";
import { CreateArticleEventPayload } from "./create-article.event";

const db = (dbImport as any).default || dbImport;

export default class UpdateArticleEvent {
  private readonly model = db.article;

  constructor() { }

  public async execute(id: string, payload: Partial<CreateArticleEventPayload>): Promise<void> {
    const { category_id, ...rest } = payload;

    if (payload.content && !payload.excerpt) {
      const summaryService = new SummaryService();
      const summary = await summaryService.generateSummary(payload.content);
      rest.excerpt = summary;
    }

    await this.model.update({
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
  }
}