import { useNavigate } from 'react-router-dom'
import speakerLeftImg from '../../assets/speaker-left.png'
import speakerRightImg from '../../assets/speaker-right.png'
import './Login.css'

function Login() {
  const navigate = useNavigate()

  return (
    <div className="login-container">
      <img src={speakerLeftImg} alt="speaker" className="login-speaker login-speaker-left" />

      <div className="login-center">
        <h1 className="logo-text amplify-logo login-logo">Amplify</h1>
        <div className="login-card">
          <h2>Bem-vindo!</h2>
          <input type="text" placeholder="Usuário ou e-mail" />
          <div className="input-with-link">
            <input type="password" placeholder="Senha" />
            <a href="#" className="forgot-link">Esqueceu a Senha?</a>
          </div>
          <button className="btn-entrar">Entrar</button>
          <p className="register-text">
            Se ainda não possuir uma conta,{' '}
            <a href="#" onClick={() => navigate('/cadastro')}>clique aqui para se registrar</a>
          </p>
        </div>
      </div>

      <img src={speakerRightImg} alt="speaker" className="login-speaker login-speaker-right" />
    </div>
  )
}

export default Login