import { BrokerConnection } from './connection';
import { PublishOptions } from './types';

export class Publisher {
  constructor(private connection: BrokerConnection) {}

  /**
   * Publish a message to an exchange
   */
  async publish(
    content: string | object | Buffer,
    options: PublishOptions = {}
  ): Promise<boolean> {
    const channel = await this.connection.getChannel();
    
    const {
      exchange = '',
      routingKey = '',
      persistent = true,
      expiration,
      messageId,
      correlationId,
      replyTo,
      headers = {},
    } = options;

    // Convert content to Buffer
    let buffer: Buffer;
    if (Buffer.isBuffer(content)) {
      buffer = content;
    } else if (typeof content === 'string') {
      buffer = Buffer.from(content);
    } else {
      buffer = Buffer.from(JSON.stringify(content));
    }

    const properties: any = {
      persistent,
      headers,
    };

    if (expiration) {
      properties.expiration = expiration;
    }

    if (messageId) {
      properties.messageId = messageId;
    }

    if (correlationId) {
      properties.correlationId = correlationId;
    }

    if (replyTo) {
      properties.replyTo = replyTo;
    }

    // Set content type based on content type
    if (typeof content === 'object' && !Buffer.isBuffer(content)) {
      properties.contentType = 'application/json';
    }

    try {
      const published = channel.publish(exchange, routingKey, buffer, properties);
      
      if (!published) {
        await (channel as any).waitForConfirms();
      }

      return true;
    } catch (error) {
      throw new Error(`Failed to publish message: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Publish to a specific exchange
   */
  async publishToExchange(
    exchange: string,
    content: string | object | Buffer,
    routingKey: string = '',
    options: Omit<PublishOptions, 'exchange' | 'routingKey'> = {}
  ): Promise<boolean> {
    return this.publish(content, { ...options, exchange, routingKey });
  }

  /**
   * Publish to a queue directly
   */
  async publishToQueue(
    queue: string,
    content: string | object | Buffer,
    options: Omit<PublishOptions, 'routingKey'> = {}
  ): Promise<boolean> {
    const channel = await this.connection.getChannel();
    
    // Ensure queue exists
    await channel.assertQueue(queue, { durable: true });

    return this.publish(content, { ...options, exchange: '', routingKey: queue });
  }
}

