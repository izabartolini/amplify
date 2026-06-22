import './Register.css'
import Guitar from '/guitar.png'

function Register() {
    return (
        <div className='main-container'>
            <div className='img-container'>
                <img src={Guitar} alt="big guitar fading" />
            </div>
            <div className='form-container'>
                <header>
                    <h1 data-text="Amplify">Amplify</h1>
                    <h3>Cadastro</h3>
                </header>
                <div className='form-tabs'>
                    <div className='div-open'>
                        <h2>Sua Conta</h2>
                        <div className='form'>
                            <form className='main-form'>
                                <div className='form-row'>
                                    <div className='input-group'>
                                        <label htmlFor="nome">nome</label>
                                        <input type="text" id="nome" placeholder="nome..." />
                                    </div>
                                    <div className='input-group'>
                                        <label htmlFor="username">usuário</label>
                                        <input type="text" id="username" placeholder="usuário..." />
                                    </div>
                                </div>
                                <div className='form-row'>
                                    <div className='input-group'>
                                        <label htmlFor="email">e-mail</label>
                                        <input type="email" id="email" placeholder="user@email.com..." />
                                    </div>
                                    <div className='input-group empty'></div>
                                </div>
                                <div className='form-row'>
                                    <div className='input-group'>
                                        <label htmlFor="password">password</label>
                                        <input type="password" id="password" placeholder="password..." />
                                    </div>
                                    <div className='input-group'>
                                        <label htmlFor="confirmPassword">confirm password</label>
                                        <input type="password" id="confirmPassword" placeholder="confirm password..." />
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="btn-container">
                            <div className="interactive-nav">
                                <button type="submit" className="btn-advance">Avançar</button>
                                <div className="arrow-ball">→</div>
                            </div>
                        </div>
                    </div>
                    <div className='div-closed'>Seus Dados</div>
                    <div className='div-closed'>Seus Interesses</div>
                </div>
            </div>
        </div>
    )
}

export default Register