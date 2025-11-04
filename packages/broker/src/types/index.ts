export interface BrokerConfig {
  url?: string;
  hostname?: string;
  port?: number;
  username?: string;
  password?: string;
  vhost?: string;
}

export interface PublishOptions {
  exchange?: string;
  routingKey?: string;
  persistent?: boolean;
  expiration?: string;
  messageId?: string;
  correlationId?: string;
  replyTo?: string;
  headers?: Record<string, any>;
}

export interface ConsumeOptions {
  queue: string;
  exchange?: string;
  routingKey?: string;
  durable?: boolean;
  exclusive?: boolean;
  autoDelete?: boolean;
  arguments?: Record<string, any>;
  prefetch?: number;
  deadLetterExchange?: string;
  deadLetterQueue?: string;
  maxRetries?: number;
}

export interface Message {
  content: Buffer;
  fields: {
    deliveryTag: number;
    redelivered: boolean;
    exchange: string;
    routingKey: string;
  };
  properties: {
    contentType?: string;
    contentEncoding?: string;
    headers?: Record<string, any>;
    deliveryMode?: number;
    priority?: number;
    correlationId?: string;
    replyTo?: string;
    expiration?: string;
    messageId?: string;
    timestamp?: number;
    type?: string;
    userId?: string;
    appId?: string;
    clusterId?: string;
  };
}

export type MessageHandler = (message: Message | null) => void | Promise<void>;

