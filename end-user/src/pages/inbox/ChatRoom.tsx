import roomApis from '@/apis/room.api';
import CustomAvatar from '@/components/CustomAvatar';
import CustomInput from '@/components/CustomInput';
import Message from '@/components/Message';
import { useAppSelector } from '@/hooks/reduxHooks';
import { selectUser } from '@/store/slices/UserSlice';
import { uniqueArr } from '@/utils/uniqueArr';
import { useEffect, useRef, useState } from 'react';
import {  useParams } from 'react-router';
import { io, Socket } from 'socket.io-client';

const ChatRoom = () => {
    const { roomId } = useParams();
    const [room, setRoom] = useState<Room | undefined>();
    const [messages, setMessages] = useState<Message[]>([]);
    const user = useAppSelector(selectUser);
    const [messageInput, setMessageInput] = useState('');
    const [socket, setSocket] = useState<Socket>();
    const divRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (divRef.current) {
        divRef.current.scrollTop = divRef.current.scrollHeight;
      }
    }, [messages]);


    function showAvatar(className?: string) {
        if (room?.type === 'private') {
            const otherUser = room.roomUsers?.find((roomUser) => roomUser.user_id !== user.id) as RoomUser;
            return (
                <CustomAvatar
                    avatar_url={otherUser?.user.avatar_url}
                    username={otherUser?.user.username}
                    className={className}
                />
            );
        }
    }

    function showRoomName() {
        if (room?.type === 'private') {
            const otherUser = room.roomUsers?.find((roomUser) => roomUser.user_id !== user.id) as RoomUser;
            return otherUser?.user.name;
        }
    }

    useEffect(() => {
        const fetchRoomData = async () => {
            try {
                const data = await roomApis.getRoomById(roomId as string);
                const messages: Message[] = await roomApis.getMessagesByRoomId(roomId as string);

                setRoom(data);
                setMessages(messages);
            } catch (error) {
                console.log(error);
            }
        };

        if (roomId) {
            fetchRoomData();
        }
    }, [roomId]);

    useEffect(() => {
        if (roomId && user.id) {
            const socket = io(import.meta.env.VITE_SOCKET_URL);

            socket.emit(
                'join-room',
                {
                    room_id: roomId,
                    user_id: user.id,
                },
                (res: { message: string}) => {
                    console.log(res);
                },
            );

            socket.on('new-message', (data) => {
                setMessages((prev) => uniqueArr([...prev, data]));
            });

            setSocket(socket);
        }
        return () => {
            if (socket) socket.close();
        };
    }, [roomId, user]);

    const handleSendMessage = async () => {
        if (socket) {
            socket.emit(
                'send-message',
                {
                    content: messageInput,
                    user_id: user.id,
                    room_id: roomId,
                },
                (res: { message: string; data?: Message }) => {
                    console.log(res)
                    setMessageInput('');
                },
            );
        }
    };

    return (
        <div className="p-5 flex flex-col h-full">
            <section className="border-b-[1px] pb-3">
                <div className="flex gap-3 items-center">
                    {showAvatar()}
                    <h1 className="font-semibold">{showRoomName()}</h1>
                </div>
            </section>

            <section ref={divRef} className="flex-1 w-full p-3 mb-3 space-y-4 overflow-auto">
                <div className="flex-center flex-col gap-3">
                    {showAvatar('w-20 h-20')}
                    <h1>{showRoomName()}</h1>
                </div>

                {messages.map((message) => (
                    <Message message={message} key={message.id} />
                ))}
            </section>

            <section className="input border-2 rounded-3xl flex items-center px-3">
                <CustomInput
                    inputValue={messageInput}
                    setInputValue={setMessageInput}
                    symbolTrigger="@"
                    type="input"
                    className="bg-white rounded-3xl"
                />
                <div>
                    {messageInput && (
                        <button className="text-blue-500 font-semibold cursor-pointer" onClick={handleSendMessage}>
                            Send
                        </button>
                    )}
                </div>
            </section>
        </div>
    );
};

export default ChatRoom;
