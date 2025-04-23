import { Cache } from 'cache-manager';
import {  IdempotencyInterceptor } from './idompotancy.interceptor';
import { ExecutionContext } from '@nestjs/common';
import { CallHandler } from '@nestjs/common';

describe('IdompotancyInterceptor', () => {
 let cache: Cache  
  it('should be defined', () => {
    cache = {
      get: jest.fn().mockResolvedValue(null),
      del: jest.fn(),
      wrap: jest.fn().mockResolvedValue(null),
      set: jest.fn(),
      ttl: jest.fn(),
      mget: jest.fn(),
      clear: jest.fn(),
      mset: jest.fn(),
      mdel: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
      disconnect: jest.fn(),
    } as unknown as Cache;
     expect(new IdempotencyInterceptor(cache)).toBeDefined();
  });
  it('should call cache.get and return next.handle() if no idempotency key', async () => {
    const interceptor = new IdempotencyInterceptor(cache);
    const context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ headers: {} }),
        getResponse: jest.fn(),
      }),
    } as unknown as ExecutionContext;
    const next = {
      handle: jest.fn().mockReturnValue(Promise.resolve('next.handle()')),
    } as unknown as CallHandler;

    const result = await interceptor.intercept(context, next);
    expect(cache.get).not.toHaveBeenCalled();
    expect(next.handle).toHaveBeenCalled();
    expect(result).toEqual('next.handle()');
  });
  // it('should call cache.get and return cached response if idempotency key exists', async () => {
  //   const interceptor = new IdempotencyInterceptor(cache);
  //   const context = {
  //     switchToHttp: jest.fn().mockReturnValue({
  //       getRequest: jest.fn().mockReturnValue({ headers: { 'idempotency-key': 'test-key' }, method: 'POST' }),
  //       getResponse: jest.fn(),
  //     }),
  //   } as unknown as ExecutionContext;
  //   const next = {
  //     handle: jest.fn().mockReturnValue(Promise.resolve('next.handle()')),
  //   } as unknown as CallHandler;

 
  //   const result = await interceptor.intercept(context, next);
  //   expect(cache.get).toHaveBeenCalledWith('test-key');
  //   expect(next.handle).not.toHaveBeenCalled();
  //   expect(result).toBeUndefined();
  // });
});
