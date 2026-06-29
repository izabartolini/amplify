import Navbar from '../../components/Navbar/Navbar'
import ProfileSidebar from '../../components/ProfileSidebar/ProfileSidebar'
import './Profile.css'
import PostCard from '../../components/PostCard/PostCard'
import EventCard from '../../components/EventCard/EventCard'
import ActivityCard from '../../components/ActivityCard/ActivityCard'
import { useState, useEffect } from 'react'

const mockUser = {
  name: 'João Silva',
  username: 'joaosilva',
  profilePicture:'',
  bio: 'Tocando há 8 anos, sempre em busca de gente pra formar banda e subir ao palco.',
  instrument: '#baixo',
  level: '#iniciante',
  city: 'Campo Mourão',
  state: 'PR',
  followers: 1846,
  following: 623,
  tags: ['rock', 'acústico', 'pop', 'experimental', 'autoral', 'cover', 'banda', 'vocal', 'guitarra', 'bateria', 'teclado', 'sintetizador'],
}

const mockPosts = [
  {
    id: 1,
    subtitle: 'Primeiro ensaio da banda nova 🎸 Animado demais com esse som!',
    created_at: '2026-06-20T18:00:00-03:00',
    user: { name: 'João Silva', username: 'joaosilva', profile_picture: null },
    medias: [{ id: 1, url: 'https://drive.google.com/exemplo', type: 'photo' }],
    likes: [{}, {}],
    comments: [{}],
  },
  {
    id: 2,
    subtitle: 'Alguém toca bateria por aqui? Precisando fechar formação.',
    created_at: '2026-06-15T14:30:00-03:00',
    user: { name: 'João Silva', username: 'joaosilva', profile_picture: null },
    medias: [],
    likes: [{}, {}, {}],
    comments: [],
  },
]

const mockEvents = [
  {
    id: 1,
    name: 'Jam Session — Bar do Zé',
    description: 'Encontro aberto para músicos de todos os níveis. Traga seu instrumento!',
    date: '2026-07-10T19:00:00-03:00',
    place: 'Bar do Zé',
    city: 'Campo Mourão',
    state: 'PR',
    is_private: false,
  },
  {
    id: 2,
    name: 'Ensaio fechado',
    description: 'Ensaio da banda para o show de agosto.',
    date: '2026-07-05T15:00:00-03:00',
    place: 'Estúdio Central',
    city: 'Campo Mourão',
    state: 'PR',
    is_private: true,
  },
]

const mockActivities = [
  {
    id: 1,
    type: 'follow',
    text: 'João Silva começou a seguir Marina Castello',
    created_at: '2026-06-20T10:00:00-03:00',
  },
  {
    id: 2,
    type: 'like',
    text: 'João Silva curtiu um post de John Doe',
    created_at: '2026-06-18T15:00:00-03:00',
  },
]

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
              mockPosts.length === 0
                ? <p className="empty-state">Nenhum post ainda.</p>
                : mockPosts.map(post => <PostCard key={post.id} post={post} />)
            )}
            {activeTab === 'eventos' && (
              mockEvents.length === 0
                ? <p className="empty-state">Nenhum evento ainda.</p>
                : mockEvents.map(event => <EventCard key={event.id} event={event} />)
            )}
            {activeTab === 'atividade' && (
              mockActivities.length === 0
                ? <p className="empty-state">Nenhuma atividade ainda.</p>
                : mockActivities.map(activity => <ActivityCard key={activity.id} activity={activity} />)
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Profile