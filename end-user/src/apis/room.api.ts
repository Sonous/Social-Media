import axiosInstance from '@/configs/axios.config';

const roomApis = {
    async getRoomPrivate(currentUserId: string, otherUserId: string) {
        const { access_token } = JSON.parse(localStorage.getItem('auth_info') || '{}');

        const { data } = await axiosInstance.get<Room | ''>('/chats/private', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            params: {
                currentUserId,
                otherUserId,
            },
        });

        return data;
    },

    async createRoom(memberIds: string[], type: 'private' | 'group') {
        const { access_token } = JSON.parse(localStorage.getItem('auth_info') || '{}');

        const { data } = await axiosInstance.post<Room>(
            '/chats/',
            {
                room: {
                    type,
                },
                userIds: memberIds,
            },
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            },
        );

        return data;
    },

    async getRoomsByUserId(userId: string) {
        const { access_token } = JSON.parse(localStorage.getItem('auth_info') || '{}');

        const { data } = await axiosInstance.get<Room[]>(`/chats/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        return data;
    },

    async getRoomById(roomId: string) {
        const { access_token } = JSON.parse(localStorage.getItem('auth_info') || '{}');

        const { data } = await axiosInstance.get<Room>(`/chats/room/${roomId}`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        return data;
    },

    async getMessagesByRoomId(roomId: string) {
        const { access_token } = JSON.parse(localStorage.getItem('auth_info') || '{}');

        const { data } = await axiosInstance.get<Message[]>(`/chats/message/${roomId}`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        return data;
    },
    
    async getLatestMessageByRoomId(roomId: string) {
        const { access_token } = JSON.parse(localStorage.getItem('auth_info') || '{}');

        const { data } = await axiosInstance.get<Message>(`/chats/latest-message/${roomId}`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        return data;
    },
   
    async searchRooms(name: string, userId: string) {
        const { access_token } = JSON.parse(localStorage.getItem('auth_info') || '{}');

        const { data } = await axiosInstance.get<Room[]>(`/chats/search-room/`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            params: {
                name,
                userId,
            }
        });

        return data;
    },
};

export default roomApis;
