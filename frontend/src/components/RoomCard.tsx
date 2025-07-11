import { useEffect, useState } from 'react';
import CustomAvatar from './CustomAvatar';
import { useNavigate } from 'react-router';
import { io, Socket } from 'socket.io-client';
import useTokenStore from '@/store/useTokenStore';
import axiosInstance from '@/configs/axios.config';

const RoomCard = ({ room }: { room: Room }) => {
    const user = useTokenStore((state) => state.user as User);
    const navigate = useNavigate();
    const [latestMessage, setLatestMessage] = useState<Message | undefined>(room.latestMessage);
    const token = useTokenStore((state) => state.token);

    function showAvatar() {
        if (room.type === 'private') {
            const otherUser = room.roomUsers?.find((roomUser) => roomUser.user_id !== user.id) as RoomUser;
            return <CustomAvatar avatar_url={otherUser?.user.avatar_url} username={otherUser?.user.username} className='size-[60px]'/>;
        }
    }

    function showRoomName() {
        if (room.type === 'private') {
            const otherUser = room.roomUsers?.find((roomUser) => roomUser.user_id !== user.id) as RoomUser;
            return otherUser?.user.name;
        }
    }

    useEffect(() => {
        let socket: Socket;

        axiosInstance.get('/').then(() => {
            socket = io(import.meta.env.VITE_BACKEND_URL, {
                extraHeaders: {
                    Authorization: `Bearer ${token}`,
                },
            });

            socket.emit('join-room', {
                room_id: room.id,
                user_id: user.id,
            });

            socket.on('new-message', (data) => {
                setLatestMessage(data);
            });

            socket.on('exception', (error) => {
                console.log('Server exception:', error);
            });
        });

        return () => {
            socket?.close();
        };
    }, [token]);

    return (
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/inbox/${room.id}`)}>
            <div className="avatars">{showAvatar()}</div>

            <div>
                <h1 className="font-semibold">{showRoomName()}</h1>
                {latestMessage && (
                    <h1 className="text-sm text-[#919191]">{`${
                        latestMessage?.user_id === user.id ? 'You' : latestMessage?.sender.name
                    }: ${latestMessage?.content}`}</h1>
                )}
            </div>
        </div>
    );
};

export default RoomCard;
