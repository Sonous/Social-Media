import roomApis from '@/apis/room.api';
import RoomCard from '@/components/RoomCard';
import Search from '@/components/Search';
import { useAppSelector } from '@/hooks/reduxHooks';
import { selectUser } from '@/store/slices/UserSlice';
import { SquarePen } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export const Inbox = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const user = useAppSelector(selectUser);
    const [searchedString, setSearchedString] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const rooms = await roomApis.getRoomsByUserId(user.id);
                setRooms(rooms);
            } catch (error) {
                console.log('fetch rooms error', error);
            }
        };

        if (user.id) {
            fetchRooms();
        }
    }, [user]);
    console.log(rooms);

    return (
        <div className="flex-center m-10 flex-col">
            <div className="w-full max-w-[500px] space-y-5">
                <section className=" flex justify-between items-center">
                    <h1 className="text-xl font-semibold">Inbox</h1>
                    <SquarePen />
                </section>

                <Search value={searchedString} setValue={setSearchedString} isLoading={isLoading} />

                <section className="">
                    {rooms.map((room) => (
                        <RoomCard room={room} />
                    ))}
                </section>
            </div>
        </div>
    );
};
