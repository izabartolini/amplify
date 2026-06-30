import './Navbar.css'

function Navbar() {
  return (
    <header className="navbar">
      <h1 className="logo-text amplify-logo navbar-logo">Amplify</h1>
      <input className="navbar-search" type="text" placeholder="Buscar..." />
      <div className="navbar-icons">
        <span>🔔</span>
        <span>✉️</span>
        <span>👤</span>
      </div>
    </header>
  )
}

export default Navbar