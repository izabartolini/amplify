import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PasswordInput } from '@mantine/core';
import { Input } from '@mantine/core';
import speakerLeftImg from '../../assets/speaker-left.png'
import speakerRightImg from '../../assets/speaker-right.png'
import './Login.css'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {

    setPasswordError('')
    setEmailError('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {

        setEmailError('')
        setPasswordError('')

        if (data.field === 'email') {
          setEmailError(data.message)
        }

        if (data.field === 'password') {
          setPasswordError(data.message)
        }

        return
      }
      localStorage.setItem('token', data.token)

      navigate('/profile/1')
    } catch (error) {
      setError('Não foi possivel conectar ao servidor.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <img src={speakerLeftImg} alt="speaker" className="login-speaker login-speaker-left" />

      <div className="login-center">
        <h1 className="logo-text amplify-logo login-logo">Amplify</h1>
        <div className="login-card">
          <h2>Bem-vindo!</h2>
          <Input.Wrapper label="E-mail" error={emailError} style={{ width: '100%' }} >
            <Input placeholder="exemplo@gmail.com" value={email} onChange={(event) => setEmail(event.currentTarget.value)} />
          </Input.Wrapper>
          <PasswordInput label="Senha" placeholder="Senha" error={passwordError} value={password} onChange={(event) => setPassword(event.currentTarget.value)} style={{ width: '100%' }} />

          <button className="btn-entrar" onClick={handleLogin}>Entrar</button>
          <div className="login-links">
            <a href="#" onClick={() => navigate('/forgot-password')}>Esqueci minha senha</a>
          </div>
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