import { Module } from '@nestjs/common';
import { SavedController } from './saved.controller';
import { SavedService } from './saved.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Saved } from 'src/entities/saved.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Saved])],
    exports: [SavedService],
    controllers: [SavedController],
    providers: [SavedService],
})
export class SavedModule {}
