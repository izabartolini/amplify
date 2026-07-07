import './ProfileSidebar.css'
import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'

function ProfileSidebar({ user, isOwnProfile, initialFollowing }) {
  const { id } = useParams()
  const [following, setFollowing] = useState(initialFollowing || false)
  const [modal, setModal] = useState(null) // 'followers' | 'following' | null
  const [modalUsers, setModalUsers] = useState([])
  const [modalLoading, setModalLoading] = useState(false)
  const token = localStorage.getItem('token')

  async function handleFollow() {
    try {
      const method = following ? 'DELETE' : 'POST'
      const response = await fetch(`http://localhost:8080/api/users/${id}/follow`, {
        method,
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok || response.status === 204) {
        setFollowing(!following)
      }
    } catch (err) {
      console.error('Erro ao seguir/deixar de seguir:', err)
    }
  }

  async function openModal(type) {
    setModal(type)
    setModalLoading(true)
    try {
      const response = await fetch(`http://localhost:8080/api/users/${id}/${type}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setModalUsers(Array.isArray(data) ? data : [])
    } catch (err) {
      setModalUsers([])
    } finally {
      setModalLoading(false)
    }
  }

  return (
    <aside className="profile-sidebar">
      <div className="sidebar-avatar">
        {user.profilePicture
          ? <img src={user.profilePicture} alt="avatar" />
          : <img
            src={'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name || 'U') + '&background=8B1A1A&color=fff&size=200'}
            alt="avatar"
          />
        }
      </div>

      <div className="sidebar-info">
        <div className="sidebar-name-row">
          <h2>{user.name}</h2>
          {!isOwnProfile && (
            <div className="sidebar-actions">
              <button
                className={`btn-seguir ${following ? 'btn-seguindo' : ''}`}
                onClick={handleFollow}
              >
                {following ? 'Seguindo' : 'Seguir'}
              </button>
              <button className="btn-mensagem">✉️</button>
            </div>
          )}
        </div>
        <p className="sidebar-username">@{user.username}</p>

        <div className="sidebar-follow-count">
          <button className="follow-count-btn" onClick={() => openModal('followers')}>
            <strong>{user.followers}</strong> seguidores
          </button>
          <button className="follow-count-btn" onClick={() => openModal('following')}>
            <strong>{user.following}</strong> seguindo
          </button>
        </div>

        {user.city && (
          <p className="sidebar-location">📍 {user.city}, {user.state}</p>
        )}

        {user.bio && <p className="sidebar-bio">{user.bio}</p>}

        <div className="sidebar-badges">
          {user.instrument && <span className="badge badge-instrument">{user.instrument}</span>}
          {user.level && <span className="badge badge-level">{user.level}</span>}
        </div>

        {user.tags && user.tags.length > 0 && (
          <div className="sidebar-tags">
            {user.tags.map((tag, index) => (
              <span key={index} className="tag">#{tag}</span>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modal === 'followers' ? 'Seguidores' : 'Seguindo'}</h3>
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            {modalLoading && <p className="modal-status">Carregando...</p>}
            {!modalLoading && modalUsers.length === 0 && (
              <p className="modal-status">Nenhum usuário ainda.</p>
            )}
            {!modalLoading && modalUsers.map(u => (
              <Link
                to={`/profile/${u.ID}`}
                key={u.ID}
                className="modal-user"
                onClick={() => setModal(null)}
              >
                <img
                  src={'https://ui-avatars.com/api/?name=' + encodeURIComponent(u.Name || 'U') + '&background=8B1A1A&color=fff&size=40'}
                  alt={u.Name}
                  className="modal-avatar"
                />
                <div>
                  <span className="modal-name">{u.Name}</span>
                  <span className="modal-username">@{u.Username}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}

export default ProfileSidebar