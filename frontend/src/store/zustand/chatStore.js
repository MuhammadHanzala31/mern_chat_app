import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../../utils/axios";
import { io } from 'socket.io-client'
import { useAuthStore } from "./authStore";



export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessagesLoading: false,


    getUser: async () => {
        set({ isUserLoading: true })
        try {
            const res = await axiosInstance.get('/message/users')
            console.log(res.data)
            set({ users: res.data?.data })
        } catch (error) {
            toast.error(error.message)
        }
        finally {
            set({ isUserLoading: false })

        }
    },
    getMessages: async (userId) => {
        set({ isMessagesLoading: true })
        try {
            const res = await axiosInstance.get(`/message/user/${userId}`)
            console.log("data store", res.data)
            set({ messages: res.data?.data || null })
        } catch (error) {
            toast.error(error.message)
        }
        finally {
            set({ isMessagesLoading: false })
        }

    },
    sendMessage: async (messageData) => {
        const { messages, selectedUser } = get()
        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser?._id}`, messageData)
            set({ messages: [...messages, res.data?.data] })

        } catch (error) {
            toast.error(error.message)
        }
    },
    suscribedMessage : () => {
        const { selectedUser } = get()
        if (!selectedUser) return;

        const socket = useAuthStore.getState()?.socket;
        socket?.on("newMessage", (message) => {
            if(message.senderId !== selectedUser._id) return; 
            set({ messages: [...get().messages, message] })
        })
    },
    unSuscribeMessage: () => {
        const socket = useAuthStore.getState()?.socket
        socket?.off('newMessage')
    },
    setSelectedUser: (selectedUser) => {
        console.log(selectedUser)
        set({ selectedUser })
    },
})) 