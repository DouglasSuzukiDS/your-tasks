import axios from "axios";

export const api = axios.create({
   baseURL: process.env.NEXT_PUBLIC_API_URL,
})

if (typeof window !== "undefined") {
   api.interceptors.request.use((config) => {
      const match = document.cookie.match(/(^| )token=([^;]+)/)
      if (match) {
         config.headers.Authorization = `Bearer ${match[2]}`
      }
      return config
   })
}