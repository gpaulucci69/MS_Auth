import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser'; // [cite: 156]
import session from 'express-session';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }));

  app.use(cookieParser()); // 

  app.use(
    session({
      secret: 'mi-secreto-seguro', // Cambiar por variable de entorno
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true, // Protege contra XSS
        secure: false,  // Poner en true si usas HTTPS (Producción)
      },
    }),
  );

  app.enableCors({ origin: 'http://localhost:3001', credentials: true }); // [cite: 150]
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();