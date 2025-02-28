import React, { useContext, useEffect, useState } from 'react';
import Search from './Search';
import useDebounce from '@/hooks/useDebounce';
import userApis from '@/apis/users.api';
import CustomAvatar from './CustomAvatar';
import { useNavigate } from 'react-router';
import { PostModalContext } from '@/context/PostModalProvider';

const SearchModal = ({ setShowSearchModal }: { setShowSearchModal: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const [searchInput, setSearchInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const navigate = useNavigate();
    const { setIsShowNavText } = useContext(PostModalContext);

    const searchDebounce = useDebounce(searchInput, 500);

    useEffect(() => {
        const searchUser = async () => {
            try {
                setIsLoading(true);
                const users = await userApis.searchUsers(searchDebounce);

                setUsers(users);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };

        if (searchInput) searchUser();
        else setUsers([]);
    }, [searchDebounce]);

    return (
        <div className="absolute sm:left-[100%] z-20 h-full bg-white transition-all sm:w-[400px] w-full sm:border-r-2 max-sm:bottom-[100%] max-sm:rounded-t-2xl max-sm:h-[400px] max-sm:border-t-2 max-sm:border-x-2 flex flex-col">
            <div className="p-5 border-b-2 space-y-5">
                <h1 className="font-semibold text-xl">Search</h1>
                <Search value={searchInput} setValue={setSearchInput} isLoading={isLoading} />
            </div>
            <div className="flex-1 overflow-auto p-3 space-y-5">
                {users.length > 0 ? (
                    users.map((user) => (
                        <div
                            key={user.id}
                            className="flex gap-5 items-center cursor-pointer"
                            onClick={() => {
                                setShowSearchModal(false);
                                setIsShowNavText(true);
                                navigate(`/${user.username}`);
                            }}
                        >
                            <CustomAvatar avatar_url={user.avatar_url} username={user.username} />
                            <div>
                                <h1 className="font-semibold">{user.username}</h1>
                                <p className="text-sm text-[#818181]">{user.name}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="h-full flex-center flex-col">
                        <h1>No results found.</h1>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchModal;
