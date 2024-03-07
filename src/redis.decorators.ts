import { Inject } from '@nestjs/common';

export const InjectRedis = (namespace: string): ((target: object, key: string | symbol, index?: number) => void) =>
    Inject(`${namespace}Redis`);
