import axiosInstance from '@/configs/axios.config';

const notificationAPI = {
    async getNotifications(page: number) {
        const { data } = await axiosInstance.get(`/notifications/receiver`, {
            params: {
                page
            }
        });

        return data;
    },

    async getUnreadCount() {
        const { data } = await axiosInstance.get(`/notifications/count-unread`);

        return data;
    },

    async markAllAsRead() {
        const { data } = await axiosInstance.get(`/notifications/mark-all-read`);

        return data;
    },

    async markAsRead(notificationId: string) {
        const { data } = await axiosInstance.get(`/notifications/mark-as-read`, {
            params: {
                notificationId
            }
        });

        return data;
    }
};

export default notificationAPI;
