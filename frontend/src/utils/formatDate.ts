export const formatDate = (isoString: string, timezone: string = 'Asia/Ho_Chi_Minh'): string => {
    const date = new Date(isoString); // Thời gian từ server (UTC)
    const now = new Date(); // Thời gian hiện tại (local)
    
    // Tính offset của múi giờ được chỉ định
    const getTimezoneOffset = (tz: string): number => {
        const offsetMap: { [key: string]: number } = {
            'Asia/Ho_Chi_Minh': 7,
            'UTC': 0,
            'America/New_York': -5, // EST
            'Europe/London': 0, // GMT
        };
        return offsetMap[tz] || 7; // Mặc định là UTC+7
    };
    
    // Chuyển đổi thời gian UTC từ server về múi giờ được chỉ định
    const timezoneOffset = getTimezoneOffset(timezone) * 60 * 60 * 1000;
    const dateInTimezone = new Date(date.getTime() + timezoneOffset);
    
    // Tính hiệu giữa thời điểm hiện tại và thời điểm đã chuyển đổi
    const diffInSeconds = Math.floor((now.getTime() - dateInTimezone.getTime()) / 1000);

    if (isNaN(date.getTime())) return 'Invalid date';
    if (diffInSeconds < 0) return 'just now';
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    // Nếu hơn 24h, hiển thị dạng dd/MM/yyyy - HH:mm theo múi giờ Việt Nam
    return date
        .toLocaleString('vi-VN', {
            timeZone: timezone,
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        })
        .replace(',', ' -');
};
