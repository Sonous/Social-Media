import { Button } from '@/components/ui/button';
import React, { useCallback, useEffect, useState } from 'react';
import { motion, useAnimate } from 'motion/react';
import postApis from '@/apis/posts.api';
import Post from '@/components/Post';
import { useAppSelector } from '@/hooks/reduxHooks';
import { selectUser } from '@/store/slices/UserSlice';

function Home() {
    const [posts, setPosts] = useState([]);
    const user = useAppSelector(selectUser);

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

    console.log(user)

    return (
        <div className='flex-center flex-col gap-5'>
            {posts.map((post, index) => (
                <Post key={index} type='normal' post={post} />
            ))}
        </div>
    );
}

export default Home;
