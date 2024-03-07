import { ModuleMetadata, FactoryProvider } from '@nestjs/common';

import { RedisModuleOptions } from './redis-module.options';

export interface RedisModuleAsyncOptions
    extends Pick<ModuleMetadata, 'imports'>,
        Pick<FactoryProvider<RedisModuleOptions>, 'useFactory' | 'inject'> {}
