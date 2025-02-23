import { MediaType } from 'src/posts/post.interface';

export class MessageInterface {
    id?: string;
    content: string;
    medias?: MediaType[];
    user_id: string;
    room_id: string;
}
