import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Navbar.css'
import User from "../../assets/user.png"
import Home from "../../assets/home.png"
import Notification from "../../assets/notification.png"

function Navbar({ onSearch }) {
  const [search, setSearch] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  
  const [userData, setUserData] = useState({
    name: "Usuário",
    profilePicture: User
  })

  const token = localStorage.getItem('token')
  const loggedUserID = localStorage.getItem('userID')

  useEffect(() => {
    if (!loggedUserID || !token) return

    fetch(`http://localhost:8080/api/users/${loggedUserID}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data) {
          setUserData({
            name: data.name || "Usuário",
            profilePicture: data.profile_picture || User
          })
        }
      })
      .catch(err => console.error("Erro ao carregar dados na Navbar:", err))
  }, [loggedUserID, token])

  const fetchNotifications = () => {
    if (!token) return
    fetch(`http://localhost:8080/api/notifications`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setNotifications(Array.isArray(data) ? data : []))
      .catch(err => console.error("Erro ao carregar notificações:", err))
  }

  useEffect(() => {
    fetchNotifications()
  }, [token])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleNotifications = () => {
    setIsNotifOpen(!isNotifOpen)
    setIsMenuOpen(false)
  }

  const handleNotificationClick = (notif) => {
    if (!notif.read) {
      fetch(`http://localhost:8080/api/notifications/${notif.id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(() => fetchNotifications())
        .catch(err => console.error("Erro ao marcar notificação como lida:", err))
    }
    if (notif.post_id) {
      navigate(`/posts/${notif.post_id}`)
    } else {
      navigate(`/profile/${notif.actor.id}`)
    }
    setIsNotifOpen(false)
  }

  const notifText = (notif) => {
    if (notif.type === 'like') return `curtiu seu post`
    if (notif.type === 'comment') return `comentou no seu post`
    if (notif.type === 'follow') return `começou a seguir você`
    return ''
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const handleLogout = () => {
    localStorage.clear() 
    setIsMenuOpen(false)
    navigate("/login")
  }

  const handleDeleteProfile = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/me`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok || response.status === 204) {
        setIsDeleteModalOpen(false)
        handleLogout() 
      } else {
        alert("Erro ao deletar o perfil. Tente novamente.")
      }
    } catch (err) {
      console.error("Erro ao deletar perfil:", err)
    }
  }

  function handleSearch(e) {
    const value = e.target.value
    setSearch(value)
    if (onSearch) {
      onSearch(value)
    }
  }

  function getPlaceholder() {
    if (location.pathname === '/feed') return 'Buscar posts...'
    if (location.pathname === '/eventos') return 'Buscar eventos...'
    if (location.pathname === '/amplifique') return 'Buscar músicos...'
    return 'Buscar...'
  }

  return (
    <header className="navbar">
      <Link to="/feed" className="logo-text amplify-logo navbar-logo" style={{textDecoration: 'none'}}>Amplify</Link>
      <input
        className="navbar-search"
        type="text"
        placeholder={getPlaceholder()}
        value={search}
        onChange={handleSearch}
      />
      <div className="navbar-icons">
        <span onClick={() => navigate("/feed")}>
          <img src={Home} alt="Home" />
        </span>
        
        <span onClick={toggleNotifications} className="notification-trigger" style={{ position: 'relative' }}>
          <img src={Notification} alt="Notificações" />
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount}</span>
          )}
        </span>

        {isNotifOpen && (
          <menu className="navbar-notifications-dropdown">
            <h1 className="dropdown-notif-title">Notificações</h1>
            {notifications.length === 0 && (
              <p className="dropdown-notif-empty">Nenhuma notificação ainda.</p>
            )}
            {notifications.map(notif => (
              <div
                key={notif.id}
                className={`notification-item ${notif.read ? '' : 'notification-unread'}`}
                onClick={() => handleNotificationClick(notif)}
              >
                <img src={notif.actor.profile_picture || User} alt={notif.actor.name} className="notification-avatar rounded-circle" />
                <p><strong>{notif.actor.name}</strong> {notifText(notif)}</p>
              </div>
            ))}
          </menu>
        )}

        <span onClick={toggleMenu} className="avatar-trigger">
          <img src={userData.profilePicture} alt="Perfil" className="navbar-avatar rounded-circle" />
        </span>

        {isMenuOpen && (
          <menu className="navbar-dropdown">
            <div className="dropdown-header" onClick={() => { setIsMenuOpen(false); navigate(`/profile/${loggedUserID}`); }} style={{ cursor: 'pointer' }}>
              <div className="avatar-container">
                <img src={userData.profilePicture} alt="User Avatar" className="dropdown-avatar-img rounded-circle" />
              </div>
              <h1 className="dropdown-username">{userData.name}</h1>
              {userData.username && <p className="dropdown-user-handle">@{userData.username}</p>}
            </div>
            
            <div className="dropdown-links">
              <button onClick={() => { navigate("/profile/edit"); setIsMenuOpen(false); }}>
                Edit profile
              </button>
              
              <button onClick={(e) => { e.preventDefault(); handleLogout(); }} className="logout-btn">
                Logout
              </button>
              
              <button onClick={() => { setIsDeleteModalOpen(true); setIsMenuOpen(false); }} className="delete-btn">
                Delete profile
              </button>
            </div>
          </menu>
        )}
      </div>

      {isDeleteModalOpen && (
        <div className="modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Excluir Conta</h3>
              <button className="modal-close" onClick={() => setIsDeleteModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p>Tem certeza absoluta que deseja deletar seu perfil? Esta ação não pode ser desfeita.</p>
            </div>
            <div className="modal-actions">
              <button className="btn-cancelar" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</button>
              <button className="btn-confirmar-deletar" onClick={handleDeleteProfile}>Sim, Deletar Conta</button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar