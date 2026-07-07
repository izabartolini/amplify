import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import './PostDetails.css'

function PostDetails() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
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
      } catch (err) {
        setError('Não foi possível carregar o post.')
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [id])

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
            <span>💬 {post.comments?.length ?? 0}</span>
          </div>

          <div className="post-details-comments">
            <h3>Comentários</h3>
            {post.comments && post.comments.length === 0 && (
              <p className="post-details-no-comments">Nenhum comentário ainda.</p>
            )}
            {post.comments && post.comments.map(comment => (
              <div key={comment.id} className="post-details-comment">
                <Link to={`/profile/${comment.user?.id}`} className="comment-author-link">
                  <img
                    src={'https://ui-avatars.com/api/?name=' + encodeURIComponent(comment.user?.name || 'U') + '&background=8B1A1A&color=fff&size=32'}
                    alt={comment.user?.name}
                    className="comment-avatar"
                  />
                  <span className="comment-username">@{comment.user?.username}</span>
                </Link>
                <p className="comment-text">{comment.text}</p>
                <span className="comment-date">{new Date(comment.created_at).toLocaleDateString('pt-BR')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetails