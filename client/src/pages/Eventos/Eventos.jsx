import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import EventCard from '../../components/EventCard/EventCard'
import './Eventos.css'

const mockEventos = [
  {
    id: 1,
    name: 'Jam Session — Bar do Zé',
    description: 'Encontro aberto para músicos de todos os níveis. Traga seu instrumento e venha tocar com a gente!',
    date: '2026-07-10T19:00:00-03:00',
    place: 'Bar do Zé',
    city: 'Campo Mourão',
    state: 'PR',
    is_private: false,
  },
  {
    id: 2,
    name: 'Workshop de Técnica Vocal',
    description: 'Aula aberta com foco em respiração, projeção e afinação para cantores amadores.',
    date: '2026-07-15T18:00:00-03:00',
    place: 'Estúdio Harmonia',
    city: 'Maringá',
    state: 'PR',
    is_private: false,
  },
  {
    id: 3,
    name: 'Ensaio fechado — Banda Resgate',
    description: 'Ensaio para o show de agosto. Apenas integrantes confirmados.',
    date: '2026-07-05T15:00:00-03:00',
    place: 'Estúdio Central',
    city: 'Campo Mourão',
    state: 'PR',
    is_private: true,
  },
]

function Eventos() {
  return (
    <div className="eventos-page">
      <Navbar />
      <div className="feed-tabs">
        <Link to="/feed" className="feed-tab">feed</Link>
        <Link to="/eventos" className="feed-tab feed-tab-active">eventos</Link>
        <Link to="/amplifique" className="feed-tab">amplifique</Link>
      </div>

      <div className="eventos-content">
        {mockEventos.map(evento => (
          <EventCard key={evento.id} event={evento} />
        ))}
      </div>
    </div>
  )
}

export default Eventos