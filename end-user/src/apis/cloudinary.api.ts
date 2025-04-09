import axiosInstance from '@/configs/axios.config';

const cloudinaryAPI = {
    async uploadImage(userId: string, folderType: FolderType, file: File) {
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const apikey = import.meta.env.VITE_CLOUDINARY_API_KEY;
        const folder = `mini-social-media/${userId}/${folderType}`
        const { data } = await axiosInstance.get('/cloudinary/signature', {
            params: {
                userId,
                folder,
                public_id: file.name
            },
        });

        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', apikey);
        formData.append('signature', data.signature);
        formData.append('timestamp', data.timestamp);
        formData.append('folder', folder);
        formData.append('public_id', file.name);
        formData.append('overwrite', 'true');

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData,
        });

        const result = await res.json();

        return result.secure_url;
    },
};

export default cloudinaryAPI;
