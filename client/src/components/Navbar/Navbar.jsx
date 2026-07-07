import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './Navbar.css'

function Navbar({ onSearch }) {
  const [search, setSearch] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const userID = localStorage.getItem('userID')

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
        <span>🔔</span>
        <span>✉️</span>
        <Link to={`/profile/${userID}`}>👤</Link>
      </div>
    </header>
  )
}

export default Navbar