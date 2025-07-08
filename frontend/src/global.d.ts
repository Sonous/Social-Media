declare type User = {
    id: string;
    name: string;
    username: string;
    email?: string;
    password?: string;
    avatar_url: string;
    bio?: string;
    posts?: number;
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
    likeAmount: number;
    commentAmount: number;
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
    currentUserId: string;
    otherUserId: string;
    relation: 'following' | 'follower' | 'none';
};

declare type Mention = {
    user_id: string;
    username: string;
};

declare type CustomComment = Time & {
    id: string;
    content: string;
    media?: MediaType;
    mentions?: Mention[];
    post_id: string;
    user_id: string;
    parent_comment_id?: string;
    childAmount: number;
    user: User;
};

declare type Room = Time & {
    id: string;
    name: string | null;
    avatar_url: string | null;
    type: 'private' | 'group';
    roomUsers?: RoomUser[];
    messages?: Message[];
    latestMessage?: Message;
};

declare type RoomUser = {
    user_id: string;
    user: User;
};

declare type Message = Time & {
    id: string;
    content: string;
    medias?: MediaType[] | null;
    user_id: string;
    room_id: string;
    sender: User;
    status: 'sent' | 'read' | 'recovery';
};

declare type CustomNotification = {
    id: string;
    isRead: boolean;
    notification: {
        id: string;
        content: string;
        type: 'follow' | 'like' | 'comment' | 'post';
        sender: User;
        meta?: Record<string, unknown>;
        created_at: string;
    };
};

type FolderType = 'avatars' | 'posts';

type TokenPayload = {
    user: User;
    tokenType: 'accessToken' | 'refreshToken';
    iat: number;
    exp: number;
};

type MiniPopupState = 'search' | 'notification' | 'none';

type Pageable<T> = {
    data: T[];
    limit: number;
    totalPage: number;
}