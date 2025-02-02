import React, { useEffect, useRef } from 'react';
import { Loading } from './Loading';

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

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            {
                threshold: 1,
            },
        );

        if (loadingRef.current) {
            observer.observe(loadingRef.current);
        }

        return () => {
            if (loadingRef.current) {
                observer.unobserve(loadingRef.current);
            }
        };
    }, [loadingRef]);

    return (
        <>
            {posts.length > 0 && (
                <div className="grid grid-cols-3 gap-2 px-2">
                    {posts.map((post) => (
                        <div key={post.id}>
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
