import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Users } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UserInterface } from './user.interface';

type ValidateUsername = {
    isValid: boolean;
    availableUsername?: string;
};

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users) private usersRepository: Repository<Users>,
        private authService: AuthService,
    ) {}

    async validateUsername(username: string): Promise<ValidateUsername> {
        const user = await this.usersRepository
            .createQueryBuilder('user')
            .where('user.username = :username', { username })
            .getOne();

        if (!user) {
            return {
                isValid: true,
            };
        }

        return {
            isValid: false,
        };
    }

    async addUser(user: UserInterface) {
        if (user.password) {
            user.password = await this.authService.hashPassword(user.password);
        }

        return await this.usersRepository
            .createQueryBuilder('users')
            .insert()
            .into(Users)
            .values({
                ...user,
            })
            .execute();
    }

    async getUserById(id: string): Promise<Users> {
        const user = await this.usersRepository
            .createQueryBuilder('user')
            .select(['user.id', 'user.name', 'user.username', 'user.email', 'user.avatar_url', 'user.bio'])
            .where('user.id = :id', { id })
            .getOne();

        if (!user) {
            throw new NotFoundException('User not found', {
                description: `User with id ${id} not found`,
            });
        }

        return user;
    }

    async updateUserById(id: string, user: Partial<UserInterface>) {
        if (user.password) {
            user.password = await this.authService.hashPassword(user.password);
        }

        return await this.usersRepository
            .createQueryBuilder('user')
            .update(Users)
            .set(user)
            .where('id = :id', { id })
            .execute();
    }

    async getUserPosts(id: string) {
        const user = await this.usersRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.posts', 'post')
            .where('user.id = :id', { id })
            .getOne();

        if (!user) {
            throw new NotFoundException('User not found', {
                description: `User with id ${id} not found`,
            });
        }

        return user.posts;
    }
}
