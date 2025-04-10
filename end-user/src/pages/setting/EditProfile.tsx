import cloudinaryAPI from '@/apis/cloudinary.api';
import userApis from '@/apis/users.api';
import CustomAvatar from '@/components/CustomAvatar';
import { Loading } from '@/components/Loading';
import { Button } from '@/components/ui/button';
import useTokenStore from '@/store/useTokenStore';
import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';

const EditProfile = () => {
    const { updateUser, user } = useTokenStore();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [bio, setBio] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleUploadPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || !user) return;
        const avatar = event.target.files[0];

        try {
            const imageUrl = await cloudinaryAPI.uploadImage(user.id, 'avatars', avatar);

            if (imageUrl) {
                await userApis.updateUser(user.id, {
                    avatar_url: imageUrl,
                });
                updateUser({
                    avatar_url: imageUrl,
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdateUser = async () => {
        if (!user) return;

        try {
            setIsLoading(true);
            await userApis.updateUser(user.id, {
                bio,
            });

            updateUser({
                bio,
            });

            toast('Update success!');
            setBio('');
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center flex-1">
            <div className="p-10 max-w-[600px] w-full space-y-5">
                <h1 className="text-lg font-semibold">Edit Profile</h1>

                <div className="flex items-center flex-wrap gap-5 bg-[#e4e4e4] rounded-xl p-3">
                    {user && (
                        <>
                            <CustomAvatar avatar_url={user.avatar_url} username={user.username} />
                            <div className="flex flex-col justify-center flex-1">
                                <h1 className="text-lg font-semibold">{user.username}</h1>
                                <h1 className="text-[#898989] text-sm">{user.name}</h1>
                            </div>
                        </>
                    )}
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

                <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleUpdateUser}>
                    Submit
                </Button>
            </div>
            {isLoading && <Loading state="full" />}
        </div>
    );
};

export default EditProfile;
