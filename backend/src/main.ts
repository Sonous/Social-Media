import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: process.env.ORIGIN_CORS, // Chỉ cho phép yêu cầu từ nguồn này
    });
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
