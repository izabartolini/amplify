import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import ProfileSidebar from '../../components/ProfileSidebar/ProfileSidebar'
import './Profile.css'
import PostCard from '../../components/PostCard/PostCard'
import EventCard from '../../components/EventCard/EventCard'
import ActivityCard from '../../components/ActivityCard/ActivityCard'
import './Profile.css'
import { IconHome } from '@tabler/icons-react';

function Profile() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('posts')
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [events, setEvents] = useState([])
  const [activities, setActivities] = useState([])
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const loggedUserID = localStorage.getItem('userID')
  const isOwnProfile = String(loggedUserID) === String(id)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const headers = { 'Authorization': `Bearer ${token}` }

        const [userRes, postsRes, eventsRes, activityRes] = await Promise.all([
          fetch(`http://localhost:8080/api/users/${id}`, { headers }),
          fetch(`http://localhost:8080/api/users/${id}/posts`, { headers }),
          fetch(`http://localhost:8080/api/users/${id}/events`, { headers }),
          fetch(`http://localhost:8080/api/users/${id}/activity`, { headers }),
        ])

        const userData = await userRes.json()
        const postsData = await postsRes.json()
        const eventsData = await eventsRes.json()
        const activityData = await activityRes.json()

        setUser({
          name: userData.name,
          username: userData.username,
          profilePicture: userData.profile_picture,
          bio: userData.bio,
          city: userData.city,
          state: userData.state,
          country: userData.country,
          followers: userData.followers_count,
          following: userData.following_count,
          tags: userData.tags?.map(t => t.Tag?.Name?.toLowerCase()) || [],
          instruments: userData.instruments?.map(i => ({
            name: i.Instrument?.Name?.toLowerCase(),
            level: i.Level
          })) || [],
        })
        setPosts(postsData.map(p => ({
          id: p.ID,
          subtitle: p.Subtitle,
          created_at: p.CreatedAt,
          user: p.User ? {
            id: p.User.ID,        // adiciona essa linha
            name: p.User.Name,
            username: p.User.Username,
            profile_picture: p.User.ProfilePicture,
            city: p.User.City,
            state: p.User.State,
          } : null,
          medias: (p.Medias || []).map(m => ({
            id: m.ID,
            url: m.Url,
            type: m.Type,
          })),
          likes: p.Likes || [],
          comments: p.Comments || [],
        })))
        setEvents(eventsData.map(e => ({
          id: e.ID,
          name: e.Name,
          description: e.Description,
          date: e.Date,
          place: e.Place,
          city: e.City,
          state: e.State,
          is_private: e.IsPrivate,
        })))
        setActivities(Array.isArray(activityData) ? activityData : [])

        if (!isOwnProfile) {
          const followRes = await fetch(`http://localhost:8080/api/users/${id}/follow`, { headers })
          const followData = await followRes.json()
          setIsFollowing(followData.is_following)
        }
      } catch (err) {
        console.error('Erro ao carregar perfil:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [id])

  if (loading) return <div className="profile-page"><Navbar /><p style={{ textAlign: 'center', marginTop: '48px' }}>Carregando...</p></div>
  if (!user) return <div className="profile-page"><Navbar /><p style={{ textAlign: 'center', marginTop: '48px' }}>Usuário não encontrado.</p></div>

  const handleNovoClick = () => {
    if (activeTab === 'posts') navigate(`/profile/${id}/createPost`);
    if (activeTab === 'eventos') navigate('/eventos/criar-evento');
    if (activeTab === 'atividade') navigate('/nova-atividade');
  };

  const getBtnLabel = () => {
    if (activeTab === 'posts') return 'Novo Post';
    if (activeTab === 'eventos') return 'Novo Evento';
    if (activeTab === 'atividade') return 'Nova Atividade';
    return 'Novo';
  };

  if (loading) return <div className="profile-page"><Navbar /><p style={{ textAlign: 'center', marginTop: '48px' }}>Carregando...</p></div>
  if (!user) return <div className="profile-page"><Navbar /><p style={{ textAlign: 'center', marginTop: '48px' }}>Usuário não encontrado.</p></div>
  console.log(user);
  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-body">
        <ProfileSidebar user={user} isOwnProfile={isOwnProfile} initialFollowing={isFollowing} />

        <main className="profile-content">

          <div className="profile-header-actions">

            <div className="profile-tabs">
              <button
                className="btn-home"
                onClick={() => navigate('/feed')}
                title="Voltar ao Feed"
              >
                <IconHome size={22} stroke={2.5} />
              </button>

              <button className={`tab ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => setActiveTab('posts')}>
                Posts
              </button>
              <button className={`tab ${activeTab === 'eventos' ? 'active' : ''}`} onClick={() => setActiveTab('eventos')}>
                Eventos Organizados
              </button>
              <button className={`tab ${activeTab === 'atividade' ? 'active' : ''}`} onClick={() => setActiveTab('atividade')}>
                Atividades
              </button>
            </div>
            {isOwnProfile && token && (
              <button className="btn-novo-dinamico" onClick={handleNovoClick}>
                {getBtnLabel()}
              </button>
            )}

          </div>

          <div className="profile-tab-content">
            {activeTab === 'posts' && (
              posts.length === 0
                ? <p className="empty-state">Nenhum post ainda.</p>
                : posts.map(post => <PostCard key={post.id} post={post} />)
            )}
            {activeTab === 'eventos' && (
              events.length === 0
                ? <p className="empty-state">Nenhum evento ainda.</p>
                : events.map(event => <EventCard key={event.id} event={event} />)
            )}
            {activeTab === 'atividade' && (
              activities.length === 0
                ? <p className="empty-state">Nenhuma atividade ainda.</p>
                : activities.map(activity => <ActivityCard key={activity.id} activity={activity} />)
            )}
          </div>

        </main>
      </div>
    </div>
  )
}

export default Profile;