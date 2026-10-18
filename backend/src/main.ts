
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Permite que o front-end acesse a API
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Sistema de Farmácia')
    .setDescription('API para gerenciamento de medicamentos')
    .setVersion('1.0')
    .addTag('medicamentos')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
