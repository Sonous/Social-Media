export interface Post {
    content: string;

    medias: MediaType[];

    userId: string;
}

export type MediaType = {
    type: 'image' | 'video';
    url: string;
};
