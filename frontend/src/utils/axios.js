import axios from "axios";

export const axiosInstance = axios.create({
    baseURL : "https://mern-chat-app-e59o.onrender.com//api/v1",
    withCredentials : true
})
