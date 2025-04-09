import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser(process.env.COOKIE_SECRET));
    app.enableCors({
        origin: process.env.ORIGIN_CORS, // Chỉ cho phép yêu cầu từ nguồn này
    });
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
