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
      } catch (err) {
        setError('Não foi possível carregar os eventos.')
      } finally {
        setLoading(false)
      }
    }
    fetchEventos()
  }, [])

  function handleSearch(value) {
    if (!value.trim()) {
      setFiltered(eventos)
    } else {
      setFiltered(eventos.filter(e =>
        e.Name?.toLowerCase().includes(value.toLowerCase()) ||
        e.Description?.toLowerCase().includes(value.toLowerCase())
      ))
    }
  }

  return (
    <div className="eventos-page">
      <Navbar onSearch={handleSearch} />
      <div className="feed-tabs">
        <Link to="/feed" className="feed-tab">feed</Link>
        <Link to="/eventos" className="feed-tab feed-tab-active">eventos</Link>
        <Link to="/amplifique" className="feed-tab">amplifique</Link>
      </div>

      <div className="eventos-content">
        {loading && <p className="feed-status">Carregando...</p>}
        {error && <p className="feed-status">{error}</p>}
        {!loading && !error && filtered.length === 0 && (
          <p className="feed-status">Nenhum evento encontrado.</p>
        )}
        {!loading && !error && filtered.map(evento => (
          <EventCard key={evento.ID} event={{
            id: evento.ID,
            name: evento.Name,
            description: evento.Description,
            date: evento.Date,
            place: evento.Place,
            city: evento.City,
            state: evento.State,
            is_private: evento.IsPrivate,
          }} />
        ))}
      </div>
    </div>
  )
}

export default Eventos