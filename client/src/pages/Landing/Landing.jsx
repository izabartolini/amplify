import { useNavigate } from 'react-router-dom'
import speakerImg from '../../assets/speaker.png'
import './Landing.css'

function Landing() {
  const navigate = useNavigate()

  return (
    <div className="landing-container">
      <div className="landing-speakers">
        <div className="speaker-connector"></div>
        <img src={speakerImg} alt="speaker" className="speaker-img speaker-left" />
        <img src={speakerImg} alt="speaker" className="speaker-img speaker-right" />
      </div>

      <div className="landing-center">
        <h1 className="logo-text amplify-logo">Amplify</h1>
        <p className="slogan">Amplifique suas conexões.<br />Viva a música ao vivo.</p>
        <button className="btn-entrar" onClick={() => navigate('/login')}>
          Entrar
        </button>
      </div>
    </div>
  )
}

export default Landing