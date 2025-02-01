import userApis from '@/apis/users';
import { Loading } from '@/components/Loading';
import PostList from '@/components/PostList';
import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router';

const Posts = () => {
    const { profiltState, profile } = useOutletContext<ProfileContext>();
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        if (profile) {
            fetchPosts();
        }

        async function fetchPosts() {
            try {
                const { data: posts } = await userApis.getUserPosts(profile.id);

                setPosts(posts);
            } catch (error) {
                console.log(error);
            }
        }
    }, [profile]);

    return (
        <PostList posts={posts} />
    );
};

export default Posts;
