import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import PostCard from '../../components/PostCard/PostCard'
import './Feed.css'

function Feed() {
  const [posts, setPosts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchPosts() {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:8080/api/posts', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (!response.ok) throw new Error('Erro ao buscar posts')
        const data = await response.json()
        const posts = Array.isArray(data) ? data : []
        setPosts(posts)
        setFiltered(posts)
      } catch (err) {
        setError('Não foi possível carregar o feed.')
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  function handleSearch(value) {
    if (!value.trim()) {
      setFiltered(posts)
    } else {
      setFiltered(posts.filter(p =>
        p.subtitle?.toLowerCase().includes(value.toLowerCase())
      ))
    }
  }

  return (
    <div className="feed-page">
      <Navbar onSearch={handleSearch} />
      <div className="feed-tabs">
        <Link to="/feed" className="feed-tab feed-tab-active">feed</Link>
        <Link to="/eventos" className="feed-tab">eventos</Link>
        <Link to="/amplifique" className="feed-tab">amplifique</Link>
      </div>

      <div className="feed-content">
        {loading && <p className="feed-status">Carregando...</p>}
        {error && <p className="feed-status">{error}</p>}
        {!loading && !error && filtered.length === 0 && (
          <p className="feed-status">Nenhum post encontrado.</p>
        )}
        {!loading && !error && filtered.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}

export default Feed