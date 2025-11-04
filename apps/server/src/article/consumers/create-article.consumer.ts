import { queue } from "@/queue";
import { Message } from "@newsletter-io/broker";
import CreateArticleEvent, { CreateArticleEventPayload } from "../events/create-article.event";

export class CreateArticleConsumer {
  private readonly event = new CreateArticleEvent()

  /**
   * Start consuming CreateArticleEvent messages
   */
  async start(): Promise<void> {
    try {
      await queue.consume(
        async (message: Message | null) => {
          if (!message) {
            console.log("CreateArticleConsumer: Consumer cancelled");
            return;
          }

          try {
            const eventData = JSON.parse(message.content.toString());

            if (!eventData.userId || !eventData.payload) {
              throw new Error("Invalid event structure: missing userId or payload");
            }

            await this.handleCreateArticle(eventData.userId, eventData.payload);

            console.log("CreateArticleConsumer: Article created successfully", {
              userId: eventData.userId,
              title: eventData.payload.title,
            });
          } catch (error) {
            console.error("CreateArticleConsumer: Error processing message", error);
            throw error;
          }
        },
        {
          queue: "article.create.queue",
          exchange: "article.events",
          routingKey: "article.created",
          durable: true,
          prefetch: 5,
        }
      )

      console.log("CreateArticleConsumer: Started consuming from queue 'article.create.queue'");
    } catch (error) {
      console.error("CreateArticleConsumer: Failed to start consumer", error);
      throw error;
    }
  }

  private async handleCreateArticle(userId: string, payload: CreateArticleEventPayload): Promise<void> {
    await this.event.execute(userId, payload);
  }
}

