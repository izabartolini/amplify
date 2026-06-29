import './EventCard.css'

function EventCard({ event }) {
  const date = new Date(event.date)

  return (
    <div className="event-card">
      <div className="event-date-badge">
        <span className="event-day">{date.getDate()}</span>
        <span className="event-month">{date.toLocaleDateString('pt-BR', { month: 'short' })}</span>
      </div>
      <div className="event-info">
        <h3 className="event-name">{event.name}</h3>
        {event.description && (
          <p className="event-description">{event.description}</p>
        )}
        <div className="event-meta">
          {event.place && <span>📍 {event.place}</span>}
          {event.city && <span>{event.city}, {event.state}</span>}
          {event.is_private && <span className="event-private">🔒 Privado</span>}
        </div>
      </div>
    </div>
  )
}

export default EventCard