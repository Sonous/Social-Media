import { Button } from '@/components/ui/button';
import React, { useCallback, useEffect, useState } from 'react';
import { motion, useAnimate } from 'motion/react';
import postApis from '@/apis/posts.api';
import Post from '@/components/Post';

function Home() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetchPosts();

        async function fetchPosts() {
            try {
                const { data } = await postApis.getAllPosts(1);

                setPosts(data);
            } catch (error) {
                console.log(error);
            }
        }
    }, []);

    console.log(posts);

    return <div>
        {/* {posts.map(post => (
            <Post key={post.id} post={post} />
        ))} */}
    </div>;
}

export default Home;
