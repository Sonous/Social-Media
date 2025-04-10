import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
// import { PostsModule } from 'src/posts/posts.module';
// import { SavedModule } from 'src/saved/saved.module';

@Module({
    imports: [TypeOrmModule.forFeature([Users]), forwardRef(() => AuthModule)],
    exports: [TypeOrmModule, UsersService],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
