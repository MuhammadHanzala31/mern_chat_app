import React from 'react'
import { useAuthStore } from '../store/zustand/authStore'
function UserSidebarModal() {
    const {modalUser, userModal} = useAuthStore()
  return (
    <div className={`absolute z-[9999] top-5 text-white p-3 bg-black ${userModal ? 'block' : 'hidden'}`}>
      {modalUser?.email}
    </div>
  )
}

export default UserSidebarModal
