import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const userID = localStorage.getItem('userID')

  return (
    <header className="navbar">
      <Link to="/feed" className="logo-text amplify-logo navbar-logo" style={{textDecoration: 'none'}}>Amplify</Link>
      <input className="navbar-search" type="text" placeholder="Buscar..." />
      <div className="navbar-icons">
        <span>🔔</span>
        <span>✉️</span>
        <Link to={`/profile/${userID}`}>👤</Link>
      </div>
    </header>
  )
}

export default Navbar