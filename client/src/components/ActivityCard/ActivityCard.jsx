import { Link } from 'react-router-dom'
import './ActivityCard.css'

function ActivityCard({ activity }) {
  const date = new Date(activity.created_at).toLocaleDateString('pt-BR')

  if (activity.type === 'like') {
    return (
      <Link to={`/posts/${activity.post_id}`} className="activity-card">
        <span className="activity-icon">❤️</span>
        <div className="activity-info">
          <p className="activity-text">
            curtiu o post de <strong>@{activity.post_author?.username}</strong>: "{activity.post_subtitle}"
          </p>
          <span className="activity-date">{date}</span>
        </div>
      </Link>
    )
  }

  if (activity.type === 'comment') {
    return (
      <Link to={`/posts/${activity.post_id}`} className="activity-card">
        <span className="activity-icon">💬</span>
        <div className="activity-info">
          <p className="activity-text">
            comentou no post de <strong>@{activity.post_author?.username}</strong>: "{activity.text}"
          </p>
          <span className="activity-date">{date}</span>
        </div>
      </Link>
    )
  }

  if (activity.type === 'follow') {
    return (
      <Link to={`/profile/${activity.followed_user?.id}`} className="activity-card">
        <span className="activity-icon">👤</span>
        <div className="activity-info">
          <p className="activity-text">
            começou a seguir <strong>@{activity.followed_user?.username}</strong>
          </p>
          <span className="activity-date">{date}</span>
        </div>
      </Link>
    )
  }

  return null
}

export default ActivityCard