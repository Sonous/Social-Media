import React, { useEffect, useRef } from 'react';
import { Loading } from '../Loading';
import { useInView } from 'motion/react';
import SimplePost from './MiniPost';

const PostList = ({
    posts,
    isFetching,
    setIsVisible,
}: {
    posts: Post[];
    isFetching: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const loadingRef = useRef(null);
    const inView = useInView(loadingRef);
    // const { setIsOpenPostModal, setPost } = useContext(PostModalContext);

    useEffect(() => {
        setIsVisible(inView);
    }, [inView]);

    return (
        <>
            {posts.length > 0 && (
                <div className="grid grid-cols-3 gap-2 px-2">
                    {posts.map((post) => (
                        <SimplePost key={post.id} post={post} />
                    ))}
                </div>
            )}
            {isFetching && (
                <div ref={loadingRef} className="my-10">
                    <Loading />
                </div>
            )}
        </>
    );
};

export default PostList;
