import { useEffect, useState } from 'react';

const NotificationhModal = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        setNotifications([])
    }, [])

    return (
        <div>
            <div className="p-5 border-b-2 space-y-5">
                <h1 className="font-semibold text-xl">Notifications</h1>
            </div>
            <div className="flex-1 overflow-auto p-3 space-y-5">
                {notifications.length > 0 ? (
                    <div></div>
                ) : (
                    <div className="h-full flex-center flex-col">
                        <h1>No results found.</h1>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationhModal;
