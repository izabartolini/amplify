import './PostCard.css'
import { Link } from 'react-router-dom'

function PostCard({ post }) {
  const avatarUrl = post.user?.profile_picture
    || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(post.user?.name || 'U') + '&background=8B1A1A&color=fff&size=48'

  return (
    <div className="post-card">
      <div className="post-header">
        <Link to={`/profile/${post.user?.id}`} className="post-author-link">
          <img src={avatarUrl} alt={post.user?.name} className="post-avatar" />
          <div className="post-author">
            <span className="post-name">{post.user?.username}</span>
            <span className="post-location">
              {post.user?.city && post.user?.state
                ? `${post.user.city}, ${post.user.state}`
                : 'Localização não informada'}
            </span>
          </div>
        </Link>
      </div>

      <Link to={`/posts/${post.id}`} className="post-body-link">
        {post.medias && post.medias.length > 0 && (
          <div className="post-medias">
            {post.medias.map((media) => (
              <img key={media.id} src={media.url} alt="post media" className="post-media-img" />
            ))}
          </div>
        )}

        {post.subtitle && (
          <p className="post-subtitle">{post.subtitle}</p>
        )}
      </Link>

      <div className="post-actions">
        <button className="post-action-btn">❤️</button>
        <button className="post-action-btn">💬</button>
      </div>
    </div>
  )
}

export default PostCard