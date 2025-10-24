import axios from 'axios'

const axiosInstance=axios.create({
    baseURL:'http://localhost:8080'
})
axiosInstance.interceptors.request.use((config)=>{
    const accessToken=localStorage.getItem("token")
    if (accessToken){
        if (config){
            config.headers.token=accessToken;
        }
    }
    return config;
},(error)=>{
    return Promise.reject(error)
})
export default axiosInstance;