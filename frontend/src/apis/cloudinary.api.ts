import axiosInstance from '@/configs/axios.config';

const cloudinaryAPI = {
  async uploadMedia(userId: string, folderType: FolderType, file: File) {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;
    const folder = `mini-social-media/${userId}/${folderType}`;

    // Xác định loại media: image hoặc video
    const isVideo = file.type.startsWith('video/');
    const resourceType = isVideo ? 'video' : 'image';

    // Lấy chữ ký từ backend
    const { data } = await axiosInstance.get('/cloudinary/signature', {
      params: {
        userId,
        folder,
        public_id: file.name,
        resource_type: resourceType,
      },
    });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', apiKey);
    formData.append('signature', data.signature);
    formData.append('timestamp', data.timestamp);
    formData.append('folder', folder);
    formData.append('public_id', file.name);
    formData.append('overwrite', 'true');

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

    const res = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    const result = await res.json();

    return result.secure_url;
  },
};

export default cloudinaryAPI;
