import { useNavigate } from 'react-router-dom'
import './Landing.css'

function Landing() {
  const navigate = useNavigate()

  return (
    <div className="landing-container">
      <div className="landing-speakers left-speakers">
        <div className="speaker"></div>
        <div className="speaker"></div>
      </div>

      <div className="landing-center">
        <h1 className="logo-text">Amplify</h1>
        <p className="slogan">Amplifique suas conexões.<br />Viva a música ao vivo.</p>
        <button className="btn-entrar" onClick={() => navigate('/login')}>
          Entrar
        </button>
      </div>

      <div className="landing-speakers right-speakers">
        <div className="speaker"></div>
        <div className="speaker"></div>
      </div>
    </div>
  )
}

export default Landing