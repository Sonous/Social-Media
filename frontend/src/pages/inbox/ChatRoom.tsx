import roomApis from '@/apis/room.api';
import CustomAvatar from '@/components/CustomAvatar';
import CustomInput from '@/components/CustomInput';
import Message from '@/components/Message';
import axiosInstance from '@/configs/axios.config';
import useTokenStore from '@/store/useTokenStore';
import { uniqueArr } from '@/utils/uniqueArr';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { io, Socket } from 'socket.io-client';

const ChatRoom = () => {
    const { roomId } = useParams();
    const [room, setRoom] = useState<Room | undefined>();
    const [messages, setMessages] = useState<Message[]>([]);
    const user = useTokenStore((state) => state.user as User);
    const [messageInput, setMessageInput] = useState('');
    const divRef = useRef<HTMLDivElement | null>(null);
    const socketRef = useRef<Socket>();

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
        axiosInstance.get('/');
        socketRef.current = io(import.meta.env.VITE_SOCKET_URL, {
            extraHeaders: {
                Authorization: `Bearer ${useTokenStore.getState().token}`,
            },
        });

        const socket = socketRef.current;

        if (roomId && user.id) {
            socket.emit(
                'join-room',
                {
                    room_id: roomId,
                    user_id: user.id,
                },
                (res: { message: string }) => {
                    console.log(res);
                },
            );

            socket.on('new-message', (data) => {
                setMessages((prev) => uniqueArr([...prev, data]));
            });

            socket.on('exception', (error) => {
                console.log('Server exception:', error);
            });
        }
        return () => {
            socket.close();
        };
    }, [roomId, user]);

    const handleSendMessage = async () => {
        const socket = socketRef.current;

        if (!socket) {
            console.error('Socket is not initialized');
            return;
        }

        try {
            axiosInstance.get('/');
            const res = await socket.emitWithAck('send-message', {
                content: messageInput,
                user_id: user.id,
                room_id: roomId,
            });

            console.log('Response from server:', res);
            setMessageInput('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="p-5 flex flex-col h-full">
            <section className="border-b-[1px] pb-3 flex items-center gap-3">
                <motion.div
                    whileHover={{
                        x: -5,
                        transition: { duration: 0.2 },
                    }}
                >
                    <ChevronLeft
                        className="cursor-pointer"
                        onClick={() => {
                            window.history.back();
                        }}
                    />
                </motion.div>
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
