import roomApis from '@/apis/room.api';
import RoomCard from '@/components/RoomCard';
import Search from '@/components/Search';
import useDebounce from '@/hooks/useDebounce';
import useTokenStore from '@/store/useTokenStore';
import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router';

export const Inbox = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const user = useTokenStore((state) => state.user as User);
    const [searchedString, setSearchedString] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isInChatRoom, setIsInChatRoom] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const rooms = await roomApis.getRoomsByUserId(user.id);
                const latestMessagesPromise = rooms.map(async (room) => {
                    const latestMessage = await roomApis.getLatestMessageByRoomId(room.id);

                    return {
                        ...room,
                        latestMessage,
                    };
                });
                const latestMessages = await Promise.all(latestMessagesPromise);

                setRooms(latestMessages);
            } catch (error) {
                console.log('fetch rooms error', error);
            }
        };

        if (user.id) {
            fetchRooms();
        }
    }, [user]);

    useEffect(() => {
        if (location.pathname.match(/^\/inbox\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
            setIsInChatRoom(true);
        } else {
            setIsInChatRoom(false);
        }
    }, [location.pathname]);

    // search room
    const searchInput = useDebounce(searchedString, 500);

    useEffect(() => {
        const searchRooms = async () => {
            setIsLoading(true);
            try {
                const rooms = await roomApis.searchRooms(searchInput.trim(), user.id);
                const latestMessagesPromise = rooms.map(async (room) => {
                    const latestMessage = await roomApis.getLatestMessageByRoomId(room.id);

                    return {
                        ...room,
                        latestMessage,
                    };
                });
                const latestMessages = await Promise.all(latestMessagesPromise);

                setRooms(latestMessages);
            } catch (error) {
                console.log('search rooms error', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user.id) {
            searchRooms();
        }
    }, [searchInput]);

    return (
        <div className="flex size-full">
            <div
                className={`sm:w-[250px] lg:w-[400px] space-y-5 p-4 border-r h-full w-full ${
                    isInChatRoom ? 'max-sm:hidden' : ''
                }`}
            >
                <section className="flex justify-between items-center pt-5">
                    <h1 className="text-2xl font-semibold">Inbox</h1>
                    {/* <SquarePen onClick={() => setIsShowNavText(prev => !prev)}/> */}
                </section>

                <Search value={searchedString} setValue={setSearchedString} isLoading={isLoading} />

                <section className="space-y-5">
                    {rooms.length > 0 ? (
                        rooms.map((room) => <RoomCard key={room.id} room={room} />)
                    ) : (
                        <h1 className="text-center">No rooms yet</h1>
                    )}
                </section>
            </div>

            <div className={`flex-1 ${!isInChatRoom ? 'max-sm:hidden' : ''}`}>
                {isInChatRoom ? (
                    <Outlet />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <h1 className="text-2xl font-semibold">Select a chat to start messaging</h1>
                    </div>
                )}
            </div>
        </div>
    );
};
