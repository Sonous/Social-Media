import React, { createContext, useState } from 'react';

export const PostModalContext = createContext<{
    isOpenPostModal: boolean;
    setIsOpenPostModal: React.Dispatch<React.SetStateAction<boolean>>;
    post: Post | undefined;
    setPost: React.Dispatch<React.SetStateAction<Post | undefined>>;
    isShowNavText: boolean;
    setIsShowNavText: React.Dispatch<React.SetStateAction<boolean>>;
}>({});

const PostModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOpenPostModal, setIsOpenPostModal] = useState(false);
    const [isShowNavText, setIsShowNavText] = useState(true);
    const [post, setPost] = useState<Post | undefined>();

    return (
        <PostModalContext.Provider
            value={{ isOpenPostModal, setIsOpenPostModal, post, setPost, isShowNavText, setIsShowNavText }}
        >
            {children}
        </PostModalContext.Provider>
    );
};

export default PostModalProvider;
