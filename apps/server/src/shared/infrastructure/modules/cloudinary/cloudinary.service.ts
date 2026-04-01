import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME!,
            api_key: process.env.CLOUDINARY_API_KEY!,
            api_secret: process.env.CLOUDINARY_SECRET!,
            secure: true,
        });
    }

    async uploadBuffer(params: {
        buffer: Buffer;
        filename: string;
        mimetype: string;
        folder: string;
    }): Promise<UploadApiResponse> {
        const { buffer, filename, mimetype, folder } = params;
        const resourceType: 'image' | 'video' = mimetype.startsWith('video/') ? 'video' : 'image';

        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder,
                    resource_type: resourceType,
                    filename_override: filename,
                },
                (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
                    if (error) return reject(new Error(error.message || 'Cloudinary upload failed'));
                    if (!result) return reject(new Error('Cloudinary upload failed: empty result'));
                    resolve(result);
                }
            );

            stream.end(buffer);
        });
    }

    async destroy(publicId: string, kind: 'image' | 'video'): Promise<void> {
        await cloudinary.uploader.destroy(publicId, { resource_type: kind }).catch((error: UploadApiErrorResponse) => {
            throw new Error(`Cloudinary delete error: ${error.message}`);
        });
    }
}
