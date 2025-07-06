import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Users } from 'src/entities/user.entity';
import { Brackets, Repository } from 'typeorm';
import { UserInterface } from './interfaces/user.interface';
// import { PostsService } from 'src/posts/posts.service';
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from 'src/constants';

type ValidateUsername = {
    isValid: boolean;
    availableUsername?: string;
};

@Injectable()
export class UsersService {
    private readonly defautlOffset: number = DEFAULT_OFFSET;
    private readonly defautlLimit: number = DEFAULT_LIMIT;

    constructor(
        @InjectRepository(Users) private usersRepository: Repository<Users>,
        @Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
        // private postsService: PostsService,
    ) {}

    async validateUsername(username: string): Promise<ValidateUsername> {
        const lowercaseUsername = username.toLowerCase();

        const user = await this.usersRepository
            .createQueryBuilder('user')
            .where('user.username = :username', { username: lowercaseUsername })
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
        user.password = await this.authService.hashPassword(user.password);

        return await this.usersRepository
            .createQueryBuilder('users')
            .insert()
            .into(Users)
            .values({
                ...user,
            })
            .execute();
    }

    async getUserBy(conditions: Partial<UserInterface>, selectPassword: boolean = false) {
        const user = await this.usersRepository.findOne({
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                avatar_url: true,
                bio: true,
                password: selectPassword,
                created_at: true,
                posts: true,
                followers: {
                    id: true,
                },
                following: {
                    id: true,
                },
            },
            relations: {
                posts: true,
                followers: true,
                following: true,
            },
            where: {
                ...conditions,
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return {
            ...user,
            posts: user.posts.length,
            followers: user.followers.length,
            following: user.following.length,
        };
    }

    async checkUserBy(conditions: Partial<UserInterface>) {
        const count = await this.usersRepository.countBy({ ...conditions });
        return count > 0;
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

    async getUsersRelation(
        userId: string,
        page: number,
        searchString: string = '',
        currentUserId: string,
        type: 'followers' | 'following',
    ) {
        const offset = page * this.defautlOffset - this.defautlOffset;
        const limit = this.defautlLimit;

        const user = await this.usersRepository
            .createQueryBuilder('user')
            .where('user.id = :currentUserId', { currentUserId })
            .getOne();

        if (!user) {
            throw new NotFoundException('Current user not found');
        }

        const userRelations = await this.usersRepository
            .createQueryBuilder('user')
            .innerJoin(`user.${type}`, type)
            .select([
                `${type}.id as 'id'`,
                `${type}.name as 'name'`,
                `${type}.username as 'username'`,
                `${type}.avatar_url as 'avatar_url'`,
            ])
            .where('user.id = :userId', { userId })
            .andWhere(
                new Brackets((qb) => {
                    qb.where(`${type}.username LIKE :searchString`, {
                        searchString: `%${searchString}%`,
                    }).orWhere(`${type}.name LIKE :searchString`, {
                        searchString: `%${searchString}%`,
                    });
                }),
            )
            .offset(offset)
            .limit(limit)
            .getRawMany();

        const results = await Promise.all(
            userRelations.map(async (user) => {
                const relationInfo = await this.checkRelation(currentUserId, user.id);

                return {
                    ...user,
                    relation: relationInfo.relation,
                };
            }),
        );

        return results;
    }

    async addRelation(followerId: string, followingId: string) {
        await this.usersRepository.createQueryBuilder().relation(Users, 'following').of(followerId).add(followingId);
    }

    async removeRelation(currentUserId: string, otherUserId: string) {
        await this.usersRepository
            .createQueryBuilder()
            .relation(Users, 'following')
            .of(currentUserId)
            .remove(otherUserId);
    }

    async checkRelation(currentUserId: string, otherUserId: string) {
        const followerRelation = await this.usersRepository
            .createQueryBuilder('user')
            .innerJoin('user.followers', 'follower', 'follower.id = :otherUserId', { otherUserId })
            .select(['user.id', 'follower.id'])
            .where('user.id = :currentUserId', { currentUserId })
            .getRawOne();

        const followingRelation = await this.usersRepository
            .createQueryBuilder('user')
            .innerJoin('user.following', 'following', 'following.id = :otherUserId', { otherUserId })
            .select(['user.id', 'following.id'])
            .where('user.id = :currentUserId', { currentUserId })
            .getRawOne();

        let relation: string;

        if (!followerRelation && !followingRelation) {
            relation = 'none';
        } else if (followerRelation && followingRelation) {
            relation = 'both';
        } else if (followingRelation) {
            relation = 'following';
        } else {
            relation = 'follower';
        }

        return {
            currentUserId,
            otherUserId,
            relation,
        };
    }

    async searchUsers(searchString: string) {
        const users = await this.usersRepository
            .createQueryBuilder('user')
            .select(['user.id', 'user.name', 'user.username', 'user.avatar_url'])
            .where('user.username LIKE :searchString', { searchString: `%${searchString}%` })
            .orWhere('user.name LIKE :searchString', { searchString: `%${searchString}%` })

            .getMany();

        return users;
    }

    async getUserById(id: string) {
        const user = await this.usersRepository.findOneBy({ id });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }
}
