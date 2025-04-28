import { useEffect, useState } from 'react'
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Homepage from './pages/Homepage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import Setting from './pages/Setting'
import { useAuthStore } from './store/zustand/authStore'
import { Loader } from "lucide-react"
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from './store/zustand/themeStore'

function App() {

  const { authUser, checkAuth, isCheckungAuth, onlineUsers } = useAuthStore()
  const { theme } = useThemeStore();

  console.log({authUser})
  useEffect(() => {
    checkAuth()
  }, [checkAuth]);

  if (isCheckungAuth && !authUser) {
    return (
      <div data-theme={theme} className='flex items-center justify-center h-screen'>
        <Loader className='size-10 animate-spin' />
      </div>
    )
  }

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path='/' element={authUser ? <Homepage/> : <Navigate to={'/login'} />} />
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to={'/'} />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/profile' element={authUser ? <Profile /> : <Navigate to={'/login'} />} />
        <Route path='/settings' element={<Setting/>} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
