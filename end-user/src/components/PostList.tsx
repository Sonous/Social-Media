import React, { useContext, useEffect, useRef } from 'react';
import { Loading } from './Loading';
import { PostModalContext } from '@/context/PostModalProvider';
import Post from './Post';
import { useInView } from 'motion/react';

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
        console.log(inView)
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
                        <Post key={post.id} type="simple" post={post} />
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
