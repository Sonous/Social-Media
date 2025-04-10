import CustomAvatar from './CustomAvatar';
import classNames from 'classnames';
import useTokenStore from '@/store/useTokenStore';

const Message = ({ message }: { message: Message }) => {
    const user = useTokenStore((state) => state.user as User);

    // console.log(Date.now())
    // console.log(message.created_at)
    // console.log(new Date(message.created_at).getTime())
    // console.log((Date.now() - new Date(message.created_at).getTime()) / 60000)

    return (
        <div>
            <div
                className={classNames('flex gap-3', {
                    'justify-end': message.user_id === user.id,
                })}
            >
                {message.user_id !== user.id && (
                    <CustomAvatar avatar_url={message.sender.avatar_url} username={message.sender.username} />
                )}

                <div>
                    <p className="bg-[#ebebeb] p-3 rounded-2xl">{message.content}</p>
                </div>
            </div>
        </div>
    );
};

export default Message;
