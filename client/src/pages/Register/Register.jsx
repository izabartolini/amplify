import { useState } from 'react'
import './Register.css'
import Guitar from '../../assets/guitar.png'
import { useNavigate } from 'react-router-dom';
import { XIcon, CheckIcon } from '@phosphor-icons/react';
import { PasswordInput, Progress, Text, Popover, Box } from '@mantine/core';
import { notifications } from '@mantine/notifications'
import { IconX, IconCheck } from '@tabler/icons-react'

function Register() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        city: '',
        state: '',
        country: '',
        cpf: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [instruments, setInstruments] = useState([
        { id: 1, nome: '', nivel: 0 },
        { id: 2, nome: '', nivel: 0 },
        { id: 3, nome: '', nivel: 0 },
        { id: 4, nome: '', nivel: 0 },
    ]);
    const [tags, setTags] = useState(['Rock', 'Metal', 'Blues']);
    const [inputValue, setInputValue] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;

        let newValue = value;

        if (name === "cpf") {
            newValue = value.replace(/\D/g, "").slice(0, 11);
        }

        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };
    const handleInvalid = (e) => {
        e.target.setCustomValidity('Por favor, preencha este campo.');
    };

    const handleInput = (e) => {
        e.target.setCustomValidity('');
    };
    const handleNextStep = (event) => {
        if (event) event.preventDefault();

        if (step === 1) {
            const senha = formData.password ? formData.password.trim() : '';
            const confirmacao = formData.confirmPassword ? formData.confirmPassword.trim() : '';

            if (senha !== confirmacao) {
                setError('As senhas não coincidem!');
                return;
            }
            setError('');
        }

        if (step < 3) {
            setStep(step + 1);
        }
    };

    const handleFinalSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const instrumentsFiltrados = instruments
            .filter(inst => inst.nome.trim() !== '')
            .map(inst => ({ instrument_name: inst.nome, instrument_level: inst.nivel }));

        const { confirmPassword, ...dadosEnvio } = formData;

        const payloadCompleto = {
            ...dadosEnvio,
            instruments: instrumentsFiltrados,
            tags: tags
        };

        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payloadCompleto),
            });

            if (response.ok) {
                const data = await response.json()
                if (data.token) {
                    localStorage.setItem('token', data.token)
                    const payload = JSON.parse(atob(data.token.split('.')[1]))
                    localStorage.setItem('userID', payload.sub)
                    navigate('/feed')
                } else {
                    navigate('/login')
                }
            } else {
                const errorData = await response.json();

                switch (errorData.field) {
                    case "cpf":
                        setError(errorData.message);
                        notifications.show({
                            title: 'Falha!',
                            message: `Erro: ${errorData.message}`,
                            color: 'red',
                            icon: <IconX size={18} />,
                            autoClose: 3000,
                        })
                        break;

                    case "email":
                        setError(errorData.message);
                        notifications.show({
                            title: 'Falha!',
                            message: `Erro: ${errorData.message}`,
                            color: 'red',
                            icon: <IconX size={18} />,
                            autoClose: 3000,
                        })
                        break;

                    case "username":
                        setError(errorData.message);
                        notifications.show({
                            title: 'Falha!',
                            message: `Erro: ${errorData.message}`,
                            color: 'red',
                            icon: <IconX size={18} />,
                            autoClose: 3000,
                        })
                        break;

                    case "password":
                        setError(errorData.message);
                        notifications.show({
                            title: 'Falha!',
                            message: `Erro: ${errorData.message}`,
                            color: 'red',
                            icon: <IconX size={18} />,
                            autoClose: 3000,
                        })
                        break;

                    case "instruments":
                        setError(errorData.message);
                        notifications.show({
                            title: 'Falha!',
                            message: `Erro: ${errorData.message}`,
                            color: 'red',
                            icon: <IconX size={18} />,
                            autoClose: 3000,
                        })
                        break;

                    default:
                        notifications.show({
                            title: 'Falha!',
                            message: `Erro: ${errorData.message}`,
                            color: 'red',
                            icon: <IconX size={18} />,
                            autoClose: 3000,
                        })
                        setError(errorData.message || "Erro ao cadastrar usuário.");
                }
            }
        } catch (error) {
            console.error('Erro ao conectar com o servidor:', error);
            setError('Erro ao conectar com o servidor. Verifique se o backend está rodando.');
        }
    };

    const handleInstrumentNameChange = (id, value) => {
        setInstruments(prev => prev.map(inst =>
            inst.id === id ? { ...inst, nome: value, nivel: value.trim() === '' ? 0 : inst.nivel } : inst
        ));
    };
    const handleLevelClick = (id, clickedLevel) => {
        setInstruments(prev => prev.map(inst => {
            if (inst.id === id && inst.nome.trim() !== '') {
                return { ...inst, nivel: inst.nivel === clickedLevel ? 0 : clickedLevel };
            }
            return inst;
        }));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const trimmed = inputValue.trim();
            if (trimmed && !tags.includes(trimmed)) {
                setTags([...tags, trimmed]);
                setInputValue('');
            }
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    function PasswordRequirement({ meets, label }) {
        return (
            <Text
                c={meets ? 'teal' : 'red'}
                style={{ display: 'flex', alignItems: 'center' }}
                mt={7}
                size="sm"
            >
                {meets ? <CheckIcon size={14} /> : <XIcon size={14} />}
                <Box ml={10}>{label}</Box>
            </Text>
        );
    }

    const requirements = [
        { re: /[0-9]/, label: 'Contém um número' },
        { re: /[a-z]/, label: 'Contém uma letra minúscula' },
        { re: /[A-Z]/, label: 'Contém uma letra maiúscula' },
        { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Contém um caractere especial' },
    ];

    function getStrength(password) {
        let multiplier = password.length > 5 ? 0 : 1;

        requirements.forEach((requirement) => {
            if (!requirement.re.test(password)) {
                multiplier += 1;
            }
        });

        return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
    }

    const [popoverOpened, setPopoverOpened] = useState(false);
    const checks = requirements.map((requirement, index) => (
        <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(formData.password)} />
    ));

    const strength = getStrength(formData.password);
    const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';


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
                                        {error && <p className="error-message" style={{ color: '#FF3D00', fontWeight: 'bold', marginBottom: '15px', textAlign: 'center' }}>{error}</p>}

                                        <div className='form-row'>
                                            <div className='input-group'>
                                                <label htmlFor="name">nome</label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    placeholder="nome..."
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    onInvalid={handleInvalid}
                                                    onInput={handleInput}
                                                    required
                                                />
                                            </div>
                                            <div className='input-group'>
                                                <label htmlFor="username">usuário</label>
                                                <input
                                                    type="text"
                                                    id="username"
                                                    name="username"
                                                    placeholder="usuário..."
                                                    value={formData.username}
                                                    onChange={handleChange}
                                                    onInvalid={handleInvalid}
                                                    onInput={handleInput}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className='form-row'>
                                            <div className='input-group'>
                                                <label htmlFor="email">e-mail</label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    placeholder="user@email.com..."
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    onInvalid={handleInvalid}
                                                    onInput={handleInput}
                                                    required
                                                />
                                            </div>
                                            <div className='input-group empty'></div>
                                        </div>

                                        <div className='form-row'>
                                            <div className='input-group'>
                                                <label htmlFor="password">Senha</label>
                                                <Popover opened={popoverOpened} position="bottom" width="target" transitionProps={{ transition: 'pop' }}>
                                                    <Popover.Target>
                                                        <div
                                                            className="password-wrapper"
                                                            onFocusCapture={() => setPopoverOpened(true)}
                                                            onBlurCapture={() => setPopoverOpened(false)}
                                                        >
                                                            <input
                                                                type={showPassword ? "text" : "password"}
                                                                id="password"
                                                                name="password"
                                                                placeholder="senha..."
                                                                value={formData.password}
                                                                onChange={handleChange}
                                                                onInvalid={handleInvalid}
                                                                onInput={handleInput}
                                                                required
                                                            />

                                                            <button
                                                                type="button"
                                                                className="toggle-password"
                                                                onClick={() => setShowPassword(!showPassword)}
                                                            >
                                                                {showPassword ? "👁️" : "🙈"}
                                                            </button>
                                                        </div>
                                                    </Popover.Target>
                                                    <Popover.Dropdown>
                                                        <Progress color={color} value={strength} size={5} mb="xs" />
                                                        <PasswordRequirement
                                                            label="Deve conter pelo menos 8 caracteres"
                                                            meets={formData.password.length > 7}
                                                        />
                                                        {checks}
                                                    </Popover.Dropdown>
                                                </Popover>
                                            </div>
                                            <div className='input-group'>
                                                <label htmlFor="confirmPassword">Confirme sua senha</label>
                                                <div className="password-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                                    <input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        id="confirmPassword"
                                                        name="confirmPassword"
                                                        placeholder="confirme sua senha..."
                                                        value={formData.confirmPassword}
                                                        onChange={handleChange}
                                                        onInvalid={handleInvalid}
                                                        onInput={handleInput}
                                                        style={{ width: '100%', paddingRight: '40px' }}
                                                        required
                                                    />
                                                    <button type="button" className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer' }}>
                                                        {showConfirmPassword ? "👁️" : "🙈"}
                                                    </button>
                                                </div>
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
                                                <label htmlFor="city">cidade</label>
                                                <input
                                                    type="text"
                                                    id="city"
                                                    name="city"
                                                    placeholder="cidade..."
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    required
                                                    onInvalid={handleInvalid}
                                                    onInput={handleInput}
                                                />
                                            </div>
                                            <div className='input-group'>
                                                <label htmlFor="state">estado</label>
                                                <input
                                                    type="text"
                                                    id="state"
                                                    name="state"
                                                    placeholder="estado..."
                                                    value={formData.state}
                                                    onChange={handleChange}
                                                    required
                                                    onInvalid={handleInvalid}
                                                    onInput={handleInput}
                                                />
                                            </div>
                                        </div>
                                        <div className='form-row'>
                                            <div className='input-group'>
                                                <label htmlFor="country">país</label>
                                                <input
                                                    type="text"
                                                    id="country"
                                                    name="country"
                                                    placeholder="país..."
                                                    value={formData.country}
                                                    onChange={handleChange}
                                                    required
                                                    onInvalid={handleInvalid}
                                                    onInput={handleInput}
                                                />
                                            </div>
                                            <div className='input-group empty'></div>
                                        </div>
                                        <div className='form-row'>
                                            <div className='input-group'>
                                                <label htmlFor="cpf">CPF</label>
                                                <input
                                                    type="text"
                                                    id="cpf"
                                                    name="cpf"
                                                    placeholder="CPF..."
                                                    value={formData.cpf}
                                                    onChange={handleChange}
                                                    required
                                                    onInvalid={handleInvalid}
                                                    onInput={handleInput}
                                                />
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
                                    <form className='main-form' onSubmit={handleFinalSubmit}>
                                        <div className="interests-columns">
                                            <div className="fieldset-container">
                                                <span className="fieldset-label">instrumentos</span>
                                                <div className="fieldset-content list-rows">
                                                    {instruments.map(inst => {
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
                                                                        const colors = ['#FFE600', '#FFA800', '#FF7A00', '#FF3D00', '#FF0000'];
                                                                        const isActive = inst.nivel >= bar;
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
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        );
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
    );
}

export default Register;