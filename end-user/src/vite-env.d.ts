/// <reference types="vite/client" />

declare type User = {
    id: string;
    name: string;
    username: string;
    email: string;
    password?: string;
    avatar_url: string;
    bio: string;
    created_at?: string
    updated_at?: string
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
    medias: MediaType[];
}


declare type CustomFile = {
    file: File;
    fileId: string;
}

declare type MediaState = {
    medias: CustomFile[];
    setMedias: React.Dispatch<React.SetStateAction<CustomFile[]>>
}

type ProfileState = 'self' | 'other' | '';

type ProfileContext = {
    profiltState: ProfileState;
    profile: Profile;
};

declare type VideoProps = {
    url: string,
    className?: string
}

declare type MediaType = {
    type: 'image' | 'video';
    url: string;
};