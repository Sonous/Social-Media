import savedApis from '@/apis/saved.api';
import userApis from '@/apis/users.api';
import { Loading } from '@/components/Loading';
import PostList from '@/components/PostList';
import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router';

const Saved = () => {
    const { profiltState, profile } = useOutletContext<ProfileContext>();
    const [savedPosts, setSavedPosts] = useState<Post[]>([]);
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
                    data: { savedPosts, totalPage },
                } = await savedApis.getSavedPostsByUserId(profile.id, currentPage);

                if (totalPage === 0 || currentPage === totalPage) {
                    setIsFetching(false);
                } else {
                    setCurrentPage((prev) => prev + 1);
                }

                setSavedPosts((prev) => {
                    if (prev.some((item) => item.id === savedPosts[0].post_id)) {
                        return prev;
                    } else {
                        const posts = savedPosts.map((item: SavedPost) => item.post);

                        return [...prev, ...posts];
                    }
                });
            } catch (error) {
                console.log(error);
            }
        }
    }, [profile, isVisible]);

    return (
        <PostList
            posts={savedPosts}
            isFetching={isFetching}
            setIsVisible={setIsVisible}
        />
    );
};

export default Saved;
