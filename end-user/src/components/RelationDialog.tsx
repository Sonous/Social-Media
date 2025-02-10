import React, { useEffect, useRef, useState } from 'react';
import Search from './Search';
import useDebounce from '@/hooks/useDebounce';
import userApis from '@/apis/users.api';
import { useAppSelector } from '@/hooks/reduxHooks';
import { selectUser } from '@/store/slices/UserSlice';
import UserCard from './UserCard';

const RelationDialog = ({
    type,
    userId,
    setOpenDialog,
}: {
    type: 'followers' | 'following';
    userId: string | undefined;
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
    profiltState: 'self' | 'other' | '';
}) => {
    const dialogRef = useRef<HTMLDivElement | null>(null);
    const [searchedString, setSearchedString] = useState('');
    const [relations, setRelations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [refetching, setRefetching] = useState(false);
    const user = useAppSelector(selectUser);

    const handleHideDialog = (event: React.MouseEvent) => {
        if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
            setOpenDialog(false);
        }
    };

    // Debounce search input
    const searchDebounce = useDebounce(searchedString, 500);

    useEffect(() => {
        fetchRelations();

        async function fetchRelations() {
            try {
                if (!userId) return;
                setIsLoading(true);
                const users = await userApis.getRelations(userId, 1, searchDebounce, type, user.id);

                setRelations(users);
            } catch (error) {
                console.log('relation error', error);
            } finally {
                setIsLoading(false);
            }
        }
    }, [searchDebounce, refetching]);

    console.log(relations);

    return (
        <div
            className="h-svh bg-black bg-opacity-50 flex-center absolute z-̀50 w-full px-10 top-0 left-0"
            onClick={handleHideDialog}
        >
            <div
                ref={dialogRef}
                className="max-w-[450px] max-h-[350px] w-full h-full m-5 bg-white rounded-xl flex flex-col overflow-hidden"
            >
                <header className="p-3 border-b-2">
                    <h1 className="text-center text-lg font-semibold w-full">
                        {type === 'followers' ? 'Followers' : 'Following'}
                    </h1>
                </header>

                <main className="flex-1 flex flex-col min-h-0">
                    <section className="px-5 py-3">
                        <Search value={searchedString} setValue={setSearchedString} isLoading={isLoading} />
                    </section>

                    <section className="overflow-y-auto space-y-4">
                        {relations.length > 0 ? (
                            <>
                                {relations.map((relation, index) => (
                                    <UserCard key={index} user={relation} setRefetching={setRefetching} />
                                ))}
                            </>
                        ) : (
                            <p className="text-center text-[#dbdbdb]">No results found.</p>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
};

export default RelationDialog;
