import React, { useEffect, useState } from 'react';
import CustomAvatar from './CustomAvatar';
import { useAppSelector } from '@/hooks/reduxHooks';
import { selectUser } from '@/store/slices/UserSlice';
import { useNavigate } from 'react-router';
import { io } from 'socket.io-client';

const RoomCard = ({ room }: { room: Room }) => {
    const user = useAppSelector(selectUser);
    const navigate = useNavigate();
    const [latestMessage, setLatestMessage] = useState<Message | undefined>(room.latestMessage);

    function showAvatar() {
        if (room.type === 'private') {
            const otherUser = room.roomUsers?.find((roomUser) => roomUser.user_id !== user.id) as RoomUser;
            return <CustomAvatar avatar_url={otherUser?.user.avatar_url} username={otherUser?.user.username} />;
        }
    }

    function showRoomName() {
        if (room.type === 'private') {
            const otherUser = room.roomUsers?.find((roomUser) => roomUser.user_id !== user.id) as RoomUser;
            return otherUser?.user.name;
        }
    }

    useEffect(() => {
        const socket = io(import.meta.env.VITE_SOCKET_URL);

        socket.on('connect', () => {
            socket.emit('join-room', {
                room_id: room.id,
                user_id: user.id,
            });

            socket.on('new-message', (data) => {
                setLatestMessage(data);
            });
        });
    }, []);

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
