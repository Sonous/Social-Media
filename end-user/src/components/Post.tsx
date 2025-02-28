import { PostModalContext } from '@/context/PostModalProvider';
import React, { useContext, useEffect, useRef, useState } from 'react';
import MediasCarousel from './create_post/MediasCarousel';
import userApis from '@/apis/users.api';
import { Bookmark, CirclePlus, Heart, MessageCircle, Settings2 } from 'lucide-react';
import classNames from 'classnames';
import { formatDate } from '@/utils/formatDate';
import CustomAvatar from './CustomAvatar';
import { useAppSelector } from '@/hooks/reduxHooks';
import { selectUser } from '@/store/slices/UserSlice';
import postApis from '@/apis/posts.api';
import savedApis from '@/apis/saved.api';
import useDebounce from '@/hooks/useDebounce';
import CustomInput from './CustomInput';
import commentApis from '@/apis/comment.api';
import Comment from './Comment';
import { extractMentions } from '@/utils/extractMentions';
import _ from 'lodash';
import { useNavigate } from 'react-router';

const Post = ({ type, post }: { type: 'simple' | 'normal' | 'modal'; post: Post }) => {
    const postRef = useRef<HTMLDivElement | null>(null);
    const { setIsOpenPostModal, setPost } = useContext(PostModalContext);
    const [currentWorkPost, setCurrentWorkPost] = useState(post);
    const [postOwner, setPostOwner] = useState<User>();
    const [isLike, setIsLike] = useState(false);
    const [isMark, setIsMark] = useState(false);
    const [commentInput, setCommentInput] = useState('');
    const [firstMount, setFirstMount] = useState(true);
    const [comments, setComments] = useState<CustomComment[]>([]);
    const [mentions, setMentions] = useState<Mention[]>([]);
    const [parentCommentId, setParentCommentId] = useState('');
    // const [refresh, setRefresh] = useState(false);
    const navigate = useNavigate();
    const [showPlusButton, setShowPlusButton] = useState<boolean | undefined>();
    const [page, setPage] = useState(1);
    const [recentComments, setRecentComments] = useState<CustomComment[]>([]);
    const user = useAppSelector(selectUser);

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
            console.log();
            setIsOpenPostModal(false);
        }
    };

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

    // like process
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

    // Get parent comment of post
    useEffect(() => {
        if (type === 'modal') {
            fetchParentComment();
        }

        async function fetchParentComment() {
            try {
                const { comments, quantity, totalPage } = await commentApis.getParentComments(post.id, page);

                if (totalPage > page) setShowPlusButton(true);
                else setShowPlusButton(false);

                setComments((prev) => {
                    const rawComments = [...prev, ...comments];

                    const uniqueArr = rawComments.filter(
                        (obj, index, self) => index === self.findIndex((o) => _.isEqual(o, obj)),
                    );

                    return uniqueArr;
                });
            } catch (error) {
                console.log(error);
            }
        }
    }, [type, page]);

    // console.log(post)
    const handlePostComment = async () => {
        try {
            const comment: Partial<CustomComment> = {
                content: commentInput,
                post_id: post.id,
                user_id: user.id,
            };

            if (mentions.length > 0 && parentCommentId) {
                comment.mentions = mentions;
                comment.parent_comment_id = parentCommentId;
            }

            const { data } = await commentApis.addComment(comment);
            delete data.childAmount;

            if (!parentCommentId) {
                setComments((prev) => [data, ...prev]);
            } else {
                const { data: parentComment } = await commentApis.getCommentById(data.parent_comment_id);
                setComments((prev) =>
                    prev.map((item) => {
                        if (item.id === parentComment.id) {
                            return parentComment;
                        } else return item;
                    }),
                );
                setRecentComments((prev) => [...prev, data]);
            }
            setCommentInput('');
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (mentions.length > 0) {
            const inputtMentions = extractMentions(commentInput);

            const checkMentions = mentions.filter((mention) =>
                inputtMentions.some((item) => item.id === mention.user_id),
            );

            setMentions(checkMentions);
        } else {
            setParentCommentId('');
        }
    }, [commentInput]);

    return (
        <>
            {type !== 'simple' && postOwner && (
                <div
                    className={classNames({
                        'absolute bg-black top-0 right-0 bg-opacity-50 h-svh w-full flex-center z-30': type === 'modal',
                    })}
                    onClick={handleCloseModal}
                >
                    <div
                        ref={postRef}
                        className={classNames('w-full h-full flex flex-col bg-white mx-5', {
                            'max-w-[600px] max-h-[500px] lg:max-w-[650px] lg:max-h-[650px] !ml-16': type === 'modal',
                            'max-w-[400px] md:max-w-[600px] lg:max-w-[700px]': type === 'normal',
                        })}
                    >
                        <div className="flex-1 w-full h-full overflow-y-auto p-3 space-y-3">
                            <header className="flex justify-between items-center">
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
                                    <Settings2 strokeWidth={1} />
                                </div>
                            </header>

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
                                                if (type === 'normal') {
                                                    setPost(post);
                                                    setIsOpenPostModal(true);
                                                }
                                            }}
                                        />
                                        <p>{currentWorkPost.commentAmount}</p>
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
                                <>
                                    <section className="space-y-5">
                                        {comments.map((comment) => (
                                            <Comment
                                                key={comment.id}
                                                comment={comment}
                                                setCommentInput={setCommentInput}
                                                setMentions={setMentions}
                                                setParentCommentId={setParentCommentId}
                                                postedComments={recentComments}
                                                setParentComents={setComments}
                                                setShowModal={setIsOpenPostModal}
                                            />
                                        ))}
                                    </section>
                                    <>
                                        {showPlusButton && (
                                            <div className="p-5 flex-center">
                                                <CirclePlus
                                                    className="cursor-pointer"
                                                    onClick={() => setPage((prev) => prev + 1)}
                                                />
                                            </div>
                                        )}
                                    </>
                                </>
                            )}
                        </div>

                        {type === 'modal' && (
                            <section className="w-full p-3 bg-white flex items-center gap-3">
                                <CustomInput
                                    symbolTrigger="@"
                                    inputValue={commentInput}
                                    setInputValue={setCommentInput}
                                    type="input"
                                />
                                <div
                                    className={classNames('text-blue-500 font-bold', {
                                        'cursor-pointer hover:text-blue-700': commentInput,
                                        'cursor-not-allowed text-blue-300': !commentInput,
                                    })}
                                    onClick={handlePostComment}
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
