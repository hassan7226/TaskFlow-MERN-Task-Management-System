import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Admin/Dashboard'
import CreateTask from './pages/Admin/CreateTask'
import UpdateTask from './pages/Admin/UpdateTask'
import ManageTasks from './pages/Admin/ManageTasks'
import ManageUsers from './pages/Admin/ManageUsers'
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import UserDashboard from './pages/User/UserDashboard'
import MyTasks from './pages/User/MyTasks'
import UserUpdateTask from './pages/User/UpdateTask'
import PrivateRoute from './routes/PrivateRoute'
import EmailVerify from './pages/Auth/EmailVerify'
import ResetPassword from './pages/Auth/ResetPassword'


const App = () => {
  return (
    <div className="w-full">
        <Routes>
          <Route path='/' element={<Navigate to='/signup' replace />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/verify-email' element={<EmailVerify />} />
          <Route path='/reset-password' element={<ResetPassword />} />

          {/* Admin Routes */}
          <Route element={<PrivateRoute allowedRoles={['admin']} />}>
          <Route path='/admin/dashboard' element={<Dashboard />} />
          <Route path='/admin/create-task' element={<CreateTask />} />
          <Route path='/admin/update-task/:taskId' element={<UpdateTask />} />
          <Route path='/admin/manage-tasks' element={<ManageTasks />} />
          <Route path='/admin/manage-user' element={<ManageUsers />} />
          </Route>

          {/* User Routes */}
          <Route element={<PrivateRoute allowedRoles={['member']} />}>
          <Route path='/user/dashboard' element={<UserDashboard />} />
          <Route path='/user/my-tasks' element={<MyTasks />} />
          <Route path='/user/update-task/:taskId' element={<UserUpdateTask />} />
          <Route path='/user/task-details' element={<Navigate to='/user/my-tasks' replace />} />
          </Route>
        </Routes>
    </div>
  )
}

export default App
