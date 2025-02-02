import { useAppSelector } from '@/hooks/reduxHooks';
import { selectUser } from '@/store/slices/UserSlice';
import React, { useCallback } from 'react';
import { MentionsInput, Mention, DataFunc } from 'react-mentions';
import defaultStyle from './defaultStyle';
import defaultMentionStyle from './defaultMentionStyle';
import hashtagApis from '@/apis/hashtag.api';
import { debounce } from '@/utils/debounce';

const EditPost = ({
    content,
    setContent,
}: {
    content: string;
    setContent: React.Dispatch<React.SetStateAction<string>>;
}) => {
    const user = useAppSelector(selectUser);

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
                <img src={user?.avatar_url} alt="profile" className="w-8 h-8 rounded-full" />
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
                    style={defaultStyle}
                >
                    <Mention
                        trigger="#"
                        data={func}
                        markup="#[__display__](__id__)"
                        displayTransform={(id: string, display: string) => `#${display}`}
                        style={defaultMentionStyle}
                    />
                </MentionsInput>
                <div className="px-3 text-end text-[13px] font-light">{content.length}/2,200</div>
            </div>
        </div>
    );
};

export default EditPost;
