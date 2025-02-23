import { debounce } from '@/utils/debounce';
import React, { useCallback } from 'react';
import { DataFunc, Mention, MentionsInput, SuggestionDataItem, SuggestionFunc } from 'react-mentions';

const CustomInput = ({
    symbolTrigger,
    inputValue,
    setInputValue = () => {},
    type,
    // onSubmit,
    className,
}: {
    symbolTrigger: string;
    inputValue: string;
    setInputValue?: React.Dispatch<React.SetStateAction<string>>;
    type: 'input' | 'text';
    // onSubmit: () => void;
    className: string;
}) => {
    // Fetching following when user stops typing
    const queryFollowing: DataFunc = async (query, callback) => {
        if (!query) {
            return;
        }

        try {
            // const hashtags = await hashtagApis.queryHashtags(query);

            callback([
                {
                    id: '123',
                    display: 'jdflkadsjl',
                },
                {
                    id: '4534',
                    display: 'errqwerqw',
                },
            ]);
        } catch (error) {
            console.log(error);
        }
    };

    const func = useCallback(debounce(queryFollowing, 500), []);

    const renderSuggestion: SuggestionFunc = (
        suggestion: SuggestionDataItem,
        search: string,
        highlightedDisplay: React.ReactNode,
        index: number,
        focused: boolean,
    ) => {
        console.log(suggestion);
        console.log(search);
        console.log(highlightedDisplay);
        console.log(index);
        console.log(focused);

        return <div>{suggestion.display}</div>;
    };

    return (
        <MentionsInput
            value={inputValue}
            onChange={(e) => {
                if (e.target.value.length <= 2200 && type === 'input') {
                    setInputValue(e.target.value);
                }
            }}
            style={
                type === 'input'
                    ? {
                          input: {
                              outline: 'none',
                              padding: 12,
                              caretColor: '#ec4899',
                              overflowY: 'auto',
                          },
                          highlighter: {
                              maxHeight: 100,
                              padding: 12,
                          },
                      }
                    : {}
            }
            disabled={type === 'text'}
            className={type === 'input' ? `w-full max-h-[100px] rounded-lg bg-[#ebebeb] ${className}` : ''}
            placeholder={type === 'input' ? 'Add a comment' : ''}
        >
            <Mention
                trigger={symbolTrigger}
                data={type === 'input' ? func : []}
                renderSuggestion={renderSuggestion}
                markup={`${symbolTrigger}[__display__](__id__)`}
                displayTransform={(id: string, display: string) => `${symbolTrigger}${display}`}
                style={{}}
            />
        </MentionsInput>
    );
};

export default CustomInput;
