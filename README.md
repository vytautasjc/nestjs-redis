# Redis Module

Inspired by TypeORM NestJS module structure this module registers a global client manager which is used for actual client creation based on their namespace.

## Usage

1. Redis module has to be configured in app module first by providing connection configuration:

    ```typescript
    @Module({
        imports: [
            RedisModule.forRoot({
                namespace: 'test-service',
                host: '127.0.0.1',
                password: '...',
            }),
        ],
        providers: [],
    })
    export class AppModule {}
    ```

    This will create a Redis client manager responsible for registering and reusing clients based on their namespace.
    This does not create any client by default.

2. For each feature you want to use Redis for create a separate client with it's namespace:

    ```typescript
    @Module({
        imports: [RedisModule.forFeature('awesome')],
        providers: [],
    })
    export class AwesomeModule {}
    ```

    This creates a new client (and a new connection) for Redis with a client namespace `awesome`.
    For each unique client namespace a new client with it's dedicated connection is created.
    However, you can still have a generic client by creating one in a separate module and importing
    that module into other modules where this client is needed. Namespaces are used as key prefixes
    as well, e.g. `redisClient.set('some-key', 'test-value')` would result in a key `test-service:aweosme:some-key`.
    This is done automatically, meaning to get a value you don't have to specify the whole key -
    `redisClient.get('some-key')` would return `'test-value'`. You can read more about key prefixes
    [here](https://github.com/luin/ioredis#transparent-key-prefixing).
