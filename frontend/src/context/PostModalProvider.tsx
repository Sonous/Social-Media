import React, { createContext, useState } from 'react';

export const PostModalContext = createContext<{
    isOpenPostModal: boolean;
    setIsOpenPostModal: React.Dispatch<React.SetStateAction<boolean>>;
    post: Post | undefined;
    setPost: React.Dispatch<React.SetStateAction<Post | undefined>>;
}>({
    isOpenPostModal: false,
    setIsOpenPostModal: () => {},
    post: undefined,
    setPost: () => {},
});

const PostModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOpenPostModal, setIsOpenPostModal] = useState(false);
    const [post, setPost] = useState<Post | undefined>();

    return (
        <PostModalContext.Provider value={{ isOpenPostModal, setIsOpenPostModal, post, setPost }}>
            {children}
        </PostModalContext.Provider>
    );
};

export default PostModalProvider;
