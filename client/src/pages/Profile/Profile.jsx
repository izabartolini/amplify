import { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import ProfileSidebar from '../../components/ProfileSidebar/ProfileSidebar'
import './Profile.css'
import exemploFoto from '../../assets/kirk.jpeg'

const mockUser = {
  name: 'João Silva',
  username: 'joaosilva',
  profilePicture: exemploFoto,
  bio: 'Tocando há 8 anos, sempre em busca de gente pra formar banda e subir ao palco.',
  instrument: '#baixo',
  level: '#iniciante',
  city: 'Campo Mourão',
  state: 'PR',
  followers: 1846,
  following: 623,
  tags: ['rock', 'acústico', 'pop', 'experimental', 'autoral', 'cover', 'banda', 'vocal', 'guitarra', 'bateria', 'teclado', 'sintetizador'],
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