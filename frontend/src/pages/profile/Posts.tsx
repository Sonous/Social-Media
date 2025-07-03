import postApis from '@/apis/posts.api';
import PostList from '@/components/post/PostList';
import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router';

const Posts = () => {
    const { profile } = useOutletContext<ProfileContext>();
    const [posts, setPosts] = useState<Post[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isFetching, setIsFetching] = useState(true);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (profile && isVisible) {
            fetchPosts();
        }

        async function fetchPosts() {
            try {
                const {
                    data: { posts, totalPage },
                } = await postApis.getPostsByUserId(profile.id, currentPage);

                if (totalPage === 0 || currentPage === totalPage) {
                    setIsFetching(false);
                } else {
                    setCurrentPage((prev) => prev + 1);
                }

                setPosts((prev) => {
                    if (prev.some((item) => item.id === posts[0].id)) {
                        return prev;
                    } else {
                        return [...prev, ...posts];
                    }
                });
            } catch (error) {
                console.log(error);
            }
        }
    }, [profile, isVisible]);


    return <PostList posts={posts} isFetching={isFetching} setIsVisible={setIsVisible} />;
};

export default Posts;
