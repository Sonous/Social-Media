import roomApis from '@/apis/room.api';
import RoomCard from '@/components/RoomCard';
import Search from '@/components/Search';
import { PostModalContext } from '@/context/PostModalProvider';
import useDebounce from '@/hooks/useDebounce';
import useTokenStore from '@/store/useTokenStore';
import { SquarePen } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';

export const Inbox = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const user = useTokenStore(state => state.user as User);
    const [searchedString, setSearchedString] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { setIsShowNavText } = useContext(PostModalContext);

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
                })
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
                })
                const latestMessages = await Promise.all(latestMessagesPromise);

                setRooms(latestMessages);
            } catch (error) {
                console.log('search rooms error', error);
            } finally {
                setIsLoading(false);
            }
        };

        if(user.id) {
            searchRooms();
        }
    }, [searchInput])

    return (
        <div className="flex-center m-7 flex-col">
            <div className="w-full max-w-[500px] space-y-5">
                <section className=" flex justify-between items-center">
                    <h1 className="text-xl font-semibold">Inbox</h1>
                    <SquarePen onClick={() => setIsShowNavText(prev => !prev)}/>
                </section>

                <Search value={searchedString} setValue={setSearchedString} isLoading={isLoading} />

                <section className="space-y-5">
                    {rooms.length > 0 ? (
                        rooms.map((room) => (
                            <RoomCard key={room.id} room={room} />
                        ))
                    ) : (
                        <h1 className="text-center">No rooms yet</h1>
                    )}
                </section>
            </div>
        </div>
    );
};
