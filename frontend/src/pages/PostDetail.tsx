import postApis from '@/apis/posts.api';
import FullPost from '@/components/post/FullPost';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

const PostDetail = () => {
    const { postId } = useParams();
    const [post, setPost] = useState<Post>();

    useEffect(() => {
        if (!postId) {
            console.error('Post ID is required');
            return;
        }
        // Fetch post details by ID
        postApis
            .getPostDetailById(postId)
            .then(({ data }) => {
                console.log('Post details:', data);
                setPost(data);
            })
            .catch((error) => {
                console.error('Error fetching post details:', error);
            });
    }, [postId]);
    return (
        <div className="size-full flex justify-center items-center flex-1">
            {post ? (
                <FullPost post={post} type="none" />
            ) : (
                <p className="text-center text-gray-500">Loading post details...</p>
            )}
        </div>
    );
};

export default PostDetail;
