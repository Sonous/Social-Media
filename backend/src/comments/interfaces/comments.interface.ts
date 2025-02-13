import { MediaType } from 'src/posts/post.interface';
import { Mention } from './mention.interface';

export interface Comment {
    content: string;
    media?: MediaType;
    mentions?: Mention[] | undefined;
    post_id: string;
    user_id: string;
    parent_comment_id?: string;
    created_at?: string;
    updated_at?: string;
}
