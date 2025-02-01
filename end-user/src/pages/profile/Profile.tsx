import userApis from '@/apis/users';
import { Loading } from '@/components/Loading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/hooks/reduxHooks';
import { selectUser } from '@/store/slices/UserSlice';
import { Bookmark, Captions, Settings2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';

export const Profile = () => {
    const [profiltState, setProfileState] = useState<ProfileState>('');
    const [path, setPath] = useState<string[]>([]);
    const [profile, setProfile] = useState<User>();
    const location = useLocation();
    const user = useAppSelector(selectUser);
    const navigate = useNavigate();

    // determine if the profile is the user's profile or another user's profile
    useEffect(() => {
        const username = location.pathname.split('/')[1];
        setPath(location.pathname.split('/'));

        if (username === user.username) {
            setProfileState('self');
            // setProfile(user);
            fetchProfile('self');
        } else {
            setProfileState('other');
            // fetch the other's profile
            fetchProfile('other');
        }

        async function fetchProfile(state: ProfileState) {
            let profile = user;

            try {
                if (state === 'other') {
                    const { data } = await userApis.getUserByUsername(username);
                    profile = { ...data };
                }

                setProfile({
                    ...profile,
                });
            } catch (error) {
                console.log(error);
            }
        }
    }, [location, user]);

    return (
        <div className="sm:profile-width sm:p-5 m-auto py-10">
            {!profiltState && !profile ? (
                <Loading />
            ) : (
                <>
                    <header className="grid grid-cols-[150px_1fr] sm:grid-cols-[1fr_2fr] max-sm:gap-3  sm:pb-5">
                        <section className="flex-center sm:row-span-3 sm:py-5">
                            <button>
                                <Avatar className="w-[100px] h-[100px] sm:w-[150px] sm:h-[150px]">
                                    <AvatarImage src={profile?.avatar_url} className="object-cover" />
                                    <AvatarFallback>{profile?.username}</AvatarFallback>
                                </Avatar>
                            </button>
                        </section>

                        <section className="text-[20px] flex max-sm:flex-col max-sm:items-start gap-5 items-center">
                            <span>{profile?.username}</span>
                            {profiltState === 'self' ? (
                                <div className='flex itemx-center gap-2'>
                                    <Button variant={'secondary'}>Edit profile</Button>
                                    <button>
                                        <Settings2 />
                                    </button>
                                </div>
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

                        <section className="max-sm:pl-5">
                            <div className="font-semibold">{profile?.name}</div>
                            <div>{profile?.bio}</div>
                        </section>
                    </header>

                    <div className="flex-center border-t-[1px] border-[#e0e0e0] gap-10 mb-2">
                        <div className={`${!path[2] && 'border-t-[1px]'} border-black`}>
                            <Button
                                variant={'noEffect'}
                                className={`${path[2] && 'opacity-50'}`}
                                onClick={() => navigate(`/${profile?.username}/`)}
                            >
                                <Captions /> POSTS
                            </Button>
                        </div>

                        {profiltState === 'self' ? (
                            <>
                                <div className={`${path[2] === 'saved' && 'border-t-[1px]'} border-black`}>
                                    <Button
                                        variant={'noEffect'}
                                        className={`${path[2] !== 'saved' && 'opacity-50'}`}
                                        onClick={() => navigate(`/${profile?.username}/saved`)}
                                    >
                                        <Bookmark /> Saved
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <></>
                        )}
                    </div>

                    <Outlet
                        context={{
                            profiltState,
                            profile,
                        }}
                    />
                </>
            )}
        </div>
    );
};
