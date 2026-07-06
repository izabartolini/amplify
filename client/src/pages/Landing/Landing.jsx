import { useNavigate } from 'react-router-dom'
import speakersImg from '../../assets/speakers.png'
import starImg from '../../assets/star.png'
import './Landing.css'

function Landing() {
  const navigate = useNavigate()

  return (
    <div className="landing-container">
      <div className="landing-speakers">
        <div className="speakers-with-star">
          <img src={starImg} alt="star" className="star-img" />
          <img src={speakersImg} alt="speakers" className="speaker-img" />
        </div>
      </div>

      <div className="landing-center">
        <h1 className="logo-text amplify-logo">Amplify</h1>
        <p className="slogan">Amplifique suas conexões.<br />Viva a música ao vivo.</p>
        <button className="btn-entrar-landing" onClick={() => navigate('/login')}>
          Entrar
        </button>
      </div>
    </div>
  )
}

export default Landing