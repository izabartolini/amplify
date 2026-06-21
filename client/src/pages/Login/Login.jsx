import { useNavigate } from 'react-router-dom'
import './Login.css'

function Login() {
  const navigate = useNavigate()

  return (
    <div className="login-container">
      <div className="login-speakers left-speakers">
        <div className="speaker"></div>
        <div className="speaker"></div>
      </div>

      <div className="login-center">
        <h1 className="logo-text amplify-logo">Amplify</h1>
        <div className="login-card">
          <h2>Bem-vindo!</h2>
          <input type="text" placeholder="Usuário ou e-mail" />
          <input type="password" placeholder="Senha" />
          <button className="btn-entrar">Entrar</button>
          <div className="login-links">
            <a href="#">Esqueci a senha</a>
            <a href="#" onClick={() => navigate('/cadastro')}>Criar conta</a>
          </div>
        </div>
      </div>

      <div className="login-speakers right-speakers">
        <div className="speaker"></div>
        <div className="speaker"></div>
      </div>
    </div>
  )
}

export default Login