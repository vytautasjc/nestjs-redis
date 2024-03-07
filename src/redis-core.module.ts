import { DynamicModule, Global, Module, OnApplicationShutdown } from '@nestjs/common';

import { REDIS_CLIENT_OPTIONS } from './redis.constants';
import { RedisClientManager } from './redis-client.manager';
import { RedisModuleOptions } from './redis-module.options';
import { RedisModuleAsyncOptions } from './redis-module-async.options';

@Global()
@Module({})
export class RedisCoreModule implements OnApplicationShutdown {
    constructor(private readonly manager: RedisClientManager) {}

    static forRoot(options: RedisModuleOptions): DynamicModule {
        const redisClientOptionsProvider = {
            provide: REDIS_CLIENT_OPTIONS,
            useValue: options,
        };

        const redisClientFactoryProvider = {
            provide: RedisClientManager,
            useClass: RedisClientManager,
        };

        return {
            module: RedisCoreModule,
            providers: [redisClientOptionsProvider, redisClientFactoryProvider],
            exports: [redisClientOptionsProvider, redisClientFactoryProvider],
        };
    }

    static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
        const redisClientOptionsProvider = {
            provide: REDIS_CLIENT_OPTIONS,
            useFactory: options.useFactory,
            inject: options.inject || [],
        };

        const redisClientFactoryProvider = {
            provide: RedisClientManager,
            useClass: RedisClientManager,
        };

        return {
            module: RedisCoreModule,
            imports: options.imports,
            providers: [redisClientOptionsProvider, redisClientFactoryProvider],
            exports: [redisClientOptionsProvider, redisClientFactoryProvider],
        };
    }

    async onApplicationShutdown(signal?: string): Promise<void> {
        await this.manager.quit();
    }
}
