import { Redis } from 'ioredis';

import { RedisClient, RedisClientManager } from '../src';

describe('RedisClientManager', () => {
    describe('createOrGetClient', () => {
        describe('given options with namespace', () => {
            describe('and client namespace', () => {
                it('creates a new Redis client with root and client namespace composite keyPrefix', () => {
                    const manager = new RedisClientManager();

                    const client = manager.createOrGetClient(
                        {
                            lazyConnect: true,
                            namespace: 'root',
                        },
                        'dummy',
                    );

                    expect(client).toBeDefined();
                    expect((client as Redis).options.keyPrefix).toEqual('root:dummy:');
                });

                it('returns previously created client', () => {
                    const manager = new RedisClientManager();

                    const initialClient = manager.createOrGetClient(
                        {
                            host: 'localhost',
                            lazyConnect: true,
                            namespace: 'root',
                        },
                        'dummy',
                    );

                    const secondClient = manager.createOrGetClient(
                        {
                            host: 'remote',
                            lazyConnect: true,
                            namespace: 'root',
                        },
                        'dummy',
                    );

                    expect(secondClient).toBeDefined();
                    expect((secondClient as Redis).options.host).toEqual('localhost');
                    expect((secondClient as Redis).options.keyPrefix).toEqual('root:dummy:');
                    expect(secondClient).toBe(initialClient);
                });
            });
        });
    });

    describe('getClient', () => {
        describe('given a client exists', () => {
            let manager: RedisClientManager;
            const namespace = 'dummy';

            beforeEach(() => {
                manager = new RedisClientManager();

                manager.createOrGetClient(
                    {
                        lazyConnect: true,
                        namespace: 'root',
                    },
                    'dummy',
                );
            });

            it('returns Redis client with root and client namespace composite keyPrefix', () => {
                const client = manager.getClient(namespace);

                expect(client).toBeDefined();
                expect((client as Redis).options.keyPrefix).toEqual('root:dummy:');
            });
        });

        describe('given a client does not exist', () => {
            let manager: RedisClientManager;
            const namespace = 'dummy';

            beforeEach(() => {
                manager = new RedisClientManager();
            });

            it('returns undefined', () => {
                const client = manager.getClient(namespace);

                expect(client).toBeUndefined();
            });
        });
    });

    describe('quit', () => {
        it('given no clients exist does resolves "OK"', async () => {
            const manager = new RedisClientManager();

            const result = await manager.quit();

            expect(result).toEqual('OK');
        });

        it('given clients exist disconnects them and resolves "OK"', async () => {
            const manager = new RedisClientManager();

            const options = {
                host: 'localhost',
                lazyConnect: true,
                namespace: 'root',
            };

            const client: RedisClient & { manuallyClosing?: boolean } = manager.createOrGetClient(options, 'dummy');

            await manager.quit();

            expect(client.manuallyClosing).toEqual(true);
        });
    });
});
