import Redis, { RedisOptions } from 'ioredis';

import { RedisClient } from './redis.client';
import { RedisModuleOptions } from './redis-module.options';

interface ClientMap {
    [name: string]: RedisClient;
}

/**
 * An underlying Redis client manager used to create and provide Redis client
 * instances to separate connections, provide clients and handle cleanup of
 * these clients.
 */
export class RedisClientManager {
    private readonly clients: ClientMap = {};

    private getClientName(namespace: string): string {
        return `${namespace}Redis`;
    }

    /**
     * Creates or returns an existing Redis client instance (a separate connection)
     * based on it's namespace. Each client also has a key prefix composed of both
     * parent module and given namespace, e.g. <pre>someApp:someFeature:</pre>.
     *
     * @param {RedisModuleOptions} options - module connection, namespace options
     * @param {string} namespace - client namespace
     *
     * @returns {RedisClient} a configured Redis client instance
     */
    public createOrGetClient(options: RedisModuleOptions, namespace: string): RedisClient {
        const clientName = this.getClientName(namespace);

        if (!this.clients.hasOwnProperty(clientName)) {
            this.clients[clientName] = this.createClient({
                ...options,
                keyPrefix: `${options.namespace}:${namespace}:`,
            });
        }

        return this.clients[clientName];
    }

    public getClient(namespace: string): RedisClient | undefined {
        return this.clients[this.getClientName(namespace)];
    }

    protected createClient(options: RedisOptions): RedisClient {
        return new Redis(options);
    }

    /**
     * Quits all clients registered by this manager.
     */
    public async quit(): Promise<'OK'> {
        const redisClients = Object.values(this.clients);

        if (redisClients.length) {
            await Promise.all(redisClients.map((c) => c.quit()));
        }

        return Promise.resolve('OK');
    }
}
