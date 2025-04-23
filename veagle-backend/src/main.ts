import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { config as swaggerConfig } from './cofig/swagger.config';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { LoggingInterceptor } from './common/loggers/interceptors/logging.interceptor';

  
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import helmet from 'helmet';
async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
     bufferLogs:true
   })
   app.useGlobalInterceptors(new LoggingInterceptor())
  app.use(cookieParser(process.env.COOKIE_SECRET));
 app.enableCors()
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.use(compression());
  app.use(helmet());
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'src/views'));
  app.setViewEngine('pug');

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, documentFactory);
   await app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running on port 8000');
  });
}

bootstrap();
/*
 */