import './FeedPostCard.css'

function FeedPostCard({ post }) {
  const avatarUrl = post.user?.profile_picture
    || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(post.user?.name || 'U') + '&background=8B1A1A&color=fff&size=48'

  return (
    <div className="feed-post-card">
      <div className="feed-post-header">
        <img src={avatarUrl} alt={post.user?.name} className="feed-post-avatar" />
        <div className="feed-post-author">
          <span className="feed-post-name">{post.user?.username}</span>
          <span className="feed-post-location">
            {post.user?.city && post.user?.state
              ? `${post.user.city}, ${post.user.state}`
              : 'Localização não informada'}
          </span>
        </div>
      </div>

      {post.medias && post.medias.length > 0 && (
        <div className="feed-post-medias">
          {post.medias.map((media) => (
            <img key={media.id} src={media.url} alt="post media" className="feed-post-media-img" />
          ))}
        </div>
      )}

      <div className="feed-post-actions">
        <button className="feed-action-btn">❤️</button>
        <button className="feed-action-btn">💬</button>
        <button className="feed-action-btn">↗️</button>
      </div>

      {post.subtitle && (
        <p className="feed-post-subtitle">{post.subtitle}</p>
      )}
    </div>
  )
}

export default FeedPostCard