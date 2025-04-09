import { Controller, Get, Query } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';

@Controller('cloudinary')
export class CloudinaryController {
    constructor(private readonly cloudinary: CloudinaryService) {}

    @Get('signature')
    getSignature(@Query('folder') folder: string, @Query('public_id') publicId: string) {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const params: SignatureParams = {
            timestamp,
            folder,
            overwrite: true,
            public_id: publicId,
        };

        const signature = this.cloudinary.generateSignature(params);

        return {
            signature,
            timestamp,
        };
    }
}
