import { Loading } from '@/components/Loading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/hooks/reduxHooks';
import { selectUser } from '@/store/slices/UserSlice';
import { Bookmark, Captions, Settings2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

export const Profile = () => {
    const [profiltState, setProfileState] = useState('');
    const [path, setPath] = useState<string[]>([]);
    const [profile, setProfile] = useState<Profile>();
    const location = useLocation();
    const user = useAppSelector(selectUser);

    // determine if the profile is the user's profile or another user's profile
    useEffect(() => {
        const username = location.pathname.split('/')[1];
        setPath(location.pathname.split('/'));

        if (username === user.username) {
            setProfileState('self');
            setProfile(user);
        } else {
            setProfileState('other');
            // fetch the other's profile
        }
        

        // TODO: fetch the full info profile of user
    }, [location]);

    console.log(path)

    return (
        <div className="sm:profile-width sm:p-5 m-auto py-10">
            {!profiltState ? (
                <Loading />
            ) : (
                <>
                    <header className="grid grid-cols-[120px_1fr] sm:grid-cols-[1fr_2fr] max-sm:gap-3 px-5 sm:pb-5">
                        <section className="flex-center sm:row-span-3 sm:py-5">
                            <button>
                                <Avatar className="w-[100px] h-[100px] sm:w-[150px] sm:h-[150px]">
                                    <AvatarImage src={profile?.avatar_url} className="object-cover" />
                                    <AvatarFallback>{profile?.username}</AvatarFallback>
                                </Avatar>
                            </button>
                        </section>

                        <section className="text-[20px] flex gap-5 items-center">
                            <span>{profile?.username}</span>
                            {profiltState === 'self' ? (
                                <>
                                    <Button variant={'secondary'}>Edit profile</Button>
                                    <button>
                                        <Settings2 />
                                    </button>
                                </>
                            ) : (
                                <div></div>
                            )}
                        </section>

                        <section className="flex sm:gap-5 max-sm:justify-evenly py-3 max-sm:border-t-2 max-sm:col-span-2 max-sm:row-start-5 max-sm:row-end--1">
                            <button className="cursor-text">
                                <span className="font-bold">0 </span>
                                posts
                            </button>
                            <button>
                                <span className="font-bold">0 </span>
                                followers
                            </button>
                            <button>
                                <span className="font-bold">0 </span>
                                following
                            </button>
                        </section>

                        <section className="">
                            <div className='font-semibold'>{profile?.name}</div>
                            <div>{profile?.bio}</div>
                        </section>
                    </header>

                    <div className="flex-center border-t-[1px] border-[#e0e0e0] gap-10">
                        <div className={`${!path[2] && 'border-t-[1px]'} border-black`}>
                            <Button variant={'noEffect'}>
                                <Captions /> POSTS
                            </Button>
                        </div>

                        {profiltState === 'self' ? (
                            <>
                                <div className={`${path[2] === 'saved' && 'border-t-[1px]'} border-black`}>
                                    <Button variant={'noEffect'} >
                                        <Bookmark /> Saved
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <></>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
