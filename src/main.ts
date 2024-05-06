import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { dynamicImport } from './shared/utils/utils';
import AdminJS from 'adminjs';
// import { setupAdminPanel } from './setup-admin';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.enableShutdownHooks();
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const adminJSModule = await dynamicImport('adminjs');
  const AdminJS = adminJSModule.default;
  const AdminJSTypeorm = await dynamicImport('@adminjs/typeorm');
  AdminJS.registerAdapter({
    Resource: AdminJSTypeorm.Resource,
    Database: AdminJSTypeorm.Database,
  });
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
  const port = process.env.PORT;
  // await setupAdminPanel(app);
  await app.listen(port);
  console.log(`App starting on port ${port}`);
  console.log(`Admin page starting at endpoint /admin`);
}
void bootstrap();
