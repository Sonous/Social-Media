import axiosInstance from "@/configs/axios.config";

const savedApis = {
    getSavedPostsByUserId(id: string, page: number){
        const { access_token } = JSON.parse(localStorage.getItem('auth_info') || '{}')
        
        return axiosInstance.get(`/saved/users/${id}`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            params: {
                page
            }
        })
    },

    async addSavedPost(post_id: string, user_id: string) {
        const { access_token } = JSON.parse(localStorage.getItem('auth_info') || '{}')
        
        await axiosInstance.post(`/saved`, {
            post_id,
            user_id
        }, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            }
        })
    },

    async removeSavedPost(post_id: string, user_id: string) {
        const { access_token } = JSON.parse(localStorage.getItem('auth_info') || '{}')
        
        await axiosInstance.delete(`/saved`,  {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            params: {
                post_id,
                user_id
            },
        })
    },

    async checkSavedPost(post_id: string, user_id: string) {
        const { access_token } = JSON.parse(localStorage.getItem('auth_info') || '{}')
        
        return await axiosInstance.get<{ isExists: boolean }>(`/saved/check-saved`,  {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            params: {
                post_id,
                user_id
            },
        })
    },
};

export default savedApis;