import { formatDate } from '@/utils/formatDate';
import { Dot } from 'lucide-react';
import { useNavigate } from 'react-router';
import CustomAvatar from './CustomAvatar';
import notificationAPI from '@/apis/notification.api';
import { useEffect, useState } from 'react';
import { uniqueArr } from '@/utils/uniqueArr';

const NotificationhModal = ({
    getUnreadCount,
    newNotification,
    setNewNotification,
}: {
    getUnreadCount: () => void;
    newNotification: CustomNotification | null;
    setNewNotification: React.Dispatch<React.SetStateAction<CustomNotification | null>>;
}) => {
    const [notifications, setNotifications] = useState<CustomNotification[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>();
    const navigate = useNavigate();

    useEffect(() => {
        handleGetNotifications();
    }, []);

    useEffect(() => {
        if (newNotification) {
            setNotifications((prev) => {
                const existingNotification = prev.find((n) => n.id === newNotification.id);
                console.log('New notification:', newNotification);
                if (existingNotification) {
                    return prev;
                }
                return uniqueArr([newNotification, ...prev]);
            });
            setNewNotification(null);
            getUnreadCount();
        }
    }, [newNotification]);

    async function handleGetNotifications() {
        try {
            const data = await notificationAPI.getNotifications(page);

            setNotifications((prev) => uniqueArr([...prev, ...data.data]));
            setTotalPage(data.totalPage);
            setPage(page + 1);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    }

    console.log(page, totalPage);

    return (
        <div className='flex flex-col h-full'>
            <div className="px-5 pt-5 border-b-2">
                <h1 className="font-semibold text-xl">Notifications</h1>
                <div className="flex justify-end">
                    <button
                        className="p-0 text-sm font-semibold hover:text-blue-600 transition-colors"
                        onClick={() => {
                            // Call API to mark all notifications as read
                            notificationAPI
                                .markAllAsRead()
                                .then(() => {
                                    getUnreadCount();
                                    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
                                })
                                .catch((error) => {
                                    console.error('Error marking all notifications as read:', error);
                                });
                        }}
                    >
                        Mark all as read
                    </button>
                </div>
            </div>
            <div className="overflow-auto flex-1">
                {notifications.length > 0 ? (
                    <div>
                        {notifications.map(({ id, notification, isRead }) => (
                            <div
                                key={id}
                                className="flex gap-2 relative hover:bg-black/5 cursor-pointer p-3"
                                onClick={() => {
                                    notificationAPI
                                        .markAsRead(id)
                                        .then(() => {
                                            getUnreadCount();
                                            setNotifications((prev) =>
                                                prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
                                            );
                                        })
                                        .catch((err) => {
                                            console.error('Error marking notification as read:', err);
                                        });
                                }}
                            >
                                <CustomAvatar
                                    avatar_url={notification.sender.avatar_url}
                                    username={notification.sender.username}
                                    onClick={() => {
                                        navigate(`/${notification.sender.username}`);
                                    }}
                                    className="cursor-pointer"
                                />

                                <div>
                                    <p>{notification.content}</p>
                                    <p className="text-sm text-black/50">{formatDate(notification.created_at)}</p>
                                </div>

                                {!isRead && <Dot color="#007bff" size={40} className="absolute top-0 right-0" />}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-full flex-center flex-col">
                        <h1>No results found.</h1>
                    </div>
                )}
                {totalPage && page <= totalPage && (
                    <div
                        className="text-center cursor-pointer hover:text-black/50 p-3"
                        onClick={() => {
                            handleGetNotifications();
                        }}
                    >
                        Show More
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationhModal;
