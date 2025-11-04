import { BrokerConnection } from './connection';
import { ConsumeOptions, Message, MessageHandler } from './types';

export class Consumer {
  private consumingQueues = new Set<string>();
  private consumerTags = new Map<string, string>();

  constructor(private connection: BrokerConnection) {}

  async consume(
    handler: MessageHandler,
    options: ConsumeOptions
  ): Promise<void> {
    const channel = await this.connection.getChannel();
    
    const {
      queue,
      exchange,
      routingKey,
      durable = true,
      exclusive = false,
      autoDelete = false,
      arguments: queueArgs = {},
      prefetch = 1,
    } = options;

    if (this.consumingQueues.has(queue)) {
      console.warn(`Queue ${queue} is already being consumed`);
      return;
    }

    try {
      await channel.prefetch(prefetch);

      if (exchange) {
        await channel.assertExchange(exchange, 'topic', { durable: true });
      }

      await channel.assertQueue(queue, {
        durable,
        exclusive,
        autoDelete,
        arguments: queueArgs,
      });

      if (exchange && routingKey) {
        await channel.bindQueue(queue, exchange, routingKey);
      }

      const { consumerTag } = await channel.consume(queue, async (msg) => {
        if (!msg) {
          await handler(null);
          return;
        }

        const message: Message = {
          content: msg.content,
          fields: msg.fields,
          properties: msg.properties,
        };

        try {
          await handler(message);
          channel.ack(msg);
        } catch (error) {
          console.error('Error processing message:', error);
          channel.nack(msg, false, false); 
        }
      });

      this.consumingQueues.add(queue);
      this.consumerTags.set(queue, consumerTag);
      console.log(`Started consuming from queue: ${queue}`);
    } catch (error) {
      throw new Error(`Failed to consume from queue ${queue}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async stopConsuming(queue: string): Promise<void> {
    if (!this.consumingQueues.has(queue)) {
      return;
    }

    const consumerTag = this.consumerTags.get(queue);
    if (!consumerTag) {
      this.consumingQueues.delete(queue);
      return;
    }

    const channel = await this.connection.getChannel();
    await channel.cancel(consumerTag);
    this.consumingQueues.delete(queue);
    this.consumerTags.delete(queue);
    console.log(`Stopped consuming from queue: ${queue}`);
  }

  getConsumingQueues(): string[] {
    return Array.from(this.consumingQueues);
  }
}

