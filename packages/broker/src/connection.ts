import amqplib from 'amqplib';
import type { Connection, Channel } from 'amqplib';
import { BrokerConfig } from './types';

export class BrokerConnection {
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private config: Required<BrokerConfig>;
  private isConnecting = false;

  constructor(config: BrokerConfig = {}) {
    this.config = {
      url: config.url || process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672',
      hostname: config.hostname || process.env.RABBITMQ_HOST || 'localhost',
      port: config.port || Number(process.env.RABBITMQ_PORT) || 5672,
      username: config.username || process.env.RABBITMQ_USER || 'admin',
      password: config.password || process.env.RABBITMQ_PASSWORD || 'admin',
      vhost: config.vhost || process.env.RABBITMQ_VHOST || '/',
    };
  }

  async connect(): Promise<Connection> {
    if (this.connection) {
      return this.connection;
    }

    if (this.isConnecting) {
      while (this.isConnecting) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      if (this.connection) {
        return this.connection;
      }
    }

    this.isConnecting = true;

    try {
      const connectionUrl = this.config.url || 
        `amqp://${this.config.username}:${this.config.password}@${this.config.hostname}:${this.config.port}${this.config.vhost}`;

      const conn = await amqplib.connect(connectionUrl);
      this.connection = conn as unknown as Connection;
      
      if (this.connection) {
        this.connection.on('error', (err: Error) => {
          console.error('RabbitMQ connection error:', err);
          this.connection = null;
          this.channel = null;
        });

        this.connection.on('close', () => {
          console.log('RabbitMQ connection closed');
          this.connection = null;
          this.channel = null;
        });
      }

      console.log('RabbitMQ connected successfully');
      return this.connection!;
    } catch (error) {
      this.connection = null;
      throw new Error(`Failed to connect to RabbitMQ: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      this.isConnecting = false;
    }
  }

  async getChannel(): Promise<Channel> {
    if (this.channel && (this.channel as any).connection && !(this.channel as any).connection.destroyed) {
      return this.channel;
    }

    const connection = await this.connect();
    
    try {
      this.channel = await (connection as any).createChannel();
      
      if (this.channel) {
        this.channel.on('error', (err: Error) => {
          console.error('RabbitMQ channel error:', err);
          this.channel = null;
        });

        this.channel.on('close', () => {
          console.log('RabbitMQ channel closed');
          this.channel = null;
        });
      }

      return this.channel!;
    } catch (error) {
      this.channel = null;
      throw new Error(`Failed to create channel: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async close(): Promise<void> {
    if (this.channel) {
      await this.channel.close().catch(() => {});
      this.channel = null;
    }

    if (this.connection) {
      await (this.connection as any).close().catch(() => {});
      this.connection = null;
    }
  }

  isConnected(): boolean {
    return this.connection !== null && !(this.connection as any).destroyed;
  }
}

