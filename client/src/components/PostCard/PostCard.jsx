import { useState } from 'react'
import { Link } from 'react-router-dom'
import './PostCard.css'

function PostCard({ post }) {
  const token = localStorage.getItem('token')
  const loggedUserID = parseInt(localStorage.getItem('userID'))
  const [liked, setLiked] = useState(
  post.likes?.some(l => l.UserID === loggedUserID || l.user_id === loggedUserID) ?? false
)
  const [likeCount, setLikeCount] = useState(post.likes?.length ?? 0)
  const [showComment, setShowComment] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState(post.comments || [])

  const avatarUrl = post.user?.profile_picture
    || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(post.user?.name || 'U') + '&background=8B1A1A&color=fff&size=48'

  async function handleLike() {
    try {
      const method = liked ? 'DELETE' : 'POST'
      const response = await fetch(`http://localhost:8080/api/posts/${post.id}/like`, {
        method,
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok || response.status === 204) {
        setLiked(!liked)
        setLikeCount(prev => liked ? prev - 1 : prev + 1)
      }
    } catch (err) {
      console.error('Erro ao curtir:', err)
    }
  }

  async function handleComment() {
    if (!commentText.trim()) return
    try {
      const response = await fetch(`http://localhost:8080/api/posts/${post.id}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: commentText })
      })
      if (response.ok) {
        const data = await response.json()
        setComments(prev => [...prev, data])
        setCommentText('')
        setShowComment(false)
      }
    } catch (err) {
      console.error('Erro ao comentar:', err)
    }
  }

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
        <button className="post-action-btn" onClick={handleLike}>
          {liked ? '❤️' : '🤍'} {likeCount}
        </button>
        <button className="post-action-btn" onClick={() => setShowComment(!showComment)}>
          💬 {comments.length}
        </button>
      </div>

      {showComment && (
        <div className="post-comment-input">
          <input
            type="text"
            placeholder="Escreva um comentário..."
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleComment()}
          />
          <button onClick={handleComment}>Enviar</button>
        </div>
      )}
    </div>
  )
}

export default PostCard