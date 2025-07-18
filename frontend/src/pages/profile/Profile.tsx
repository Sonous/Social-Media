import cloudinaryAPI from '@/apis/cloudinary.api';
import roomApis from '@/apis/room.api';
import userApis from '@/apis/users.api';
import { Loading } from '@/components/Loading';
import RelationDialog from '@/components/RelationDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import useTokenStore from '@/store/useTokenStore';
import { AxiosError } from 'axios';
import { Bookmark, Captions, Settings2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';

export const Profile = () => {
    const [profiltState, setProfileState] = useState<ProfileState>('');
    const [path, setPath] = useState<string[]>([]);
    const [profile, setProfile] = useState<User>();
    const [openFollowers, setOpenFollowers] = useState(false);
    const [openFollowing, setOpenFollowing] = useState(false);
    const [relation, setRelation] = useState<Relation | undefined>();
    const [refresh, setRefresh] = useState(false);
    const location = useLocation();
    const user = useTokenStore(state => state.user as User);
    const updateUser = useTokenStore(state => state.updateUser);
    const navigate = useNavigate();
    const avatarInputRef = useRef<HTMLInputElement | null>(null);

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
            try {
                if (state === 'other') {
                    const { data } = await userApis.getUserByUsername(username);

                    setProfile(
                        { ...data }
                    );
                    await checkRelation(user.id, data.id);
                } else {
                    const { data } = await userApis.getUserById(user.id);

                    console.log(data);

                    setProfile({ ...data });
                }

            } catch (error) {
                if (error instanceof AxiosError) {
                    if (error.status === 404) {
                        navigate('/not-found');
                    }
                    console.log(error);
                }
                
            }
        }

        async function checkRelation(currentUserId: string, otherUserId: string) {
            try {
                const relation = await userApis.checkRelation(currentUserId, otherUserId);

                setRelation(relation);
            } catch (error) {
                console.log(error);
            }
        }
    }, [location, user, refresh]);

    // console.log(relation);
    const handleChangeAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;
        const avatar = event.target.files[0];

        try {
            const imageUrl = await cloudinaryAPI.uploadMedia(user.id, 'avatars', avatar)

            if (imageUrl) {
                await userApis.updateUser(user.id, {
                    avatar_url: imageUrl,
                });
                updateUser({
                    avatar_url: imageUrl,
                })
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleOpenMessage = async () => {
        if (!profile) return;

        try {
            let room = await roomApis.getRoomPrivate(user.id, profile.id);

            if (!room) {
                room = await roomApis.createRoom([user.id, profile.id], 'private');
            }

            navigate(`/inbox/${room.id}`);
        } catch (error) {
            console.log(error);
        }
    };

    // console.log(profile);

    return (
        <div className="size-full py-10 sm:profile-width sm:p-5 m-auto pt-10">
            {!profiltState && !profile ? (
                <Loading />
            ) : (
                <>
                    <header className="grid grid-cols-[150px_1fr] sm:grid-cols-[1fr_2fr] max-sm:gap-3  sm:pb-5">
                        <section className="flex-center sm:row-span-3 sm:py-5">
                            <button>
                                <Avatar
                                    className="w-[100px] h-[100px] sm:w-[150px] sm:h-[150px]"
                                    onClick={() => {
                                        if (profile?.id !== user.id) return;

                                        avatarInputRef.current?.showPicker();
                                    }}
                                >
                                    <AvatarImage src={profile?.avatar_url} className="object-cover" />
                                    <AvatarFallback>{profile?.username}</AvatarFallback>
                                    <input
                                        ref={avatarInputRef}
                                        accept="image/*"
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => handleChangeAvatar(e)}
                                    />
                                </Avatar>
                            </button>
                        </section>

                        <section className="text-[20px] flex max-sm:flex-col max-sm:items-start gap-5 items-center">
                            <span>{profile?.username}</span>
                            {profiltState === 'self' ? (
                                <div className="flex itemx-center gap-2">
                                    <Button variant={'secondary'} onClick={() => navigate('/accounts/edit')}>
                                        Edit profile
                                    </Button>
                                    <button>
                                        <Settings2 />
                                    </button>
                                </div>
                            ) : (
                                <div className="space-x-4">
                                    {relation?.relation === 'following' && (
                                        <Button
                                            variant={'secondary'}
                                            onClick={async () => {
                                                if (!profile) return;

                                                try {
                                                    await userApis.removeRelation(user.id, profile?.id);
                                                    setRefresh(!refresh);
                                                } catch (error) {
                                                    console.log(error);
                                                }
                                            }}
                                        >
                                            Following
                                        </Button>
                                    )}
                                    {relation?.relation === 'none' && (
                                        <Button
                                            variant={'secondary'}
                                            onClick={async () => {
                                                if (!profile) return;

                                                try {
                                                    await userApis.addRelation(user.id, profile?.id);
                                                    setRefresh(!refresh);
                                                } catch (error) {
                                                    console.log(error);
                                                }
                                            }}
                                            className="bg-blue-500 hover:bg-blue-400 text-white"
                                        >
                                            Follow
                                        </Button>
                                    )}
                                    <Button variant={'secondary'} onClick={handleOpenMessage}>
                                        Message
                                    </Button>
                                </div>
                            )}
                        </section>

                        <section className="flex sm:gap-5 max-sm:justify-evenly py-3 max-sm:border-t-2 max-sm:col-span-2 max-sm:row-start-5 max-sm:row-end--1">
                            <button className="cursor-text">
                                <span className="font-bold">{profile?.posts} </span>
                                posts
                            </button>
                            <button onClick={() => setOpenFollowers(true)}>
                                <span className="font-bold">{profile?.followers} </span>
                                followers
                            </button>
                            <button onClick={() => setOpenFollowing(true)}>
                                <span className="font-bold">{profile?.following} </span>
                                following
                            </button>
                        </section>

                        <section className="max-sm:pl-5">
                            <div className="font-semibold">{profile?.name}</div>
                            <p>{profile?.bio}</p>
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
            {openFollowers && (
                <RelationDialog
                    type="followers"
                    userId={profile?.id}
                    setOpenDialog={setOpenFollowers}
                    profiltState={profiltState}
                />
            )}
            {openFollowing && (
                <RelationDialog
                    type="following"
                    userId={profile?.id}
                    setOpenDialog={setOpenFollowing}
                    profiltState={profiltState}
                />
            )}
        </div>
    );
};
