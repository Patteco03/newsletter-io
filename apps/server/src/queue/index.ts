import { ConsumeOptions, createBroker, MessageHandler } from "@newsletter-io/broker";

class Queue {
  private static instance: Queue;
  private broker = createBroker();
  private isConnected = false;

  private constructor() { }

  static getInstance(): Queue {
    if (!Queue.instance) {
      Queue.instance = new Queue();
    }
    return Queue.instance;
  }

  public async publish(queue: string, data: any): Promise<void> {
    await this.ensureConnected();
    await this.broker.publisher.publishToQueue(queue, JSON.stringify(data), { persistent: true});
  }

  public async consume(callback: MessageHandler, options: ConsumeOptions): Promise<void> {
    await this.ensureConnected();
    await this.broker.consumer.consume(callback, options);
  }

  private async ensureConnected(): Promise<void> {
    if (!this.isConnected) {
      await this.broker.connect();
      this.isConnected = true;
    }
  }

  async close(): Promise<void> {
    if (this.isConnected) {
      await this.broker.close();
      this.isConnected = false;
    }
  }
}

export const queue = Queue.getInstance();