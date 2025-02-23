import React, { useEffect, useState } from 'react';
import postApis from '@/apis/posts.api';
import Post from '@/components/Post';
import { useAppSelector } from '@/hooks/reduxHooks';
import { selectUser } from '@/store/slices/UserSlice';
import { CirclePlus } from 'lucide-react';
import { uniqueArr } from '@/utils/uniqueArr';

function Home() {
    const [posts, setPosts] = useState<Post[]>([]);
    const user = useAppSelector(selectUser);
    const [page, setPage] = useState(1);
    const [showPlusButton, setShowPlusButton] = useState<boolean | undefined>();

    useEffect(() => {
        fetchPosts();

        async function fetchPosts() {
            try {
                const {
                    data: { posts: fetchingPosts, quantity, totalPage },
                } = await postApis.getAllPosts(page);

                console.log(fetchingPosts)

                if (totalPage > page) setShowPlusButton(true);
                else setShowPlusButton(false);

                const newPosts = [...posts, ...fetchingPosts];

                setPosts(uniqueArr(newPosts));
            } catch (error) {
                console.log(error);
            }
        }
    }, [page]);

    return (
        <div className="flex-center flex-col gap-5">
            {posts.map((post, index) => (
                <Post key={index} type="normal" post={post} />
            ))}
            
            {showPlusButton && (
                <div className="p-5">
                    <CirclePlus className='cursor-pointer' onClick={() => setPage((prev) => prev + 1)} />
                </div>
            )}
        </div>
    );
}

export default Home;
