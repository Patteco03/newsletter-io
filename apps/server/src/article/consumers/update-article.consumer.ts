import { queue } from "@/queue";
import { Message } from "@newsletter-io/broker";
import { CreateArticleEventPayload } from "../events/create-article.event";
import UpdateArticleEvent from "../events/update-article.event";

export class UpdateArticleConsumer {
  private readonly event = new UpdateArticleEvent()

  /**
   * Start consuming CreateArticleEvent messages
   */
  async start(): Promise<void> {
    try {
      await queue.consume(
        async (message: Message | null) => {
          if (!message) {
            console.log("UpdateArticleConsumer: Consumer cancelled");
            return;
          }

          try {
            const eventData = JSON.parse(message.content.toString());

            if (!eventData.id || !eventData.payload) {
              throw new Error("Invalid event structure: missing userId or payload");
            }

            await this.handleUpdateArticle(eventData.id, eventData.payload);

            console.log("UpdateArticleConsumer: Article updated successfully", {
              id: eventData.id,
            });
          } catch (error) {
            console.error("UpdateArticleConsumer: Error processing message", error);
            throw error;
          }
        },
        {
          queue: "article.update.queue",
          exchange: "article.events",
          routingKey: "article.updated",
          durable: true,
          prefetch: 3,
        }
      )

      console.log("UpdateArticleConsumer: Started consuming from queue 'article.update.queue'");
    } catch (error) {
      console.error("UpdateArticleConsumer: Failed to start consumer", error);
      throw error;
    }
  }

  private async handleUpdateArticle(id: string, payload: Partial<CreateArticleEventPayload>): Promise<void> {
    await this.event.execute(id, payload);
  }
}

