import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import './Usuarios.css'

function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchUsuarios()
  }, [])

  async function fetchUsuarios(name = '') {
    setLoading(true)
    setError('')
    try {
      const url = name
        ? `http://localhost:8080/userByName?name=${encodeURIComponent(name)}`
        : `http://localhost:8080/user`
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!response.ok) throw new Error('Erro ao buscar usuários')
      const data = await response.json()
      setUsuarios(data)
    } catch (err) {
      setError('Não foi possível carregar os usuários.')
    } finally {
      setLoading(false)
    }
  }

  function handleSearch(e) {
    const value = e.target.value
    setSearch(value)
    if (value.length === 0 || value.length >= 2) {
      fetchUsuarios(value)
    }
  }

  return (
    <div className="usuarios-page">
      <Navbar />
      <div className="feed-tabs">
        <Link to="/feed" className="feed-tab">feed</Link>
        <Link to="/eventos" className="feed-tab">eventos</Link>
        <Link to="/amplifique" className="feed-tab feed-tab-active">amplifique</Link>
      </div>
      <div className="usuarios-content">
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={search}
          onChange={handleSearch}
          className="usuarios-search"
        />

        {loading && <p className="usuarios-status">Carregando...</p>}
        {error && <p className="usuarios-status">{error}</p>}
        {!loading && !error && usuarios.length === 0 && (
          <p className="usuarios-status">Nenhum músico encontrado.</p>
        )}

        {!loading && !error && (
          <div className="usuarios-grid">
            {usuarios.map(user => (
              <Link to={`/profile/${user.ID}`} key={user.ID} className="usuario-card">
                <img
                  src={'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.Name || 'U') + '&background=8B1A1A&color=fff&size=80'}
                  alt={user.Name}
                  className="usuario-avatar"
                />
                <div className="usuario-info">
                  <span className="usuario-name">{user.Name}</span>
                  <span className="usuario-username">@{user.Username}</span>
                  {user.City && (
                    <span className="usuario-location">📍 {user.City}, {user.State}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Usuarios