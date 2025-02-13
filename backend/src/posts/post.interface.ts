export interface Post {
    content: string;

    medias: MediaType[];

    user_id: string;
}

export type MediaType = {
    type: 'image' | 'video';
    url: string;
};
