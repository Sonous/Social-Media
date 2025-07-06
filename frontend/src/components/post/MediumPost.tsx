import postApis from '@/apis/posts.api';
import savedApis from '@/apis/saved.api';
import userApis from '@/apis/users.api';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import useDebounce from '@/hooks/useDebounce';
import useTokenStore from '@/store/useTokenStore';
import { formatDate } from '@/utils/formatDate';
import { Bookmark, Ellipsis, Heart, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import CustomAvatar from '../CustomAvatar';
import CustomInput from '../CustomInput';
import MediasCarousel from '../create_post/MediasCarousel';
import PostModal from './PostModal';

export default function MediumPost({
    children,
    post,
    className,
    type = 'none',
}: {
    children?: React.ReactNode;
    post: Post;
    type?: 'full' | 'none';
    className?: string;
}) {
    const [postOwner, setPostOwner] = useState<User>();
    const [currentWorkPost, setCurrentWorkPost] = useState(post);
    const [isLike, setIsLike] = useState(false);
    const [isMark, setIsMark] = useState(false);
    const [firstMount, setFirstMount] = useState(true);
    const [isOpenPostModal, setIsOpenPostModal] = useState(false);
    const user = useTokenStore((state) => state.user as User);
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        fetchPostInfo();

        async function fetchPostInfo() {
            try {
                if (!post) return;

                const { data: owner } = await userApis.getUserById(post?.user_id);

                setPostOwner(owner);
            } catch (error) {
                console.log(error);
            }
        }
    }, [post]);

    // check like and saved
    useEffect(() => {
        const checkInteraction = async () => {
            try {
                const { data: likeState } = await postApis.checkInteraction(post.id, user.id);
                const { data: savedState } = await savedApis.checkSavedPost(post.id, user.id);

                if (likeState.isExists) {
                    setIsLike(true);
                } else {
                    setIsLike(false);
                }

                if (savedState.isExists) {
                    setIsMark(true);
                } else {
                    setIsMark(false);
                }

                setTimeout(() => setFirstMount(false), 1000);
            } catch (error) {
                console.log('check interaction fail', error);
            }
        };

        checkInteraction();
    }, [user, post]);

    // like process
    const likeDebounce = useDebounce(isLike, 500);

    useEffect(() => {
        if (firstMount) {
            return;
        }

        if (isLike) addInteraction();
        else removeInteraction();

        async function addInteraction() {
            try {
                await postApis.addInteraction(post.id, user.id);
            } catch (error) {
                console.log(error);
            }
        }

        async function removeInteraction() {
            try {
                await postApis.removeInteraction(post.id, user.id);
            } catch (error) {
                console.log(error);
            }
        }
    }, [likeDebounce]);

    // saved process
    const savedDebounce = useDebounce(isMark, 500);

    useEffect(() => {
        if (firstMount) {
            return;
        }

        if (isMark) addSavedPost();
        else removeSavedPost();

        async function addSavedPost() {
            try {
                await savedApis.addSavedPost(post.id, user.id);
            } catch (error) {
                console.log(error);
            }
        }

        async function removeSavedPost() {
            try {
                await savedApis.removeSavedPost(post.id, user.id);
            } catch (error) {
                console.log(error);
            }
        }
    }, [savedDebounce]);

    return (
        <>
            {postOwner && (
                <div className={`w-full h-full flex flex-col bg-white ${className}`}>
                    <div className="flex-1 w-full h-full overflow-y-auto p-3 space-y-3">
                        <div className="flex justify-between items-center">
                            <div className="flex gap-3 items-center">
                                <CustomAvatar
                                    className="cursor-pointer"
                                    avatar_url={postOwner.avatar_url}
                                    username={postOwner.username}
                                    onClick={() => navigate(`/${postOwner.username}`)}
                                />
                                <div className="">
                                    <h1
                                        className="font-medium cursor-pointer"
                                        onClick={() => navigate(`/${postOwner.username}`)}
                                    >
                                        {postOwner?.username}
                                    </h1>
                                    <p className="text-sm">{formatDate(post.created_at)}</p>
                                </div>
                            </div>
                            <div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <Ellipsis size={20} color="#000000" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem
                                            onClick={() => {
                                                navigate(`/${postOwner.username}`);
                                            }}
                                        >
                                            About this account
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>Go to post</DropdownMenuItem>
                                        {post.user_id === user.id && (
                                            <DropdownMenuItem
                                                onClick={async () => {
                                                    try {
                                                        await postApis.deletePost(post.id);

                                                        toast({
                                                            title: 'Delete post successfully',
                                                        });
                                                    } catch (error) {
                                                        console.log('Delete post error:', error);
                                                    }
                                                }}
                                            >
                                                Delete post
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        <section>
                            <CustomInput symbolTrigger="#" inputValue={post.content} type="text" />
                        </section>
                        <MediasCarousel medias={post?.medias || []} className="rounded-lg h-full w-full" />

                        <section className="flex justify-between py-3 border-b-2">
                            <div className="flex gap-3">
                                <div className="flex items-center gap-1">
                                    <Heart
                                        fill={isLike ? 'red' : 'white'}
                                        className="cursor-pointer"
                                        onClick={() => {
                                            if (isLike) {
                                                setCurrentWorkPost((prev) => ({
                                                    ...prev,
                                                    likeAmount: prev.likeAmount - 1,
                                                }));
                                            } else {
                                                setCurrentWorkPost((prev) => ({
                                                    ...prev,
                                                    likeAmount: prev.likeAmount + 1,
                                                }));
                                            }
                                            setIsLike(!isLike);
                                        }}
                                    />
                                    <p>{currentWorkPost.likeAmount}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MessageCircle
                                        className="cursor-pointer"
                                        onClick={() => {
                                            if (type === 'none') {
                                                setIsOpenPostModal(true);
                                            }
                                        }}
                                    />
                                    <p>{currentWorkPost.commentAmount}</p>
                                    <PostModal post={post} isOpen={isOpenPostModal} setIsOpen={setIsOpenPostModal} />
                                </div>
                            </div>
                            <Bookmark
                                fill={isMark ? 'black' : 'white'}
                                className="cursor-pointer"
                                onClick={() => {
                                    setIsMark(!isMark);
                                }}
                            />
                        </section>

                        {children}
                    </div>
                </div>
            )}
        </>
    );
}
