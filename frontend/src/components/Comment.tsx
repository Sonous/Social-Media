import commentApis from '@/apis/comment.api';
import useTokenStore from '@/store/useTokenStore';
import { formatDate } from '@/utils/formatDate';
import _ from 'lodash';
import { Ellipsis, Heart } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import CustomAvatar from './CustomAvatar';
import CustomInput from './CustomInput';

const Comment = ({
    comment,
    postedComments = [],
    setCommentInput,
    setMentions,
    setParentCommentId,
    modifyChildren,
    parentComment,
    setParentComents = () => {},
}: {
    comment: CustomComment;
    postedComments?: CustomComment[];
    setCommentInput: React.Dispatch<React.SetStateAction<string>>;
    setMentions: React.Dispatch<React.SetStateAction<Mention[]>>;
    setParentCommentId: React.Dispatch<React.SetStateAction<string>>;
    modifyChildren?: React.Dispatch<React.SetStateAction<CustomComment[]>>;
    parentComment?: CustomComment;
    setParentComents?: React.Dispatch<React.SetStateAction<CustomComment[]>>;
}) => {
    const [isLike, setIsLike] = useState(false);
    const [childComments, setChildComments] = useState<CustomComment[]>(postedComments);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false);
    const deleteRef = useRef<HTMLDivElement | null>(null);
    const user = useTokenStore(state => state.user as User);
    const navigate = useNavigate();

    const handleCloseModal = (event: React.MouseEvent) => {
        if (deleteRef.current && !deleteRef.current.contains(event.target as Node)) {
            setOpen(false);
        }
    };

    useEffect(() => {
        postedComments.forEach((item) => {
            if (item.parent_comment_id === comment.id && !childComments.some((child) => child.id === item.id)) {
                setChildComments((prev) => [item, ...prev]);
            }
        });
    }, [postedComments]);

    const handleFetchChildComment = async () => {
        try {
            setIsLoading(true);
            const data = await commentApis.getChildComments(comment.id, page);
            const rawChildComments = [...childComments, ...data];

            const uniqueArr = rawChildComments.filter(
                (obj, index, self) => index === self.findIndex((o) => _.isEqual(o, obj)),
            );

            setChildComments(uniqueArr);
            setPage(page + 1);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReply = () => {
        setCommentInput((prev) => prev.concat(`@[${comment.user.username}](${comment.user_id}) `));
        setMentions((prev) => [
            ...prev,
            {
                user_id: comment.user_id,
                username: comment.user.username,
            },
        ]);
        setParentCommentId(comment.parent_comment_id ?? comment.id);
    };

    return (
        <>
            <div>
                <div className="flex gap-5">
                    <CustomAvatar
                        className="cursor-pointer"
                        username={comment.user.username}
                        avatar_url={comment.user.avatar_url}
                        onClick={() => {
                            navigate(`/${comment.user.username}`);
                        }}
                    />

                    <div className="flex-1 space-y-2">
                        <div>
                            <p
                                className="font-semibold cursor-pointer"
                                onClick={() => {
                                    navigate(`/${comment.user.username}`);
                                }}
                            >
                                {comment.user.username}
                            </p>
                            <CustomInput symbolTrigger="@" inputValue={comment.content} type="text" />
                        </div>

                        <div className="flex gap-3">
                            <p className="text-[#898989] text-sm">{formatDate(comment.created_at)}</p>
                            <button className="text-[#898989] text-sm font-medium" onClick={handleReply}>
                                Reply
                            </button>
                            {comment.user_id === user.id && (
                                <div className="cursor-pointer" onClick={() => setOpen(true)}>
                                    <Ellipsis color="#898989" size={20} />
                                </div>
                            )}
                        </div>
                    </div>

                    <Heart
                        size={20}
                        fill={isLike ? 'red' : 'white'}
                        className="cursor-pointer"
                        onClick={() => {
                            setIsLike(!isLike);
                        }}
                    />
                </div>

                {!comment.parent_comment_id && comment.childAmount > 0 && (
                    <div className="ml-[60px] mt-5 space-y-3">
                        {childComments.length > 0 && (
                            <div className="space-y-5">
                                {childComments.map((child) => (
                                    <Comment
                                        key={child.id}
                                        comment={child}
                                        setCommentInput={setCommentInput}
                                        setMentions={setMentions}
                                        setParentCommentId={setParentCommentId}
                                        modifyChildren={setChildComments}
                                        parentComment={comment}
                                    />
                                ))}
                            </div>
                        )}

                        {!isLoading ? (
                            <button
                                onClick={() => {
                                    if (comment.childAmount > childComments.length) {
                                        handleFetchChildComment();
                                    } else {
                                        setChildComments([]);
                                        setPage(1);
                                    }
                                }}
                            >
                                <div className="inline-block align-middle mr-4 border-b-[1px] border-[#898989] w-[30px]"></div>
                                <span className="text-sm text-[#898989] font-medium">
                                    {comment.childAmount <= childComments.length
                                        ? 'Hide comments'
                                        : `View replies (${comment.childAmount - childComments.length})`}
                                </span>
                            </button>
                        ) : (
                            <span className="text-sm text-[#898989] font-medium">Loading...</span>
                        )}
                    </div>
                )}
            </div>

            {open && (
                <div
                    className="absolute bg-black top-0 left-0 bg-opacity-50 h-svh w-full flex-center z-40 !m-0"
                    onClick={handleCloseModal}
                >
                    <div ref={deleteRef} className="max-w-[400px] w-full bg-white rounded-xl">
                        <div
                            className="p-3 text-center border-b-[1px] text-red-500 font-medium cursor-pointer"
                            onClick={async () => {
                                try {
                                    await commentApis.removeComment(comment.id);

                                    if (!modifyChildren || !parentComment) {
                                        setParentComents((prev) => prev.filter((item) => item.id != comment.id));
                                    } else {
                                        modifyChildren((prev) => prev.filter((item) => item.id != comment.id));
                                        parentComment.childAmount -= 1;
                                    }
                                } catch (error) {
                                    console.log(error);
                                } finally {
                                    setOpen(false);
                                }
                            }}
                        >
                            Delete
                        </div>
                        <div onClick={() => setOpen(false)} className="p-3 text-center cursor-pointer">
                            Cancel
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Comment;
