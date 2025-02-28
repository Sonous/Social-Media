import { useEffect, useState } from 'react';
import postApis from '@/apis/posts.api';
import Post from '@/components/Post';
import { CirclePlus } from 'lucide-react';

function Home() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const [showPlusButton, setShowPlusButton] = useState<boolean | undefined>();

    useEffect(() => {
        fetchPosts();
    }, []);

    async function fetchPosts() {
        try {
            const {
                data: { posts: fetchingPosts, totalPage },
            } = await postApis.getAllPosts(page);

            if (totalPage > page) setShowPlusButton(true);
            else setShowPlusButton(false);

            const newPosts = [...posts, ...fetchingPosts];

            setPosts(newPosts);
            setPage(page + 1);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="flex-center flex-col gap-5">
            {posts.map((post, index) => (
                <Post key={index} type="normal" post={post} />
            ))}
            
            {showPlusButton && (
                <div className="p-5">
                    <CirclePlus className='cursor-pointer' onClick={fetchPosts} />
                </div>
            )}
        </div>
    );
}

export default Home;
