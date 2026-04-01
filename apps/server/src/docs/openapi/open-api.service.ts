import { Injectable } from '@nestjs/common';
import type { OpenAPIObject } from '@nestjs/swagger';

@Injectable()
export class OpenApiService {
    private document: OpenAPIObject;

    setDocument(document: OpenAPIObject) {
        this.document = document;
    }

    getDocument(): OpenAPIObject {
        if (!this.document) {
            throw new Error('OpenAPI document has not been set');
        }

        return this.document;
    }
}
