import { create } from "zustand";
import { axiosInstance } from "../../utils/axios";
import toast from "react-hot-toast";
import { io } from 'socket.io-client'

const BASEURL = 'https://mern-chat-app-e59o.onrender.com/'

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    onlineUsers: [],
    isUpdatingProfile: false,
    onlineUser: [],
    isCheckingAuth: true,
    socket: null,
    userModal: false,
    modalUser : null,
    setModalUser : (user)=> set({modalUser : user}),
    openUserModal: () => {
        const {userModal} = get()
        if(!userModal){
            set({userModal : true})
        }
    },
    closeUserModal: () => {
        const {userModal} = get()
        if(userModal){
            set({userModal : false})
        }
    },
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/user/check')
            set({ authUser: res.data.data })
            get().connectSocket()

        } catch (error) {
            console.log("Error in userAthh", error)
            set({ authUser: null })
        }
        finally {
            set({ isCheckingAuth: false })
        }
    },
    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/user/login", data);
            set({ authUser: res.data.data.loggedInUser });
            toast.success("Logged in successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },
    signup: async (data) => {
        set({ isSigningUp: true })
        try {
            const res = await axiosInstance.post('/user/register', data)
            toast.success("account created Successfully")
            set({ authUser: res.data })
            get().login({
                email: data?.email,
                password: data?.password
            })

        } catch (error) {
            toast.error(error.message)
        }
        finally {
            set({ isSigningUp: false })
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post("/user/logout");
            get().disconnectSocket()
            set({ authUser: null });
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error(error.message);
        }
    },

    updateProfile: async (avatar) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.patch("/user/update-avatar", avatar);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("error in update profile:", error);
            toast.error(error.message);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },
    connectSocket: () => {



        const { authUser } = get()
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASEURL, {
            query: {
                userId: authUser._id,
            },
        });
        socket.connect();

        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    },
    disconnectSocket: () => {
        const socket = get().socket;
        if (socket?.connected) {
            socket.disconnect();
        }
    },
}))
