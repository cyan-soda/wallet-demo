import axios from 'axios';

const axiosClient = axios.create()

axiosClient.interceptors.request.use(async(config: any) => {
    config.headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...config.headers,
    },
    config.data
    return config
})

axiosClient.interceptors.response.use((response: any) => {
    if (response && response.data) {
        return response.data
    }
    return response
}, (error: any) => {
    console.error("Error: ", error.response)
    return Promise.reject(error)
})

export default axiosClient