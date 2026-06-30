import { useState } from 'react'
import './Register.css'
import Guitar from '../../assets/guitar.png'

function Register() {
    const [step, setStep] = useState(1)

    const [instrumentos, setInstrumentos] = useState([
        { id: 1, nome: '', nivel: 0 },
        { id: 2, nome: '', nivel: 0 },
        { id: 3, nome: '', nivel: 0 },
        { id: 4, nome: '', nivel: 0 },
    ])
    const [tags, setTags] = useState(['Rock', 'Metal', 'Blues'])
    const [inputValue, setInputValue] = useState('')

    const handleNextStep = async (event) => {
        if (event) event.preventDefault()

        const formElement = document.querySelector('.main-form')
        if (!formElement) return

        const formData = new FormData(formElement)
        const data = Object.fromEntries(formData.entries())

        try {
            await fetch('https://sua-api.com/api/register-partial', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentStep: step,
                    ...data,
                    instrumentos: instrumentos.filter(i => i.nome.trim() !== ''),
                    tags
                }),
            })
        } catch (error) {
            console.error('Erro ao salvar dados parciais:', error)
        }

        if (step < 3) {
            setStep(step + 1)
        }
    }

    const handleInstrumentNameChange = (id, value) => {
        setInstrumentos(prev => prev.map(inst =>
            inst.id === id ? { ...inst, nome: value, nivel: value.trim() === '' ? 0 : inst.nivel } : inst
        ))
    }

    const handleLevelClick = (id, clickedLevel) => {
        setInstrumentos(prev => prev.map(inst => {
            if (inst.id === id && inst.nome.trim() !== '') {
                return { ...inst, nivel: inst.nivel === clickedLevel ? 0 : clickedLevel }
            }
            return inst
        }))
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            const trimmed = inputValue.trim()
            if (trimmed && !tags.includes(trimmed)) {
                setTags([...tags, trimmed])
                setInputValue('')
            }
        }
    }

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove))
    }

    return (
        <div className='main-container'>
            <div className='img-container'>
                <div className="stepper-sidebar">
                    <div className="stepper-line"></div>
                    {[
                        { id: 1, label: 'Seu perfil' },
                        { id: 2, label: 'Seus dados' },
                        { id: 3, label: 'Seus interesses' }
                    ].map((s) => {
                        const isActive = step === s.id;
                        return (
                            <div key={s.id} className={`stepper-item ${isActive ? 'active' : ''}`} onClick={() => setStep(s.id)}>
                                <div className="stepper-node-wrapper">
                                    {isActive && <div className="stepper-ring"></div>}
                                    <div className="stepper-dot"></div>
                                </div>
                                <span className="stepper-label">{s.label}</span>
                            </div>
                        );
                    })}
                </div>

            </div>
            <div className='form-container'>
                <header>
                    <h1 data-text="Amplify">Amplify</h1>
                    <h3>Cadastro</h3>
                </header>

                <div className='form-tabs'>
                    <div className={step === 1 ? 'div-open' : 'div-closed'} onClick={() => step !== 1 && setStep(1)}>
                        {step === 1 ? (
                            <>
                                <h2>Seu perfil</h2>
                                <div className='form'>
                                    <form className='main-form' onSubmit={handleNextStep}>
                                        <div className='form-row'>
                                            <div className='input-group'>
                                                <label htmlFor="nome">nome</label>
                                                <input type="text" id="nome" name="nome" placeholder="nome..." required />
                                            </div>
                                            <div className='input-group'>
                                                <label htmlFor="username">usuário</label>
                                                <input type="text" id="username" name="username" placeholder="usuário..." required />
                                            </div>
                                        </div>
                                        <div className='form-row'>
                                            <div className='input-group'>
                                                <label htmlFor="email">e-mail</label>
                                                <input type="email" id="email" name="email" placeholder="user@email.com..." required />
                                            </div>
                                            <div className='input-group empty'></div>
                                        </div>
                                        <div className='form-row'>
                                            <div className='input-group'>
                                                <label htmlFor="password">password</label>
                                                <input type="password" id="password" name="password" placeholder="password..." required />
                                            </div>
                                            <div className='input-group'>
                                                <label htmlFor="confirmPassword">confirm password</label>
                                                <input type="password" id="confirmPassword" name="confirmPassword" placeholder="confirm password..." required />
                                            </div>
                                        </div>
                                        <div className="btn-container">
                                            <div className="interactive-nav">
                                                <button type="submit" className="btn-advance">Avançar</button>
                                                <div className="arrow-ball" onClick={handleNextStep}>→</div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <span className="vertical-title">Seu perfil</span>
                        )}
                    </div>

                    <div className={step === 2 ? 'div-open' : 'div-closed'} onClick={() => step !== 2 && setStep(2)}>
                        {step === 2 ? (
                            <>
                                <h2>Seus dados</h2>
                                <div className='form'>
                                    <form className='main-form' onSubmit={handleNextStep}>
                                        <div className='form-row'>
                                            <div className='input-group'>
                                                <label htmlFor="cidade">cidade</label>
                                                <input type="text" id="cidade" name="cidade" placeholder="cidade..." required />
                                            </div>
                                            <div className='input-group'>
                                                <label htmlFor="estado">estado</label>
                                                <input type="text" id="estado" name="estado" placeholder="estado..." required />
                                            </div>
                                        </div>
                                        <div className='form-row'>
                                            <div className='input-group'>
                                                <label htmlFor="pais">país</label>
                                                <input type="text" id="pais" name="pais" placeholder="país..." required />
                                            </div>
                                            <div className='input-group empty'></div>
                                        </div>
                                        <div className='form-row'>
                                            <div className='input-group'>
                                                <label htmlFor="cpf">CPF</label>
                                                <input type="text" id="cpf" name="cpf" placeholder="CPF..." required />
                                            </div>
                                            <div className='input-group empty'></div>
                                        </div>
                                        <div className="btn-container">
                                            <div className="interactive-nav">
                                                <button type="submit" className="btn-advance">Avançar</button>
                                                <div className="arrow-ball" onClick={handleNextStep}>→</div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <span className="vertical-title">Seus dados</span>
                        )}
                    </div>

                    <div className={step === 3 ? 'div-open' : 'div-closed'} onClick={() => step !== 3 && setStep(3)}>
                        {step === 3 ? (
                            <>
                                <h2>Seus interesses</h2>
                                <div className='form interests-step'>
                                    <form className='main-form' onSubmit={(e) => { e.preventDefault(); alert('Cadastro Finalizado!'); }}>
                                        <div className="interests-columns">

                                            <div className="fieldset-container">
                                                <span className="fieldset-label">instrumentos</span>
                                                <div className="fieldset-content list-rows">
                                                    {instrumentos.map(inst => {
                                                        const isBlocked = inst.nome.trim() === '';
                                                        return (
                                                            <div key={inst.id} className="instrument-row">
                                                                <input
                                                                    type="text"
                                                                    className="instrument-input-field"
                                                                    placeholder="Instrumento..."
                                                                    value={inst.nome}
                                                                    onChange={(e) => handleInstrumentNameChange(inst.id, e.target.value)}
                                                                />
                                                                <div className={`skill-bars ${isBlocked ? 'blocked' : ''}`}>
                                                                    {[1, 2, 3, 4, 5].map(bar => {
                                                                        const colors = ['#FFE600', '#FFA800', '#FF7A00', '#FF3D00', '#FF0000']
                                                                        const isActive = inst.nivel >= bar
                                                                        return (
                                                                            <div
                                                                                key={bar}
                                                                                className={`bar ${isActive ? 'active' : ''}`}
                                                                                style={{
                                                                                    '--bar-color': colors[bar - 1],
                                                                                    height: `${20 + (bar * 15)}%`
                                                                                }}
                                                                                onClick={() => handleLevelClick(inst.id, bar)}
                                                                            />
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>

                                            <div className="fieldset-container">
                                                <span className="fieldset-label">interesses</span>
                                                <div className="fieldset-content tags-wrapper">
                                                    <input
                                                        type="text"
                                                        className="tag-input"
                                                        placeholder="Digite algo e aperte Enter..."
                                                        value={inputValue}
                                                        onChange={(e) => setInputValue(e.target.value)}
                                                        onKeyDown={handleKeyDown}
                                                    />
                                                    <div className="tags-container">
                                                        {tags.map(tag => (
                                                            <span key={tag} className="tag-item" onClick={() => removeTag(tag)}>
                                                                #{tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="btn-container">
                                            <button type="submit" className="btn-advance" style={{ width: '100%', background: 'linear-gradient(to right, #452D20, #6B3A2A)', color: '#ECE3CF' }}>Concluir</button>
                                        </div>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <span className="vertical-title">Seus interesses</span>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Register