import './FeedPostCard.css'
import { Link } from 'react-router-dom'

function FeedPostCard({ post }) {
  const avatarUrl = post.user?.profile_picture
    || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(post.user?.name || 'U') + '&background=8B1A1A&color=fff&size=48'

  return (
    <div className="feed-post-card">
      <div className="feed-post-header">
        <Link to={`/profile/${post.user?.id}`} className="feed-post-author-link">
          <img src={avatarUrl} alt={post.user?.name} className="feed-post-avatar" />
          <div className="feed-post-author">
            <span className="feed-post-name">{post.user?.username}</span>
            <span className="feed-post-location">
              {post.user?.city && post.user?.state
                ? `${post.user.city}, ${post.user.state}`
                : 'Localização não informada'}
            </span>
          </div>
        </Link>
      </div>

      <Link to={`/posts/${post.id}`} className="feed-post-body-link">
        {post.medias && post.medias.length > 0 && (
          <div className="feed-post-medias">
            {post.medias.map((media) => (
              <img key={media.id} src={media.url} alt="post media" className="feed-post-media-img" />
            ))}
          </div>
        )}

        {post.subtitle && (
          <p className="feed-post-subtitle">{post.subtitle}</p>
        )}
      </Link>

      <div className="feed-post-actions">
        <button className="feed-action-btn">❤️</button>
        <button className="feed-action-btn">💬</button>
      </div>
    </div>
  )
}

export default FeedPostCard