import React, { useCallback } from 'react';
import { MentionsInput, Mention, DataFunc } from 'react-mentions';
import defaultStyle from './defaultStyle';
import defaultMentionStyle from './defaultMentionStyle';
import hashtagApis from '@/apis/hashtag.api';
import { debounce } from '@/utils/debounce';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useTokenStore from '@/store/useTokenStore';

const EditPost = ({
    content,
    setContent,
}: {
    content: string;
    setContent: React.Dispatch<React.SetStateAction<string>>;
}) => {
    const user = useTokenStore(state => state.user as User);

    // Fetching hashtags when user stops typing
    const queryHashtag: DataFunc = async (query, callback) => {
        if (!query) {
            return;
        }

        try {
            const hashtags = await hashtagApis.queryHashtags(query);

            callback(hashtags);
        } catch (error) {
            console.log(error);
        }
    };

    const func = useCallback(debounce(queryHashtag, 500), []);

    return (
        <div className="border-l-[1px]">
            <div className="flex p-3 gap-3 items-center">
                <Avatar>
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback>{user.username}</AvatarFallback>
                </Avatar>
                <h1 className="font-medium">{user?.username}</h1>
            </div>
            <div className="border-b-[1px]">
                <MentionsInput
                    value={content}
                    onChange={(e) => {
                        if (e.target.value.length <= 2200) {
                            setContent(e.target.value);
                        }
                    }}
                    style={{
                        ...defaultStyle,
                        '&multiLine': {
                            input: {
                                overflowY: 'auto',
                            }
                        }
                    }}
                >
                    <Mention
                        trigger="#"
                        data={func}
                        markup="#[__display__](__id__)"
                        displayTransform={(_, display: string) => `#${display}`}
                        style={defaultMentionStyle}
                    />
                </MentionsInput>
                <div className="px-3 text-end text-[13px] font-light">{content.length}/2,200</div>
            </div>
        </div>
    );
};

export default EditPost;
