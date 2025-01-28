/// <reference types="vite/client" />
declare type User = {
    id: string;
    name: string;
    username: string;
    email: string;
    avatar_url: string;
    bio: string;
    // created_at: string;
    // updated_at: string;
}

declare type Time = {
    created_at: string;
    updated_at: string;
}



declare type NavItem = {
    iconElement: JSX.Element;
    label: string;
    link?: string;
    isActive: boolean;
};

declare type Post = Time & {
    id: string;
    content: string;
    medias: string[];
}

declare type CraeteUser = {
    id: string;
    name: string;
    username: string;
    email: string;
    password?: string;
    avatar_url: string;
    bio: string;
};

declare type Profile = CraeteUser & {
    posts: Post[]
}

declare type CustomFile = {
    file: File;
    fileId: string;
}

declare type MediaState = {
    medias: CustomFile[];
    setMedias: React.Dispatch<React.SetStateAction<CustomFile[]>>
}

