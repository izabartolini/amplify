import './ActivityCard.css'

function ActivityCard({ activity }) {
  return (
    <div className="activity-card">
      <span className="activity-icon">
        {activity.type === 'follow' ? '👤' : activity.type === 'like' ? '❤️' : '💬'}
      </span>
      <div className="activity-info">
        <p className="activity-text">{activity.text}</p>
        <span className="activity-date">
          {new Date(activity.created_at).toLocaleDateString('pt-BR')}
        </span>
      </div>
    </div>
  )
}

export default ActivityCard