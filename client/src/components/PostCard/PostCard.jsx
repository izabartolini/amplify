import './PostCard.css'

function PostCard({ post }) {
  return (
    <div className="post-card">
      <div className="post-card-header">
        <img
          src={'https://ui-avatars.com/api/?name=' + encodeURIComponent(post.user?.name || 'U') + '&background=8B1A1A&color=fff&size=40'}
          alt={post.user?.name}
          className="post-avatar"
        />
        <div className="post-author">
          <span className="post-author-name">{post.user?.name}</span>
          <span className="post-author-username">@{post.user?.username}</span>
        </div>
        <span className="post-date">
          {new Date(post.created_at).toLocaleDateString('pt-BR')}
        </span>
      </div>

      {post.subtitle && (
        <p className="post-subtitle">{post.subtitle}</p>
      )}

      {post.medias && post.medias.length > 0 && (
        <div className="post-medias">
          {post.medias.map((media) => (
            <a key={media.id} href={media.url} target="_blank" rel="noreferrer" className="post-media-link">
              {media.type === 'photo' ? '🖼 Ver foto' : '🎥 Ver vídeo'}
            </a>
          ))}
        </div>
      )}

      <div className="post-card-footer">
        <span>❤️ {post.likes?.length ?? 0}</span>
        <span>💬 {post.comments?.length ?? 0}</span>
      </div>
    </div>
  )
}

export default PostCard