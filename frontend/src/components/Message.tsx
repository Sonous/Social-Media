import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useTokenStore from '@/store/useTokenStore';
import { formatDate } from '@/utils/formatDate';
import classNames from 'classnames';
import { CircleArrowLeft, Copy, EllipsisVertical } from 'lucide-react';
import { useEffect, useState } from 'react';
import CustomAvatar from './CustomAvatar';
import { useToast } from '@/hooks/use-toast';

const Message = ({
    message,
    handleRecoveryMessage,
}: {
    message: Message;
    handleRecoveryMessage: (messageId: string, userId: string) => Promise<void>;
}) => {
    const [isHoverMessage, setIsHoverMessage] = useState(false);
    const [isOnHoverState, setIsOnHoverState] = useState(false);
    const [open, setOpen] = useState(false);
    const user = useTokenStore((state) => state.user as User);
    const { toast } = useToast();

    useEffect(() => {
        if (!isOnHoverState) {
            setIsHoverMessage(false);
        }
    }, [isOnHoverState]);

    return (
        <div
            className={classNames('flex gap-2 items-center', {
                'justify-end': message.user_id === user.id,
            })}
            onMouseOver={() => {
                if (message.status !== 'recovery') {
                    setIsHoverMessage(true)
                }
            }}
            onMouseLeave={() => {
                if (!isOnHoverState) {
                    setIsHoverMessage(false);
                }
            }}
        >
            {message.user_id !== user.id && (
                <CustomAvatar avatar_url={message.sender.avatar_url} username={message.sender.username} />
            )}

            <div className={`${message.user_id === user.id ? 'order-2' : 'order-1'}`}>
                {message.status !== 'recovery' ? (
                    <p
                        className={`p-1 px-3 rounded-2xl ${
                            message.user_id === user.id ? 'bg-[#3797f0] text-white' : 'bg-[#ebebeb]'
                        }`}
                    >
                        {message.content}
                    </p>
                ) : (
                    <p className={`p-1 px-3 rounded-2xl bg-[#ebebeb] text-gray-500 italic`}>
                        This message has been unsent
                    </p>
                )}
            </div>

            {isHoverMessage && (
                <div className={`${message.user_id === user.id ? 'order-1' : 'order-2'}`}>
                    <DropdownMenu
                        open={open}
                        onOpenChange={() => {
                            setOpen(!open);
                            setIsOnHoverState((prev) => !prev);
                        }}
                    >
                        <DropdownMenuTrigger>
                            <EllipsisVertical size={18} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>{formatDate(message.created_at)}</DropdownMenuLabel>

                            <DropdownMenuItem
                                onClick={() => {
                                    navigator.clipboard
                                        .writeText(message.content)
                                        .then(() => {
                                            toast({
                                                title: 'Copied successfully',
                                                duration: 2000,
                                            });
                                        })
                                        .catch(() => {
                                            toast({
                                                title: 'Failed to copy',
                                                duration: 2000,
                                            });
                                        });
                                }}
                            >
                                Copy
                                <DropdownMenuShortcut>
                                    <Copy size={16} color="#000000" />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>

                            {message.user_id === user.id && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={async () => {
                                            try {
                                                await handleRecoveryMessage(message.id, user.id);
                                            } catch (error) {
                                                console.error('Error recovering message:', error);
                                                toast({
                                                    title: 'Failed to recover message',
                                                    description: 'Please try again later.',
                                                    duration: 2000,
                                                });
                                            }
                                        }}
                                    >
                                        Unsend
                                        <DropdownMenuShortcut>
                                            <CircleArrowLeft size={16} color="#000000" />
                                        </DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
        </div>
    );
};

export default Message;
