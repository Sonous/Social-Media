/// <reference types="vite/client" />

declare type User = {
    id: string;
    name: string;
    username: string;
    email?: string;
    password?: string;
    avatar_url: string;
    bio?: string;
    posts: number;
    followers?: number;
    following?: number;
    created_at?: string;
    updated_at?: string;
};

declare type Time = {
    created_at: string;
    updated_at: string;
};

declare type NavItem = {
    iconElement: JSX.Element;
    label: string;
    link?: string;
    isActive: boolean;
};

declare type Post = Time & {
    id: string;
    content: string;
    medias: MediaType[];
    user_id: string;
};

declare type SavedPost = {
    user_id: string;
    post_id: string;
    post: Post;
};

declare type CustomFile = {
    file: File;
    fileId: string;
};

declare type MediaState = {
    medias: CustomFile[];
    setMedias: React.Dispatch<React.SetStateAction<CustomFile[]>>;
};

type ProfileState = 'self' | 'other' | '';

type ProfileContext = {
    profiltState: ProfileState;
    profile: Profile;
};

declare type VideoProps = {
    url: string;
    className?: string;
};

declare type MediaType = {
    type: 'image' | 'video';
    url: string;
};

declare type Relation = {
    followers: User[];
    following: User[];
};

declare type Mention = {
    user_id: string;
    username: string;
};

declare type Comment = {
    content: string;
    media?: MediaType;
    mentions?: Mention[];
    post_id: string;
    user_id: string;
    parent_comment_id?: string;
};
