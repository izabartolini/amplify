import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing/Landing'
import Login from './pages/Login/Login'
import Profile from './pages/Profile/Profile'
import Register from './pages/Register/Register'
import ForgotPassword from './pages/ForgotPassword/ForgotPassword'
import Feed from './pages/Feed/Feed'
import Eventos from './pages/Eventos/Eventos'
import EventDetails from './pages/EventDetails/EventDetails'
import Usuarios from './pages/Usuarios/Usuarios'
import CreatePost from './pages/CreatePost/CreatePost'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/register/" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/eventos/:id" element={<EventDetails />} />
        <Route path="/amplifique" element={<Usuarios />} />
        <Route path="/profile/:id/createPost" element={<CreatePost />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App