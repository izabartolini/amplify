import { useParams, Link } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import './EventDetails.css'

const mockEventos = [
  {
    id: '1',
    name: 'Jam Session — Bar do Zé',
    description: 'Encontro aberto para músicos de todos os níveis. Traga seu instrumento e venha tocar com a gente! Vamos formar grupos espontâneos e revezar entre estilos, do rock ao MPB. Bebidas e petiscos disponíveis no local.',
    date: '2026-07-10T19:00:00-03:00',
    place: 'Bar do Zé',
    city: 'Campo Mourão',
    state: 'PR',
    is_private: false,
    organizer: { name: 'João Silva', username: 'joaosilva' },
  },
  {
    id: '2',
    name: 'Workshop de Técnica Vocal',
    description: 'Aula aberta com foco em respiração, projeção e afinação para cantores amadores. Ideal para quem está começando ou quer destravar a técnica.',
    date: '2026-07-15T18:00:00-03:00',
    place: 'Estúdio Harmonia',
    city: 'Maringá',
    state: 'PR',
    is_private: false,
    organizer: { name: 'Marina Castello', username: 'marinacastello' },
  },
  {
    id: '3',
    name: 'Ensaio fechado — Banda Resgate',
    description: 'Ensaio para o show de agosto. Apenas integrantes confirmados.',
    date: '2026-07-05T15:00:00-03:00',
    place: 'Estúdio Central',
    city: 'Campo Mourão',
    state: 'PR',
    is_private: true,
    organizer: { name: 'Eduardo da Silva', username: 'genioedu' },
  },
]

function EventDetails() {
  const { id } = useParams()
  const event = mockEventos.find(e => e.id === id)

  if (!event) {
    return (
      <div className="event-details-page">
        <Navbar />
        <p className="event-not-found">Evento não encontrado.</p>
      </div>
    )
  }

  const date = new Date(event.date)

  return (
    <div className="event-details-page">
      <Navbar />
      <div className="event-details-content">
        <Link to="/eventos" className="back-link">← Voltar para eventos</Link>

        <div className="event-details-card">
          <div className="event-details-header">
            <div className="event-date-badge-large">
              <span className="event-day-large">{date.getDate()}</span>
              <span className="event-month-large">{date.toLocaleDateString('pt-BR', { month: 'short' })}</span>
            </div>
            <div>
              <h1 className="event-details-name">{event.name}</h1>
              <p className="event-details-organizer">
                Organizado por <strong>{event.organizer.name}</strong> (@{event.organizer.username})
              </p>
            </div>
          </div>

          <p className="event-details-description">{event.description}</p>

          <div className="event-details-meta">
            <span>📍 {event.place}</span>
            <span>{event.city}, {event.state}</span>
            {event.is_private && <span className="event-details-private">🔒 Evento privado</span>}
          </div>

          <button className="btn-participar">
            {event.is_private ? 'Solicitar participação' : 'Participar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EventDetails