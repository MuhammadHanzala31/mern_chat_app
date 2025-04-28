import { useEffect, useState } from "react";
import { useChatStore } from "../store/zustand/chatStore";
import { Users } from "lucide-react";
import avatarPng from '../assets/user.png'
import SidebarSkeleton from "./skeleton/SidebarSkeleton";
import { useAuthStore } from "../store/zustand/authStore";
import UserSidebarModal from "./UserSidebarModal";


function Sidebar() {
    const { getUser, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
    const { onlineUsers, openUserModal, closeUserModal, userModal, setModalUser } = useAuthStore()
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);
    useEffect(() => {
        getUser()
    }, []);
    const filterUsers = showOnlineOnly ? users?.filter((user) => onlineUsers.includes(user._id)) : users
    if (isUsersLoading) return <SidebarSkeleton />
    return (
        <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200 relative">
            <div className="border-b border-base-300 w-full p-5">
                <div className="flex items-center gap-2">
                    <Users className="size-6" />
                    <span className="font-medium hidden lg:block">Contacts</span>
                </div>
                <div className="mt-3 hidden lg:flex items-center gap-2">
                    <label className="cursor-pointer flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={showOnlineOnly}
                            onChange={(e) => setShowOnlineOnly(e.target.checked)}
                            className="checkbox checkbox-sm"
                        />
                        <span className="text-sm">Show online only</span>
                    </label>
                    <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
                </div>
            </div>
            <div className="overflow-y-auto w-full py-3 ">
                {filterUsers && filterUsers.map((user) => (
                    <button
                        key={user._id}
                        onClick={(e) => {
                            
                            setSelectedUser(user)
                            
                            if(!userModal){
                                openUserModal()
                            }
                            else{
                                closeUserModal()
                            }
                            }}
                        className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors relative
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}>
                        <div className="relative mx-auto lg:mx-0" onClick={()=>{
                            e.stopPropagation()
                            setModalUser(user)
                            }}>
                            <img
                                src={user.avatar || avatarPng}
                                alt={user.name}
                                className="size-12 object-cover rounded-full"
                            />
                            {onlineUsers.includes(user._id) && (
                                <span
                                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                                />
                            )}
                        </div>
                        {/* for large screens only*/}
                        <div className="hidden lg:block text-left min-w-0">
                            <div className="font-medium truncate">{user.fullname}</div>
                            <div className="text-sm text-zinc-400">
                                {onlineUsers && onlineUsers?.includes(user._id) ? "Online" : "Offline"}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
                           {/* <UserSidebarModal/> */}
        </aside>
    )

}

export default Sidebar
