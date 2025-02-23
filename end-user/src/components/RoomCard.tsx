import React, { useEffect } from 'react';
import CustomAvatar from './CustomAvatar';
import { useAppSelector } from '@/hooks/reduxHooks';
import { selectUser } from '@/store/slices/UserSlice';
import { useNavigate } from 'react-router';
import { io } from 'socket.io-client';

const RoomCard = ({ room }: { room: Room }) => {
    const user = useAppSelector(selectUser);
    const navigate = useNavigate();

    function showAvatar() {
        if (room.type === 'private') {
            const otherUser = room.roomUsers?.find((roomUser) => roomUser.user_id !== user.id) as RoomUser;
            return <CustomAvatar avatar_url={otherUser?.user.avatar_url} username={otherUser?.user.username} />;
        }
    }

    function showRoomName() {
        if (room.type === 'private') {
            const otherUser = room.roomUsers?.find((roomUser) => roomUser.user_id !== user.id) as RoomUser;
            return otherUser?.user.username;
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
                console.log('join-room-success', data);
            });
        });
    }, []);

    return (
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/inbox/${room.id}`)}>
            <div className="avatars">{showAvatar()}</div>

            <div>
                <h1 className="">{showRoomName()}</h1>
            </div>
        </div>
    );
};

export default RoomCard;
