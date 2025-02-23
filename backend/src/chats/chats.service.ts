import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Messages } from 'src/entities/message.entity';
import { Rooms } from 'src/entities/room.entity';
import { Brackets, Repository } from 'typeorm';
import { RoomInterface } from './interfaces/room.interface';
import { RoomsUsers } from 'src/entities/roomsUsers.entity';
import { UsersService } from 'src/users/users.service';
import { MessageInterface } from './interfaces/MessageInterface.interface';

@Injectable()
export class ChatsService {
    constructor(
        @InjectRepository(Rooms) private roomsRepository: Repository<Rooms>,
        @InjectRepository(Messages) private messagesRepository: Repository<Messages>,
        @InjectRepository(RoomsUsers) private roomsUsersRepository: Repository<RoomsUsers>,
        private usersService: UsersService,
    ) {}

    async createRoom(room: RoomInterface, userIds: string[]) {
        const usersPromise = userIds.map(async (userId) => {
            const user = await this.usersService.checkUserExists(userId);

            return user;
        });
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
            .innerJoin('room.roomsUsers', 'roomsUsers')
            .where('roomsUsers.user_id = :currentUserId', { currentUserId })
            .andWhere((qb) => {
                const subQuery = qb
                    .subQuery()
                    .select('room.id')
                    .from(RoomsUsers, 'roomsUsers')
                    .where('roomsUsers.user_id = :otherUserId', { otherUserId })
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
}
