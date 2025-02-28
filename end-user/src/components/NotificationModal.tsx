import React, { useState } from 'react';

const NotificationhModal = ({
    setShowNotificationModal,
}: {
    setShowNotificationModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    return (
        <div className="absolute sm:left-[100%] z-20 h-full bg-white transition-all sm:w-[400px] w-full sm:border-r-2 max-sm:bottom-[100%] max-sm:rounded-t-2xl max-sm:h-[400px] max-sm:border-t-2 max-sm:border-x-2 flex flex-col">
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
