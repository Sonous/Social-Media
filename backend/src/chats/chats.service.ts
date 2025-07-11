import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Messages } from 'src/entities/message.entity';
import { Rooms } from 'src/entities/room.entity';
import { Brackets, Repository } from 'typeorm';
import { RoomInterface } from './interfaces/room.interface';
import { RoomsUsers } from 'src/entities/roomsUsers.entity';
import { UsersService } from 'src/users/users.service';
import { MessageInterface } from './interfaces/messageInterface.interface';

@Injectable()
export class ChatsService {
    constructor(
        @InjectRepository(Rooms) private roomsRepository: Repository<Rooms>,
        @InjectRepository(Messages) private messagesRepository: Repository<Messages>,
        @InjectRepository(RoomsUsers) private roomsUsersRepository: Repository<RoomsUsers>,
        private usersService: UsersService,
    ) {}

    async createRoom(room: RoomInterface, userIds: string[]) {
        const usersPromise = userIds.map(async (userId) => await this.usersService.checkUserBy({ id: userId }));
        const users = await Promise.all(usersPromise);
        if (users.includes(false)) {
            throw new NotFoundException('User not found');
        }

        if (room.type === 'private') {
            const roomPrivate = await this.getRoomPrivate(userIds[0], userIds[1]);
            if (roomPrivate) {
                throw new BadRequestException('Room already exists');
            }
        }

        const newRoom = this.roomsRepository.create(room);
        const savedRoom = await this.roomsRepository.save(newRoom);

        const roomsUsers = userIds.map(async (userId) => {
            const roomUser = this.roomsUsersRepository.create({
                room_id: savedRoom.id,
                user_id: userId,
            });

            return await this.roomsUsersRepository.save(roomUser);
        });
        const savedRoomsUsers = await Promise.all(roomsUsers);

        return {
            ...savedRoom,
            roomUsers: savedRoomsUsers,
        };
    }

    async checkRoomExists(roomId: string) {
        return (await this.roomsRepository.findOneBy({ id: roomId })) || false;
    }

    async getRoomPrivate(currentUserId: string, otherUserId: string) {
        const room = await this.roomsRepository
            .createQueryBuilder('room')
            .innerJoin('room.roomUsers', 'roomUsers')
            .where('roomUsers.user_id = :currentUserId', { currentUserId })
            .andWhere((qb) => {
                const subQuery = qb
                    .subQuery()
                    .select('room_id')
                    .from(RoomsUsers, 'roomUsers')
                    .where('roomUsers.user_id = :otherUserId', { otherUserId })
                    .getQuery();
                return 'room.id IN ' + subQuery;
            })
            .andWhere('room.type = :type', { type: 'private' })
            .getOne();

        return room;
    }

    async getRoomsByUserId(userId: string) {
        const roomsUsers = await this.roomsUsersRepository.findBy({ user_id: userId });

        const roomsPromise = roomsUsers.map(async (roomUser) => {
            const room = await this.roomsRepository
                .createQueryBuilder('room')
                .innerJoin('room.roomUsers', 'roomUsers')
                .innerJoin('roomUsers.user', 'user')
                .select(['room', 'roomUsers.user_id', 'user.username', 'user.avatar_url', 'user.name'])
                .where('room.id = :roomId', { roomId: roomUser.room_id })
                .getOne();

            return room;
        });
        const room = await Promise.all(roomsPromise);

        return room;
    }

    async getRoomById(roomId: string) {
        return await this.roomsRepository
            .createQueryBuilder('room')
            .innerJoin('room.roomUsers', 'roomUsers')
            .innerJoin('roomUsers.user', 'user')
            .select(['room', 'roomUsers.user_id', 'user.username', 'user.avatar_url', 'user.name'])
            .where('room.id = :roomId', { roomId })
            .getOne();
    }

    async getRoomsByName(name: string, userId: string) {
        const isExisted = await this.usersService.checkUserBy({ id: userId });

        if (!isExisted) {
            throw new NotFoundException('User not found');
        }

        return await this.roomsRepository
            .createQueryBuilder('room')
            .innerJoin('room.roomUsers', 'roomUsers')
            .innerJoin('roomUsers.user', 'user')
            .select(['room', 'roomUsers.user_id', 'user.username', 'user.avatar_url', 'user.name'])
            .where(
                new Brackets((qb) => {
                    qb.where(
                        new Brackets((qb) => {
                            qb.where('user.name LIKE :name', { name: `%${name}%` }).andWhere('user.id != :userId', {
                                userId,
                            });
                        }),
                    ).orWhere('room.name LIKE :name', {
                        name: `%${name}%`,
                    });
                }),
            )
            .andWhere((qb) => {
                const subQuery = qb
                    .subQuery()
                    .select('room_id')
                    .from(RoomsUsers, 'roomUsers')
                    .where('roomUsers.user_id = :userId', { userId })
                    .getQuery();
                return 'room.id IN ' + subQuery;
            })
            // .getSql();
            .getMany();
    }

    async checkPermission(roomId: string, userId: string) {
        const permission = await this.roomsUsersRepository.findOne({ where: { room_id: roomId, user_id: userId } });

        if (!permission) {
            return {
                permission: false,
                message: 'You do not have permission to join this room',
            };
        }

        return {
            permission: true,
            message: 'You have permission to join this room',
        };
    }

    async createMessage(message: MessageInterface) {
        const messageEntity = this.messagesRepository.create(message);
        const savedMessage = await this.messagesRepository.save(messageEntity);

        return await this.getMessageById(savedMessage.id);
    }

    async getMessageById(messageId: string) {
        return await this.messagesRepository
            .createQueryBuilder('message')
            .innerJoin('message.sender', 'sender')
            .select(['message', 'sender.username', 'sender.avatar_url', 'sender.name'])
            .where('message.id = :messageId', { messageId })
            .getOne();
    }

    async getMessagesByRoomId(roomId: string) {
        return await this.messagesRepository
            .createQueryBuilder('message')
            .innerJoin('message.sender', 'sender')
            .select(['message', 'sender.username', 'sender.avatar_url', 'sender.name'])
            .where('message.room_id = :roomId', { roomId })
            .orderBy('message.created_at', 'ASC')
            .getMany();
    }

    async getLatestMessageByRoomId(roomId: string) {
        return await this.messagesRepository
            .createQueryBuilder('message')
            .innerJoin('message.sender', 'sender')
            .select(['message', 'sender.username', 'sender.avatar_url', 'sender.name'])
            .where('message.room_id = :roomId', { roomId })
            .orderBy('message.created_at', 'DESC')
            .getOne();
    }

    async verifyMessageOwnership(messageId: string, userId: string) {
        const message = await this.messagesRepository.findOneBy({ id: messageId });

        if (!message) {
            throw new NotFoundException('Message not found');
        }

        if (message.user_id !== userId) {
            throw new BadRequestException('You do not have permission to perform this action');
        }

        return message;
    }

    async updateMessageStatus(messageId: string, status: 'sent' | 'read' | 'recovery') {
        const message = await this.messagesRepository.findOneBy({ id: messageId });

        message.status = status;
        return await this.messagesRepository.save(message);
    }
}
