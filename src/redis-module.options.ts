import { RedisOptions } from 'ioredis';

export interface RedisModuleOptions extends RedisOptions {
    /**
     * A root namespace that will be used by all features as a keyPrefix,
     * must not contain a colon suffix.
     *
     * @example 'awesomeFeature'
     */
    namespace: string;
}
