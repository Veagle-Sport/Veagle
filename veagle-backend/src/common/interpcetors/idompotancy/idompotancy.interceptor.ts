import { Cache } from '@nestjs/cache-manager';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(private readonly cache: Cache) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request:Request = context.switchToHttp().getRequest();
    const response:Response = context.switchToHttp().getResponse();
 
    const idempotencyKey = request.headers['idempotency-key'];
    const method = request.method;

    if (!idempotencyKey || !(method === 'POST' || method === 'PATCH')) {
      return next.handle();  
    }
    const cachedResponse = await this.cache.get(idempotencyKey);
    if (cachedResponse) {
       response.status(cachedResponse['statusCode']).json(cachedResponse['body']);
      return of(null);  
    }

    return next.handle().pipe(
      tap((data) => {
         this.cache.set(idempotencyKey, { statusCode: response.statusCode, body: data }, 60 * 1000);
      })
    );
  }
}
