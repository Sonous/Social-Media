import React, { useEffect, useRef } from 'react';
import { Loading } from '../Loading';
import Post from '../Post';
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

    // useEffect(() => {
    //     const observer = new IntersectionObserver(
    //         ([entry]) => {
    //             setIsVisible(entry.isIntersecting);
    //         },
    //         {
    //             threshold: 1,
    //         },
    //     );

    //     if (loadingRef.current) {
    //         observer.observe(loadingRef.current);
    //     }

    //     return () => {
    //         if (loadingRef.current) {
    //             observer.unobserve(loadingRef.current);
    //         }
    //     };
    // }, [loadingRef]);

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
