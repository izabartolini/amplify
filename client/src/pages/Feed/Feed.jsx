import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import FeedPostCard from '../../components/FeedPostCard/FeedPostCard'
import './Feed.css'
import guitarImg from '../../assets/IMG_1769.jpeg'
import pianoImg from '../../assets/IMG_1770.jpeg'

const mockFeedPosts = [
  {
    id: 1,
    user: { name: 'Maria Souza', username: 'mariasouza', profile_picture: null, city: 'Curitiba', state: 'PR' },
    subtitle: 'Trocando a Stratocaster por uns minutos só pra sentir esse timbre vintage de novo. Tem coisa melhor que um sunburst bem desgastado?',
    medias: [
      { id: 1, url: guitarImg, type: 'photo' },
    ],
    likes: [{}, {}, {}],
    comments: [{}, {}],
  },
  {
    id: 2,
    user: { name: 'João Pedro', username: 'joaopedro', profile_picture: null, city: 'Campo Mourão', state: 'PR' },
    subtitle: 'Ensaiando até tarde de novo. Entre o teclado e a guitarra, ainda não decidi qual vai entrar na próxima música, mas a partitura já está pronta.',
    medias: [
      { id: 2, url: pianoImg, type: 'photo' },
    ],
    likes: [{}, {}, {}, {}, {}],
    comments: [{}],
  },
  {
    id: 3,
    user: { name: 'Ana Beatriz', username: 'anabeatriz', profile_picture: null, city: 'Maringá', state: 'PR' },
    subtitle: 'Alguém recomenda um bom baterista pra um projeto autoral? Estilo mais alternativo/indie.',
    medias: [],
    likes: [{}],
    comments: [{}, {}, {}],
  },
]

function Feed() {
  return (
    <div className="feed-page">
      <Navbar />
      <div className="feed-tabs">
        <Link to="/feed" className="feed-tab feed-tab-active">feed</Link>
        <Link to="/eventos" className="feed-tab">eventos</Link>
        <Link to="/amplifique" className="feed-tab">amplifique</Link>
      </div>

      <div className="feed-content">
        {mockFeedPosts.map(post => (
          <FeedPostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}

export default Feed