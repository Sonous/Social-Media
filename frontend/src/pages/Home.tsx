import postApis from '@/apis/posts.api';
import MediumPost from '@/components/post/MediumPost';
import { CirclePlus } from 'lucide-react';
import { useEffect, useState } from 'react';

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
                <MediumPost key={index} post={post} className="max-w-[400px] md:max-w-[600px] lg:max-w-[700px]" />
            ))}

            {showPlusButton && (
                <div className="p-5">
                    <CirclePlus className="cursor-pointer" onClick={fetchPosts} />
                </div>
            )}
        </div>
    );
}

export default Home;
