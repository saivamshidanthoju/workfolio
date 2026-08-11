import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AnimatePresence } from 'framer-motion'

import Layout from './ui/Layout'
import ProtectedRoute from './ui/ProtectedRoute'
import AdminRoute from './ui/AdminRoute'

// Pages
import Landing from './pages/Landing'
import Home from './pages/Home'
import Jobs from './pages/Jobs'
import MyPosts from './pages/MyPosts'
import Applications from './pages/Applications'
import Assignments from './pages/Assignments'
import CompletedWorks from './pages/CompletedWorks'
import Chat from './pages/Chat'
import Chats from './pages/Chats'
import Notifications from './pages/Notifications'
import Profile from './pages/Profile'
import WorkerProfile from './pages/WorkerProfile'
import SearchWorkers from './pages/SearchWorkers'
import Reviews from './pages/Reviews'
import Admin from './pages/Admin'

import { useAuth } from './stores/useAuth'

const qc = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 30000 } },
})

export default function App() {
  const fetchMe = useAuth((s) => s.fetchMe)
  const logout  = useAuth((s) => s.logout)

  useEffect(() => { fetchMe() }, [fetchMe])

  useEffect(() => {
    const handler = () => logout()
    window.addEventListener('wb:unauthorized', handler)
    return () => window.removeEventListener('wb:unauthorized', handler)
  }, [logout])

  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <Routes>
          {/* Public landing — auth via modals */}
          <Route path="/landing" element={<Landing />} />

          {/* Protected app */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/"               element={<Home />} />
            <Route path="/jobs"           element={<Jobs />} />
            <Route path="/my-posts"       element={<MyPosts />} />
            <Route path="/applications"   element={<Applications />} />
            <Route path="/assignments"    element={<Assignments />} />
            <Route path="/completed"      element={<CompletedWorks />} />
            <Route path="/chats"          element={<Chats />} />
            <Route path="/chat/:assignmentId" element={<Chat />} />
            <Route path="/notifications"  element={<Notifications />} />
            <Route path="/profile"        element={<Profile />} />
            <Route path="/worker-profile" element={<WorkerProfile />} />
            <Route path="/search-workers" element={<SearchWorkers />} />
            <Route path="/reviews"        element={<Reviews />} />
            <Route path="/admin"          element={<AdminRoute><Admin /></AdminRoute>} />
          </Route>

          {/* Any unknown path → landing */}
          <Route path="*" element={<Navigate to="/landing" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
