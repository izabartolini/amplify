import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import EventCard from '../../components/EventCard/EventCard'
import './Eventos.css'

function Eventos() {
  const [eventos, setEventos] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [region, setRegion] = useState('')
  const [regions, setRegions] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchEventos() {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:8080/api/events', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (!response.ok) throw new Error('Erro ao buscar eventos')
        const data = await response.json()
        const events = Array.isArray(data) ? data : []
        setEventos(events)
        setFiltered(events)

        const uniqueRegions = [...new Set(
          events
            .filter(e => e.city && e.state)
            .map(e => `${e.city}, ${e.state}`)
        )].sort()
        setRegions(uniqueRegions)
      } catch (err) {
        setError('Não foi possível carregar os eventos.')
      } finally {
        setLoading(false)
      }
    }
    fetchEventos()
  }, [])

  function applyFilters(searchValue, regionValue) {
    let result = eventos
    if (searchValue.trim()) {
      result = result.filter(e =>
        e.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
        e.description?.toLowerCase().includes(searchValue.toLowerCase())
      )
    }
    if (regionValue) {
      result = result.filter(e =>
        `${e.city}, ${e.state}` === regionValue
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
    <div className="eventos-page">
      <Navbar onSearch={handleSearch} />
      <div className="feed-tabs">
        <Link to="/feed" className="feed-tab">feed</Link>
        <Link to="/eventos" className="feed-tab feed-tab-active">eventos</Link>
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

      <div className="eventos-content">
        {loading && <p className="feed-status">Carregando...</p>}
        {error && <p className="feed-status">{error}</p>}
        {!loading && !error && filtered.length === 0 && (
          <p className="feed-status">Nenhum evento encontrado.</p>
        )}
        {!loading && !error && filtered.map(evento => (
          <EventCard key={evento.id} event={{
            id: evento.id,
            name: evento.name,
            description: evento.description,
            date: evento.date,
            place: evento.place,
            city: evento.city,
            state: evento.state,
            is_private: evento.is_private,
          }} />
        ))}
      </div>
    </div>
  )
}

export default Eventos