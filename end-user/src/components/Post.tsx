import { PostModalContext } from '@/context/PostModalProvider';
import React, { useContext, useEffect, useRef, useState } from 'react';
import MediasCarousel from './create_post/MediasCarousel';
import userApis from '@/apis/users.api';
import { Bookmark, Heart, MessageCircle, Settings2, Share2 } from 'lucide-react';
import classNames from 'classnames';
import { Mention, MentionsInput } from 'react-mentions';
import defaultStyle from './create_post/edit_post/defaultStyle';
import defaultMentionStyle from './create_post/edit_post/defaultMentionStyle';
import { formatDate } from '@/utils/formatDate';

const Post = ({ type, post }: { type: 'simple' | 'normal' | 'modal'; post: Post }) => {
    const postRef = useRef<HTMLDivElement | null>(null);
    const { setIsOpenPostModal, setPost } = useContext(PostModalContext);
    const [postOwner, setPostOwner] = useState<User>();
    const [typeModification, setTypeModification] = useState(type);
    const [isLike, setIsLike] = useState(false);
    const [isMark, setIsMark] = useState(false);

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

    const handleCloseModal = (event: React.MouseEvent) => {
        if (postRef.current && !postRef.current.contains(event.target as Node)) {
            setIsOpenPostModal(false);
        }
    };

    return (
        <>
            {typeModification !== 'simple' && (
                <div
                    className={classNames({
                        'absolute bg-black bg-opacity-50 h-svh w-full flex-center': typeModification === 'modal',
                    })}
                    onClick={handleCloseModal}
                >
                    <div ref={postRef} className="max-w-[1000px] max-h-[650px] grid grid-cols-[1.2fr_1fr] bg-white">
                        <MediasCarousel medias={post?.medias || []} className="rounded-bl-lg h-[650px] w-full" />

                        <div className="relative">
                            <div className="px-3 pt-3 overflow-auto h-[590px]">
                                <header className="flex justify-between items-center">
                                    <div className="flex gap-3 items-center">
                                        <img
                                            src={postOwner?.avatar_url}
                                            alt="profile"
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div className="">
                                            <h1 className="font-medium">{postOwner?.username}</h1>
                                            <p className="text-sm">{formatDate(post.created_at)}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <Settings2 strokeWidth={1} />
                                    </div>
                                </header>

                                <section className="py-3 border-b-2">
                                    <MentionsInput
                                        value={post.content}
                                        // style={defaultStyle}
                                        disabled
                                    >
                                        <Mention
                                            trigger="#"
                                            data={[]}
                                            markup="#[__display__](__id__)"
                                            displayTransform={(id: string, display: string) => `#${display}`}
                                            style={defaultMentionStyle}
                                        />
                                    </MentionsInput>
                                </section>

                                <section className="flex justify-between py-3 border-b-2">
                                    <div className="flex gap-3">
                                        <div className="flex items-center gap-1">
                                            <Heart
                                                fill={isLike ? 'red' : 'white'}
                                                className="cursor-pointer"
                                                onClick={() => {
                                                    setIsLike(!isLike);
                                                }}
                                            />
                                            <p>0</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MessageCircle />
                                            <p>0</p>
                                        </div>
                                        {/* <div className='flex items-center gap-1'>
                                            <Share2 />
                                            <p>0</p>
                                        </div> */}
                                    </div>
                                    <Bookmark
                                        fill={isMark ? 'black' : 'white'}
                                        className="cursor-pointer"
                                        onClick={() => {
                                            setIsMark(!isMark);
                                        }}
                                    />
                                </section>

                                <section className="bg-red-500 h-[700px] overflow-auto"></section>
                            </div>

                            <section className="absolute bottom-0 w-full h-[60px] bg-black">
                                
                            </section>
                        </div>
                    </div>
                </div>
            )}

            {typeModification === 'simple' && (
                <div
                    key={post.id}
                    className="cursor-pointer"
                    onClick={() => {
                        setPost(post);
                        setIsOpenPostModal(true);
                        // setTypeModification('modal')
                    }}
                >
                    {post.medias[0].type === 'image' ? (
                        <img
                            src={post.medias[0].url}
                            className="max-h-[200px] md:max-h-[300px] h-full w-full object-cover"
                        />
                    ) : (
                        <video
                            src={post.medias[0].url}
                            className="max-h-[200px] md:max-h-[300px] h-full w-full object-cover"
                        />
                    )}
                </div>
            )}
        </>
    );
};

export default Post;
