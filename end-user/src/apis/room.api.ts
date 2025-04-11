import axiosInstance from '@/configs/axios.config';

const roomApis = {
    async getRoomPrivate(currentUserId: string, otherUserId: string) {
        const { data } = await axiosInstance.get<Room | ''>('/chats/private', {
            params: {
                currentUserId,
                otherUserId,
            },
        });

        return data;
    },

    async createRoom(memberIds: string[], type: 'private' | 'group') {
        const { data } = await axiosInstance.post<Room>('/chats/', {
            room: {
                type,
            },
            userIds: memberIds,
        });

        return data;
    },

    async getRoomsByUserId(userId: string) {
        const { data } = await axiosInstance.get<Room[]>(`/chats/user/${userId}`, {});

        return data;
    },

    async getRoomById(roomId: string) {
        const { data } = await axiosInstance.get<Room>(`/chats/room/${roomId}`, {});

        return data;
    },

    async getMessagesByRoomId(roomId: string) {
        const { data } = await axiosInstance.get<Message[]>(`/chats/message/${roomId}`, {});

        return data;
    },

    async getLatestMessageByRoomId(roomId: string) {
        const { data } = await axiosInstance.get<Message>(`/chats/latest-message/${roomId}`, {});

        return data;
    },

    async searchRooms(name: string, userId: string) {
        const { data } = await axiosInstance.get<Room[]>(`/chats/search-room/`, {
            params: {
                name,
                userId,
            },
        });

        return data;
    },
};

export default roomApis;
