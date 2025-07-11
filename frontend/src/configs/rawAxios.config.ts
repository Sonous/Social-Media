import axios from "axios";

const rawAxios = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true, // Để gửi cookie refreshToken
    headers: {
        'Content-Type': 'application/json',
    },
})

export default rawAxios;