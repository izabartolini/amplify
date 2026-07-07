import './ProfileSidebar.css'
import { useState } from 'react'

function ProfileSidebar({ user, isOwnProfile }) {
  const [following, setFollowing] = useState(false)

  if (!user) {
        return null; // ou um Skeleton/Loader
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
                onClick={() => setFollowing(!following)}
              >
                {following ? 'Seguindo' : 'Seguir'}
              </button>
              <button className="btn-mensagem">✉️</button>
            </div>
          )}
        </div>
        <p className="sidebar-username">@{user.username}</p>

        <div className="sidebar-follow-count">
          <span><strong>{user.followers}</strong> seguidores</span>
          <span><strong>{user.following}</strong> seguindo</span>
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
    </aside>
  )
}

export default ProfileSidebar