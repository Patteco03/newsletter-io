export { BrokerConnection } from './connection';
export { Publisher } from './publisher';
export { Consumer } from './consumer';
export * from './types';

import { BrokerConnection } from './connection';
import { Publisher } from './publisher';
import { Consumer } from './consumer';
import { BrokerConfig } from './types';

/**
 * Create a new broker connection
 */
export function createConnection(config?: BrokerConfig): BrokerConnection {
  return new BrokerConnection(config);
}

/**
 * Create a publisher instance
 */
export function createPublisher(connection: BrokerConnection): Publisher {
  return new Publisher(connection);
}

/**
 * Create a consumer instance
 */
export function createConsumer(connection: BrokerConnection): Consumer {
  return new Consumer(connection);
}

/**
 * Create a complete broker setup (connection, publisher, consumer)
 */
export function createBroker(config?: BrokerConfig) {
  const connection = createConnection(config);
  const publisher = createPublisher(connection);
  const consumer = createConsumer(connection);

  return {
    connection,
    publisher,
    consumer,
    async connect() {
      await connection.connect();
    },
    async close() {
      await connection.close();
    },
  };
}

