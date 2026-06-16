import { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import ProfileSidebar from '../../components/ProfileSidebar/ProfileSidebar'
import './Profile.css'

const mockUser = {
  name: 'User',
  username: 'username',
  profilePicture: null,
  bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ex augue, scelerisque in elit faucibus.',
  instrument: '#instrumento',
  level: '#nível',
  city: 'Campo Mourão',
  state: 'PR',
  followers: 123,
  following: 321,
  tags: ['rock', 'jazz', 'acústico'],
}

function Profile() {
  const [activeTab, setActiveTab] = useState('posts')

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-body">
        <ProfileSidebar user={mockUser} isOwnProfile={false} />
        <main className="profile-content">
          <div className="profile-tabs">
            <button
              className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
              onClick={() => setActiveTab('posts')}
            >
              posts
            </button>
            <button
              className={`tab ${activeTab === 'eventos' ? 'active' : ''}`}
              onClick={() => setActiveTab('eventos')}
            >
              eventos
            </button>
            <button
              className={`tab ${activeTab === 'atividade' ? 'active' : ''}`}
              onClick={() => setActiveTab('atividade')}
            >
              atividade
            </button>
          </div>

          <div className="profile-tab-content">
            {activeTab === 'posts' && (
              <p className="empty-state">Nenhum post ainda.</p>
            )}
            {activeTab === 'eventos' && (
              <p className="empty-state">Nenhum evento ainda.</p>
            )}
            {activeTab === 'atividade' && (
              <p className="empty-state">Nenhuma atividade ainda.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Profile