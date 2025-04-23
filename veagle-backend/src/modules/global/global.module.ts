import * as path from 'path';

import { DynamicModule, Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'

import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
 
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';

import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AllExceptionsFilter } from 'src/common/loggers/filters/Exception.filter';
 import { LowerCasePipe } from 'src/common/pipes/lower-case-pipe';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggingInterceptor } from 'src/common/loggers/interceptors/logging.interceptor';
import { QueryConstructorPipe } from 'src/common/pipes/query-constructor.pipe/query-constructor.pipe';
import { UtilsModule } from '../utils/utils.module';
  

@Module({})
export class GlobalModlue {
  constructor(){
   }
  static forRoot(): DynamicModule {
    
    return {
      module: GlobalModlue,
      imports: [
        UtilsModule.forRoot(),
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        MongooseModule.forRoot('mongodb+srv://insharo:Ny4XfD7pJWEY5QBu@cluster0.tdyv5wj.mongodb.net/veagle' /*'mongodb://localhost:27017/veagle'*/   , {
          maxPoolSize: 100,
        }),
        // CacheModule.register({
        //   isGlobal: true,
        //   ttl: 60 * 1000,
        // }),
       
        ThrottlerModule.forRoot([
          {
            ttl: 60000,
            limit: 100,
          },
        ]),

        // ConfigModule.forRoot({
        //   isGlobal: true,
        // }),
      ],
      providers: [
        // {
        //   provide: APP_INTERCEPTOR,
        //   useClass: CacheInterceptor,
        // },

        {
          provide: APP_INTERCEPTOR,
          useClass: LoggingInterceptor,
        },
        // {provide:APP_PIPE,
        //   useClass:LowerCasePipe
        // },
        {
          provide: APP_FILTER,
          useClass: AllExceptionsFilter,
        },
        // { provide: APP_GUARD, useClass: ThrottlerGuard },
        QueryConstructorPipe
      ],

   
exports:[QueryConstructorPipe],
      global: true,
    };
  }
}