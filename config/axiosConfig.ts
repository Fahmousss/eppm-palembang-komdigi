import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  headers:{
    'Content-Type':'application/json',
    'Accept':'application/json'
  },
  withCredentials:false,
  timeout:30000
})

axiosInstance.interceptors.request.use(
  async(config)=>{
    const token = await SecureStore.getItemAsync('session')
    if(token){
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error)=>{
    return Promise.reject(error)
  }
)

export default axiosInstance