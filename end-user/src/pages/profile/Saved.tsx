import userApis from '@/apis/users';
import { Loading } from '@/components/Loading';
import PostList from '@/components/PostList';
import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router';

const Saved = () => {
    const { profiltState, profile } = useOutletContext<ProfileContext>();
    const [savedPosts, setSavedPosts] = useState<Post[]>([]);

    useEffect(() => {
        if (profile) {
            fetchPosts();
        }

        async function fetchPosts() {
            try {
                const { data: posts } = await userApis.getSavedPosts(profile.id);

                setSavedPosts(posts);
            } catch (error) {
                console.log(error);
            }
        }
    }, [profile]);

    return (
        <PostList posts={savedPosts} />
    );
};

export default Saved;
