import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import './Navbar.css'
import User from "../../assets/user.png"
import Home from "../../assets/home.png"
import Notification from "../../assets/notification.png"

function Navbar() {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [username, setUsername] = useState('Username') 

  useEffect(() => {
    const storedUser = localStorage.getItem('username') 
    if (storedUser) {
      setUsername(storedUser)
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = (e) => {
    e.preventDefault()
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    localStorage.clear() 
    setIsMenuOpen(false)
    navigate("/login")
  }

  const handleGoToProfile = () => {
    setIsMenuOpen(false)
    navigate(`/profile/${username}`) 
  }

  return (
    <header className="navbar">
      <Link to="/feed" className="logo-text amplify-logo navbar-logo" style={{textDecoration: 'none'}}>Amplify</Link>
      <input className="navbar-search" type="text" placeholder="Buscar..." />
      
      <div className="navbar-icons">
        <span onClick={() => navigate("/feed")}>
          <img src={Home} alt="Home" />
        </span>
        
        <span>
          <img src={Notification} alt="Notificações" />
        </span>

        <span onClick={toggleMenu} className="avatar-trigger">
          <img src={User} alt="Perfil" />
        </span>

        {isMenuOpen && (
          <menu className="navbar-dropdown">
            <div className="dropdown-header" onClick={handleGoToProfile} style={{ cursor: 'pointer' }}>
              <div className="avatar-container">
                <img src={User} alt="User Avatar" />
              </div>
              <h1 className="dropdown-username">{username}</h1>
            </div>
            
            <div className="dropdown-links">
              <button onClick={() => { navigate("/profile/edit"); setIsMenuOpen(false); }}>
                Edit profile
              </button>
              
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
              
              <button onClick={() => { navigate("/profile/delete"); setIsMenuOpen(false); }} className="delete-btn">
                Delete profile
              </button>
            </div>
          </menu>
        )}
      </div>
    </header>
  )
}

export default Navbar