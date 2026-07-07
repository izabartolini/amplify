import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import './PostDetails.css'

function PostDetails() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState([])
  const token = localStorage.getItem('token')

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`http://localhost:8080/api/posts/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (!response.ok) throw new Error('Erro ao buscar post')
        const data = await response.json()
        setPost(data)
        setComments(data.comments || [])
      } catch (err) {
        setError('Não foi possível carregar o post.')
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [id])

  async function handleComment() {
    if (!commentText.trim()) return
    try {
      const response = await fetch(`http://localhost:8080/api/posts/${id}/comments`, {
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
      }
    } catch (err) {
      console.error('Erro ao comentar:', err)
    }
  }

  if (loading) return <div className="post-details-page"><Navbar /><p className="post-details-status">Carregando...</p></div>
  if (error) return <div className="post-details-page"><Navbar /><p className="post-details-status">{error}</p></div>
  if (!post) return null

  const avatarUrl = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(post.user?.name || 'U') + '&background=8B1A1A&color=fff&size=48'

  return (
    <div className="post-details-page">
      <Navbar />
      <div className="post-details-content">
        <Link to="/feed" className="post-details-back">← Voltar para o feed</Link>

        <div className="post-details-card">
          <div className="post-details-header">
            <Link to={`/profile/${post.user?.id}`} className="post-details-author-link">
              <img src={avatarUrl} alt={post.user?.name} className="post-details-avatar" />
              <div>
                <span className="post-details-name">{post.user?.name}</span>
                <span className="post-details-username">@{post.user?.username}</span>
              </div>
            </Link>
            <span className="post-details-date">
              {new Date(post.created_at).toLocaleDateString('pt-BR')}
            </span>
          </div>

          {post.subtitle && <p className="post-details-subtitle">{post.subtitle}</p>}

          {post.medias && post.medias.length > 0 && (
            <div className="post-details-medias">
              {post.medias.map(media => (
                <a key={media.id} href={media.url} target="_blank" rel="noreferrer" className="post-details-media-link">
                  {media.type === 'photo' ? '🖼 Ver foto' : '🎥 Ver vídeo'}
                </a>
              ))}
            </div>
          )}

          <div className="post-details-stats">
            <span>❤️ {post.like_count ?? 0}</span>
            <span>💬 {comments.length}</span>
          </div>

          <div className="post-details-comments">
            <h3>Comentários</h3>

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

            {comments.length === 0 && (
              <p className="post-details-no-comments">Nenhum comentário ainda.</p>
            )}
            {comments.map((comment, index) => (
              <div key={comment.id || index} className="post-details-comment">
                <Link to={`/profile/${comment.user?.id}`} className="comment-author-link">
                  <img
                    src={'https://ui-avatars.com/api/?name=' + encodeURIComponent(comment.user?.name || 'U') + '&background=8B1A1A&color=fff&size=32'}
                    alt={comment.user?.name}
                    className="comment-avatar"
                  />
                  <span className="comment-username">@{comment.user?.username || 'usuário'}</span>
                </Link>
                <p className="comment-text">{comment.text || comment.Text}</p>
                <span className="comment-date">
                  {comment.created_at ? new Date(comment.created_at).toLocaleDateString('pt-BR') : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetails