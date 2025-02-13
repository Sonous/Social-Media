import { PostModalContext } from '@/context/PostModalProvider';
import React, { useContext, useEffect, useRef, useState } from 'react';
import MediasCarousel from './create_post/MediasCarousel';
import userApis from '@/apis/users.api';
import { Bookmark, Heart, MessageCircle, Settings2, Share2 } from 'lucide-react';
import classNames from 'classnames';
import { Mention, MentionsInput } from 'react-mentions';
import defaultMentionStyle from './create_post/edit_post/defaultMentionStyle';
import { formatDate } from '@/utils/formatDate';
import CustomAvatar from './CustomAvatar';

const Post = ({ type, post }: { type: 'simple' | 'normal' | 'modal'; post: Post }) => {
    const postRef = useRef<HTMLDivElement | null>(null);
    const { setIsOpenPostModal, setPost } = useContext(PostModalContext);
    const [postOwner, setPostOwner] = useState<User>();
    const [isLike, setIsLike] = useState(false);
    const [isMark, setIsMark] = useState(false);
    const [commentInput, setCommentInput] = useState('');

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
            {type !== 'simple' && postOwner && (
                <div
                    className={classNames({
                        'absolute bg-black top-0 left-0 bg-opacity-50 h-svh w-full flex-center': type === 'modal',
                    })}
                    onClick={handleCloseModal}
                >
                    <div
                        ref={postRef}
                        className={classNames('w-full h-full flex flex-col bg-white mx-10', {
                            'max-w-[700px] max-h-[500px] lg:max-w-[700px] lg:max-h-[650px] ': type === 'modal',
                            'max-w-[700px] lg:max-w-[700px]': type === 'normal',
                        })}
                    >
                        <div className="flex-1 w-full h-full overflow-y-auto p-3 space-y-3">
                            <header className="flex justify-between items-center">
                                <div className="flex gap-3 items-center">
                                    <CustomAvatar avatar_url={postOwner.avatar_url} username={postOwner.username}/>
                                    <div className="">
                                        <h1 className="font-medium">{postOwner?.username}</h1>
                                        <p className="text-sm">{formatDate(post.created_at)}</p>
                                    </div>
                                </div>
                                <div>
                                    <Settings2 strokeWidth={1} />
                                </div>
                            </header>

                            <section>
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
                            <MediasCarousel medias={post?.medias || []} className="rounded-lg h-full w-full" />

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
                                        <MessageCircle
                                            className="cursor-pointer"
                                            onClick={() => {
                                                if (type === 'normal') {
                                                    setPost(post);
                                                    setIsOpenPostModal(true);
                                                }
                                            }}
                                        />
                                        <p>0</p>
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

                            {type === 'modal' && (
                                <section className="bg-red-500">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure expedita, similique
                                    officia libero vel sint praesentium cupiditate. Asperiores dignissimos quia omnis
                                    aperiam officia error eos odit veritatis. Quibusdam, deserunt cupiditate? Lorem
                                    ipsum dolor sit amet consectetur adipisicing elit. Iure expedita, similique officia
                                    libero vel sint praesentium cupiditate. Asperiores dignissimos quia omnis aperiam
                                    officia error eos odit veritatis. Quibusdam, deserunt cupiditate? Lorem ipsum dolor
                                    sit amet consectetur adipisicing elit. Iure expedita, similique officia libero vel
                                    sint praesentium cupiditate. Asperiores dignissimos quia omnis aperiam officia error
                                    eos odit veritatis. Quibusdam, deserunt cupiditate? Lorem ipsum dolor sit amet
                                    consectetur adipisicing elit. Iure expedita, similique officia libero vel sint
                                    praesentium cupiditate. Asperiores dignissimos quia omnis aperiam officia error eos
                                    odit veritatis. Quibusdam, deserunt cupiditate? Lorem ipsum dolor sit amet
                                    consectetur adipisicing elit. Iure expedita, similique officia libero vel sint
                                    praesentium cupiditate. Asperiores dignissimos quia omnis aperiam officia error eos
                                    odit veritatis. Quibusdam, deserunt cupiditate? Lorem ipsum dolor sit amet
                                    consectetur adipisicing elit. Iure expedita, similique officia libero vel sint
                                    praesentium cupiditate. Asperiores dignissimos quia omnis aperiam officia error eos
                                    odit veritatis. Quibusdam, deserunt cupiditate?
                                </section>
                            )}
                        </div>

                        {type === 'modal' && (
                            <section className="w-full p-3 bg-white flex items-center gap-3">
                                <input
                                    value={commentInput}
                                    onChange={(e) => setCommentInput(e.target.value)}
                                    placeholder="Add a comment"
                                    className="w-full outline-none p-3 rounded-lg bg-[#ebebeb] caret-pink-500"
                                />
                                <div
                                    className={classNames('text-blue-500 font-bold', {
                                        'cursor-pointer hover:text-blue-700': commentInput,
                                        'cursor-not-allowed text-blue-300': !commentInput,
                                    })}
                                    onClick={() => console.log('jfsljk')}
                                >
                                    Post
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            )}

            {type === 'simple' && (
                <div
                    key={post.id}
                    className="cursor-pointer"
                    onClick={() => {
                        setPost(post);
                        setIsOpenPostModal(true);
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
