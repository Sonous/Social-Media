import commentApis from '@/apis/comment.api';
import { extractMentions } from '@/utils/extractMentions';
import classNames from 'classnames';
import { CirclePlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import Comment from '../Comment';
import CustomInput from '../CustomInput';
import MediumPost from './MediumPost';
import _ from 'lodash';
import useTokenStore from '@/store/useTokenStore';

export default function FullPost({ post, type }: { post: Post; type: 'modal' | 'none' }) {
    const [commentInput, setCommentInput] = useState('');
    const [comments, setComments] = useState<CustomComment[]>([]);
    const [mentions, setMentions] = useState<Mention[]>([]);
    const [parentCommentId, setParentCommentId] = useState('');
    const [showPlusButton, setShowPlusButton] = useState<boolean | undefined>();
    const [page, setPage] = useState(1);
    const [recentComments, setRecentComments] = useState<CustomComment[]>([]);
    const user = useTokenStore((state) => state.user as User);

    // Get parent comment of post
    useEffect(() => {
        fetchParentComment();

        async function fetchParentComment() {
            try {
                const { comments, totalPage } = await commentApis.getParentComments(post.id, page);

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
                console.log('error', error);
            }
        }
    }, [page]);

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
        <div className={` flex flex-col h-full ${type === 'none' ? 'w-[600px]' : ''}`}>
            <MediumPost
                post={post}
                className={`${type === 'modal' ? 'h-[300px] md:h-[400px] lg:h-[500px]' : 'flex-1'}`}
                type="full"
            >
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
                        />
                    ))}
                </section>
                {showPlusButton && (
                    <div className="p-5 flex-center">
                        <CirclePlus className="cursor-pointer" onClick={() => setPage((prev) => prev + 1)} />
                    </div>
                )}
            </MediumPost>
            <section className="w-full p-3 bg-white flex items-center gap-3">
                <CustomInput symbolTrigger="@" inputValue={commentInput} setInputValue={setCommentInput} type="input" />
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
        </div>
    );
}
