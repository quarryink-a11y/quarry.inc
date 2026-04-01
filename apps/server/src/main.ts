import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { OpenApiService } from './docs/openapi/open-api.service';
import { IS_DEVELOPMENT } from './shared/constants';
import { HttpExceptionFilter } from './shared/errors';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        rawBody: true,
    });
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
        })
    );

    app.setGlobalPrefix('api');

    app.use(cookieParser());

    app.useGlobalFilters(new HttpExceptionFilter());

    const platformOrigins = IS_DEVELOPMENT
        ? ['http://localhost:3000', 'http://localhost:3333']
        : (process.env.ALLOWED_ORIGINS?.split(',').map((o) => o.trim()) ?? []);

    app.enableCors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (platformOrigins.includes(origin)) return callback(null, true);
            if (origin.endsWith('.vercel.app')) return callback(null, true);
            // Custom domains: allow all origins, auth is enforced by Bearer token + TenantResolution
            return callback(null, true);
        },
        credentials: true,
    });

    const config = new DocumentBuilder().setTitle('API').setVersion('1.0.0').addBearerAuth().build();

    const document = SwaggerModule.createDocument(app, config);

    app.get(OpenApiService).setDocument(document);

    await app.listen(process.env.PORT as string);
}

void bootstrap();
