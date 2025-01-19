import { Injectable } from '@nestjs/common';
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
        const hashedPassword = await this.authService.hashPassword(user.password);

        return await this.usersRepository
            .createQueryBuilder('users')
            .insert()
            .into(Users)
            .values({
                ...user,
                password: hashedPassword,
            })
            .execute();
    }
}
