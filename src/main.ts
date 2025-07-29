import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const PORT:number  = configService.get<number>('PORT') || 4000;

  app.enableCors();
  //swagger
  const config = new DocumentBuilder()
  .setTitle("Logger API")
  .setDescription("REST API docs for logger module")
  .setVersion("1.0")
  .build();
  const document  =SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);
}
bootstrap();
