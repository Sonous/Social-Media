import React from 'react';
import { Loading } from './Loading';

const PostList = ({ posts }: { posts: Post[] }) => {
    return (
        <>
            {posts.length > 0 ? (
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
            ) : (
                <Loading />
            )}
        </>
    );
};

export default PostList;
