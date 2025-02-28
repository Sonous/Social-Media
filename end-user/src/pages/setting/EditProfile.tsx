import userApis from '@/apis/users.api';
import CustomAvatar from '@/components/CustomAvatar';
import { Loading } from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { selectUser, updateUser } from '@/store/slices/UserSlice';
import supabase from '@/utils/supabase';
import React, { useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

const EditProfile = () => {
    const user = useAppSelector(selectUser);
    const dispatch = useAppDispatch();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [bio, setBio] = useState('');
    const [isLoading, setIsLoading] = useState(false)

    const handleUploadPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;
        const avatar = event.target.files[0];

        try {
            const { data } = await supabase.storage.from('avatars').upload(`/${user.id}/${avatar.name}`, avatar, {
                upsert: true,
            });

            if (data) {
                const {
                    data: { publicUrl },
                } = supabase.storage.from('avatars').getPublicUrl(data?.path);

                await userApis.updateUser(user.id, {
                    avatar_url: publicUrl,
                });
                dispatch(
                    updateUser({
                        avatar_url: publicUrl,
                    }),
                );
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdateUser = async () => {
        try {
            setIsLoading(true)
            await userApis.updateUser(user.id, {
                bio
            })

            dispatch(
                updateUser({
                    bio
                }),
            );

            toast('Update success!')
            setBio('')
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex justify-center flex-1">
            <div className="p-10 max-w-[600px] w-full space-y-5">
                <h1 className="text-lg font-semibold">Edit Profile</h1>

                <div className="flex items-center flex-wrap gap-5 bg-[#e4e4e4] rounded-xl p-3">
                    <CustomAvatar avatar_url={user.avatar_url} username={user.username} />
                    <div className="flex flex-col justify-center flex-1">
                        <h1 className="text-lg font-semibold">{user.username}</h1>
                        <h1 className="text-[#898989] text-sm">{user.name}</h1>
                    </div>
                    <Button
                        className="bg-blue-500 hover:bg-blue-600"
                        onClick={() => {
                            inputRef.current?.showPicker();
                        }}
                    >
                        Change photo
                    </Button>
                    <input ref={inputRef} type="file" className="hidden" onChange={handleUploadPhoto} />
                </div>

                <div className="relative">
                    <h1 className="font-semibold pb-3">Bio</h1>
                    <textarea
                        placeholder="Bio"
                        className="resize-none outline-none border-2 rounded-lg w-full p-3"
                        value={bio}
                        onChange={(e) => {
                            const input = e.target.value;
                            if (input.length > 150) return;
                            setBio(input);
                        }}
                    ></textarea>
                    <p className="absolute right-3 bottom-3 text-sm text-[#898989]">{bio.length} / 150</p>
                </div>

                <Button className='bg-blue-500 hover:bg-blue-600' onClick={handleUpdateUser}>
                    Submit
                </Button>
            </div>
            {isLoading && <Loading state='full' />}
        </div>
    );
};

export default EditProfile;
