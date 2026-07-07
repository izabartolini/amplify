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
  const [region, setRegion] = useState('')
  const [regions, setRegions] = useState([])
  const [search, setSearch] = useState('')

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

        const uniqueRegions = [...new Set(
          posts
            .filter(p => p.user?.city && p.user?.state)
            .map(p => `${p.user.city}, ${p.user.state}`)
        )].sort()
        setRegions(uniqueRegions)
      } catch (err) {
        setError('Não foi possível carregar o feed.')
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  function applyFilters(searchValue, regionValue) {
    let result = posts
    if (searchValue.trim()) {
      result = result.filter(p =>
        p.subtitle?.toLowerCase().includes(searchValue.toLowerCase())
      )
    }
    if (regionValue) {
      result = result.filter(p =>
        `${p.user?.city}, ${p.user?.state}` === regionValue
      )
    }
    setFiltered(result)
  }

  function handleSearch(value) {
    setSearch(value)
    applyFilters(value, region)
  }

  function handleRegion(value) {
    setRegion(value)
    applyFilters(search, value)
  }

  return (
    <div className="feed-page">
      <Navbar onSearch={handleSearch} />
      <div className="feed-tabs">
        <Link to="/feed" className="feed-tab feed-tab-active">feed</Link>
        <Link to="/eventos" className="feed-tab">eventos</Link>
        <Link to="/amplifique" className="feed-tab">amplifique</Link>
      </div>

      <div className="feed-filter">
        <select
          className="feed-region-select"
          value={region}
          onChange={e => handleRegion(e.target.value)}
        >
          <option value="">Todas as regiões</option>
          {regions.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        {region && (
          <button className="feed-clear-filter" onClick={() => handleRegion('')}>
            ✕ Limpar filtro
          </button>
        )}
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