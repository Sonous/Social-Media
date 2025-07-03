import { useState } from 'react';
import PostModal from './PostModal';

export default function MiniPost({ post }: { post: Post }) {
    const [isOpenPostModal, setIsOpenPostModal] = useState(false);

    return (
        <div>
            <div key={post.id} onClick={() => setIsOpenPostModal(true)} className="cursor-pointer">
                {post.medias[0].type === 'image' ? (
                    <img
                        src={post.medias[0].url}
                        className="max-h-[200px] md:max-h-[300px] h-full w-full object-cover"
                    />
                ) : (
                    <video
                        src={post.medias[0].url}
                        className="max-h-[200px] md:max-h-[300px] h-full w-full object-cover"
                    />
                )}
            </div>
            <PostModal post={post} isOpen={isOpenPostModal} setIsOpen={setIsOpenPostModal} />
        </div>
    );
}
