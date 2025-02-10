import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { useAppSelector } from '@/hooks/reduxHooks';
import { selectUser } from '@/store/slices/UserSlice';
import userApis from '@/apis/users.api';

const UserCard = ({
    user,
    setRefetching,
}: {
    user: User & { relation: string };
    setRefetching: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const currentUser = useAppSelector(selectUser);

    function showButton(): React.ReactNode {
        switch (user.relation) {
            case 'none':
            case 'follower':
                return <Button className="bg-blue-500 hover:bg-blue-600"
                onClick={async () => {
                  try {
                      await userApis.addRelation(currentUser.id, user.id);
                      setRefetching(true);
                  } catch (error) {
                      console.log(error);
                  }
              }}
                >Follow</Button>;
            case 'both':
            case 'following':
                return (
                    <Button
                        className="bg-[#eeeeee] hover:bg-[#e6e6e6] text-black"
                        onClick={async () => {
                            try {
                                await userApis.removeRelation(currentUser.id, user.id);
                                setRefetching(true);
                            } catch (error) {
                                console.log(error);
                            }
                        }}
                    >
                        Following
                    </Button>
                );
            default:
                break;
        }
    }

    console.log(user.id)
    console.log(currentUser.id)

    return (
        <div className="px-3 flex justify-between">
            <div className="flex gap-3 items-center">
                <Avatar className="h-[50px] w-[50px]">
                    <AvatarImage src={user.avatar_url} className="object-cover" />
                    <AvatarFallback>{user.username}</AvatarFallback>
                </Avatar>

                <div>
                    <p className="font-semibold text-sm">{user.username}</p>
                    <p className="text-[#b6b6b6] text-sm">{user.name}</p>
                </div>
            </div>

            {user.id !== currentUser.id && <>{showButton()}</>}
        </div>
    );
};

export default UserCard;
