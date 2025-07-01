import axiosInstance from "@/configs/axios.config"
import { SuggestionDataItem } from "react-mentions";

const hashtagApis = {
    async queryHashtags(name: string): Promise<SuggestionDataItem[]> {
        const { data } = await axiosInstance.get<{ id: string, name: string }[]>('/hashtags', {
            params: {
                name
            }
        });

        return data.map(item => ({
            id: item.id,
            display: item.name
        }))
    }
}

export default hashtagApis