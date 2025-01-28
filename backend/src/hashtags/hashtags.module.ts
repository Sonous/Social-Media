import { Module } from '@nestjs/common';
import { HashtagsService } from './hashtags.service';
import { HashtagsController } from './hashtags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hashtags } from 'src/entities/hashtags.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Hashtags])],
    providers: [HashtagsService],
    controllers: [HashtagsController],
    exports: [HashtagsService],
})
export class HashtagsModule {}
