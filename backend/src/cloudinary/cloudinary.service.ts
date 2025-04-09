import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
    generateSignature(params: SignatureParams): string {
        const signature = cloudinary.utils.api_sign_request(
            params,
            process.env.CLOUDINARY_API_SECRET, // Lấy từ biến môi trường
        );
        return signature;
    }
}
