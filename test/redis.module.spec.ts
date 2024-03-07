import { Test } from '@nestjs/testing';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';

import { RedisModule, RedisClient } from '../src';

describe('RedisModule', () => {
    describe('forRoot', () => {
        describe('given root namespace', () => {
            const rootNamespace = 'root';

            describe('and non empty feature namespace', () => {
                const namespace = 'test';

                it('creates a Redis client with composite prefix', async () => {
                    const moduleRef = await Test.createTestingModule({
                        imports: [
                            RedisModule.forRoot({ namespace: rootNamespace, lazyConnect: true }),
                            RedisModule.forFeature(namespace),
                        ],
                    }).compile();

                    const redisClient = moduleRef.get<RedisClient>('testRedis');

                    expect(redisClient).toBeDefined();
                });
            });

            describe('and empty feature namespace', () => {
                const namespace = ' ';

                it('throws an error', async () => {
                    let thrown: unknown | undefined;

                    try {
                        await Test.createTestingModule({
                            imports: [
                                RedisModule.forRoot({
                                    namespace: rootNamespace,
                                    lazyConnect: true,
                                }),
                                RedisModule.forFeature(namespace),
                            ],
                        }).compile();
                    } catch (e) {
                        thrown = e;
                    }

                    expect(thrown).toBeInstanceOf(RuntimeException);
                    expect((thrown as RuntimeException).message).toEqual('Redis feature namespace must not be blank');
                });
            });
        });
    });

    describe('forRootAsync', () => {
        describe('given root namespace', () => {
            const rootNamespace = 'root';

            describe('and non empty feature namespace', () => {
                const namespace = 'test';

                it('creates a Redis client with composite prefix', async () => {
                    const moduleRef = await Test.createTestingModule({
                        imports: [
                            RedisModule.forRootAsync({
                                useFactory: () => ({ namespace: rootNamespace, lazyConnect: true }),
                            }),
                            RedisModule.forFeature(namespace),
                        ],
                    }).compile();

                    const redisClient = moduleRef.get<RedisClient>('testRedis');

                    expect(redisClient).toBeDefined();
                });
            });

            describe('and empty feature namespace', () => {
                const namespace = ' ';

                it('throws an error', async () => {
                    let thrown: unknown | undefined;

                    try {
                        await Test.createTestingModule({
                            imports: [
                                RedisModule.forRootAsync({
                                    useFactory: () => ({ namespace: rootNamespace, lazyConnect: true }),
                                }),
                                RedisModule.forFeature(namespace),
                            ],
                        }).compile();
                    } catch (e) {
                        thrown = e;
                    }

                    expect(thrown).toBeInstanceOf(RuntimeException);
                    expect((thrown as RuntimeException).message).toEqual('Redis feature namespace must not be blank');
                });
            });
        });
    });
});
