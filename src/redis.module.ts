import { DynamicModule, Module } from '@nestjs/common';
import * as _ from 'lodash';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';

import { RedisCoreModule } from './redis-core.module';
import { REDIS_CLIENT_OPTIONS } from './redis.constants';
import { RedisClientManager } from './redis-client.manager';
import { RedisModuleOptions } from './redis-module.options';
import { RedisModuleAsyncOptions } from './redis-module-async.options';

@Module({})
export class RedisModule {
    static forRoot(options: RedisModuleOptions): DynamicModule {
        return {
            module: RedisModule,
            imports: [RedisCoreModule.forRoot(options)],
        };
    }

    static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
        return {
            module: RedisModule,
            imports: [RedisCoreModule.forRootAsync(options)],
        };
    }

    static forFeature(namespace: string): DynamicModule {
        if (_.isEmpty(_.trim(namespace))) {
            throw new RuntimeException('Redis feature namespace must not be blank');
        }

        const redisClientProvider = {
            provide: `${namespace}Redis`,
            useFactory: (options: RedisModuleOptions, manager: RedisClientManager) => {
                return manager.createOrGetClient(options, namespace);
            },
            inject: [REDIS_CLIENT_OPTIONS, RedisClientManager],
        };

        return {
            module: RedisModule,
            providers: [redisClientProvider],
            exports: [redisClientProvider],
        };
    }
}
