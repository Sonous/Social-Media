import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());
    app.enableCors({
        origin: process.env.ORIGIN_CORS, // Chỉ cho phép yêu cầu từ nguồn này
        credentials: true, // Cho phép gửi cookie từ client
    });
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
