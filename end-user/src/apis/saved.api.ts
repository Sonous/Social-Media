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
};

export default savedApis;