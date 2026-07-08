import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import './PostDetails.css'

function PostDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState([])
  const [showMenu, setShowMenu] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [commentMenu, setCommentMenu] = useState(null)
  const token = localStorage.getItem('token')
  const loggedUserID = parseInt(localStorage.getItem('userID'))

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`http://localhost:8080/api/posts/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (!response.ok) throw new Error('Erro ao buscar post')
        const data = await response.json()
        setPost(data)
        setSubtitle(data.subtitle || '')
        setEditText(data.subtitle || '')
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
          const newComment = {
            id: data.id,
            text: data.text,
            created_at: data.created_at,
            user: {
                id: data.user?.ID,
                name: data.user?.Name,
                username: data.user?.Username,
                profile_picture: data.user?.ProfilePicture,
            }
        }
        setComments(prev => [...prev, newComment])
        setCommentText('')
      }
    } catch (err) {
      console.error('Erro ao comentar:', err)
    }
  }

  async function handleDeleteComment(commentId) {
    try {
      const response = await fetch(`http://localhost:8080/api/posts/${id}/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok || response.status === 204) {
        setComments(prev => prev.filter(c => c.id !== commentId))
      }
    } catch (err) {
      console.error('Erro ao deletar comentário:', err)
    }
  }

  async function handleEdit() {
    try {
      const response = await fetch(`http://localhost:8080/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ subtitle: editText })
      })
      if (response.ok) {
        setSubtitle(editText)
        setEditing(false)
        setShowMenu(false)
      }
    } catch (err) {
      console.error('Erro ao editar:', err)
    }
  }

  async function handleDelete() {
    try {
      const response = await fetch(`http://localhost:8080/api/posts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok || response.status === 204) {
        navigate('/feed')
      }
    } catch (err) {
      console.error('Erro ao deletar:', err)
    }
  }

  if (loading) return <div className="post-details-page"><Navbar /><p className="post-details-status">Carregando...</p></div>
  if (error) return <div className="post-details-page"><Navbar /><p className="post-details-status">{error}</p></div>
  if (!post) return null

  const isOwner = post.user?.id === loggedUserID
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
            <div className="post-details-header-right">
              <span className="post-details-date">
                {new Date(post.created_at).toLocaleDateString('pt-BR')}
              </span>
              {isOwner && (
                <div className="post-menu-wrapper">
                  <button className="post-menu-btn" onClick={() => setShowMenu(!showMenu)}>⋮</button>
                  {showMenu && (
                    <div className="post-menu">
                      <button onClick={() => { setEditing(true); setShowMenu(false) }}>Editar</button>
                      <button onClick={handleDelete} className="post-menu-delete">Excluir</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {editing ? (
            <div className="post-edit-input">
              <input
                type="text"
                value={editText}
                onChange={e => setEditText(e.target.value)}
              />
              <button onClick={handleEdit}>Salvar</button>
              <button onClick={() => setEditing(false)} className="post-edit-cancel">Cancelar</button>
            </div>
          ) : (
            subtitle && <p className="post-details-subtitle">{subtitle}</p>
          )}
          
          {post.medias && post.medias.length > 0 && (
            <div className="post-details-medias">
              {post.medias.map(media => (
                media.type === 'photo' ? (
                  <img key={media.id} src={media.url} alt="post media" className="post-details-media-img" />
                ) : (
                  <video key={media.id} src={media.url} controls className="post-details-media-video" />
                )
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
                <div className="comment-header">
                  <Link to={`/profile/${comment.user?.id}`} className="comment-author-link">
                    <img
                      src={'https://ui-avatars.com/api/?name=' + encodeURIComponent(comment.user?.name || 'U') + '&background=8B1A1A&color=fff&size=32'}
                      alt={comment.user?.name}
                      className="comment-avatar"
                    />
                    <span className="comment-username">@{comment.user?.username || 'usuário'}</span>
                  </Link>
                  {comment.user?.id === loggedUserID && (
                    <div className="comment-menu-wrapper">
                      <button className="comment-menu-btn" onClick={() => setCommentMenu(commentMenu === comment.id ? null : comment.id)}>⋮</button>
                      {commentMenu === comment.id && (
                        <div className="comment-menu">
                          <button onClick={() => { handleDeleteComment(comment.id); setCommentMenu(null) }} className="comment-menu-delete">Excluir</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
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