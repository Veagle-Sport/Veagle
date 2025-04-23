import { DocumentBuilder } from '@nestjs/swagger';

export const config = new DocumentBuilder()
  .setTitle('Veagle')
  .setDescription('Food trove API description')
  .setVersion('1.0')
  .addTag('Veagle')
  .addBearerAuth()
  .addCookieAuth('refCookie', { type: 'http', in: 'cookies' })
  .addCookieAuth('authCookie', { type: 'http', in: 'cookies' })
  .build();
