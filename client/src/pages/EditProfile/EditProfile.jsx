import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Certifique-se de ter o axios instalado: npm install axios
import './EditProfile.css';
import HomeIcon from '../../assets/home.png';
import UserPlaceholder = '../../assets/user.png';

function EditProfile() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // Estado para guardar o arquivo binário real da foto para o upload
    const [selectedFile, setSelectedFile] = useState(null);
    const [profileImage, setProfileImage] = useState(UserPlaceholder);

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        cpf: '',
        location: '',
        bio: ''
    });

    const [tags, setTags] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [instruments, setInstruments] = useState([
        { id: 1, nome: '', nivel: 0 },
        { id: 2, nome: '', nivel: 0 },
        { id: 3, nome: '', nivel: 0 },
        { id: 4, nome: '', nivel: 0 },
        { id: 5, nome: '', nivel: 0 },
    ]);

    // 1. CONFERIR SE O TOKEN É VÁLIDO E CARREGAR DADOS DO PERFIL
    useEffect(() => {
        const token = localStorage.getItem('token'); // Altere para onde você guarda o JWT
        
        if (!token) {
            alert('Acesso negado. Por favor, faça login novamente.');
            navigate('/login');
            return;
        }

        // Busca os dados atuais do usuário logado no back-end para preencher os campos
        axios.get('http://localhost:5000/api/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => {
            const user = res.data;
            setFormData({
                name: user.name || '',
                username: user.username || '',
                cpf: user.cpf || '',
                location: user.location || '',
                bio: user.bio || ''
            });
            if (user.tags) setTags(user.tags);
            if (user.instruments) setInstruments(user.instruments);
            if (user.profileImageUrl) setProfileImage(user.profileImageUrl); // Link vindo do drive
        })
        .catch(err => {
            console.error(err);
            alert('Sessão expirada ou inválida.');
            navigate('/login');
        });
    }, [navigate]);

    const hasUploadedPhoto = profileImage !== UserPlaceholder;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file); // Guarda o arquivo bruto para mandar pro Back-end
            setProfileImage(URL.createObjectURL(file)); // Altera o preview visual do gato
        }
    };

    // Lógica das tags
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

    // 2. CONFERIR SE OS CAMPOS SÃO VÁLIDOS E ENVIAR ATUALIZAÇÃO
    const handleSaveProfile = async (e) => {
        e.preventDefault();

        // Validações básicas no front-end antes do envio
        if (!formData.name.trim() || !formData.username.trim()) {
            alert('Os campos Nome e Username são obrigatórios.');
            return;
        }

        const token = localStorage.getItem('token');
        
        // CONSTRUÇÃO DO PAYLOAD CORRETO (FormData)
        const payload = new FormData();
        
        // Injeta os dados textuais do formulário
        payload.append('name', formData.name);
        payload.append('username', formData.username);
        payload.append('cpf', formData.cpf);
        payload.append('location', formData.location);
        payload.append('bio', formData.bio);
        
        // Arrays precisam ser stringificados como JSON para passar no FormData de forma limpa
        payload.append('tags', JSON.stringify(tags));
        payload.append('instruments', JSON.stringify(instruments.filter(i => i.nome.trim() !== '')));

        // Se houver uma nova foto selecionada, anexa o binário no campo 'image'
        if (selectedFile) {
            payload.append('image', selectedFile);
        }

        try {
            // Envia o update pro back-end
            const response = await axios.put('http://localhost:5000/api/profile/update', payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data' // Avisa o axios que vai um arquivo binário junto
                }
            });

            alert('Alterações salvas com sucesso!');
            // Se o back-end retornar o link final que ele salvou do Drive, atualiza a tela
            if (response.data.profileImageUrl) {
                setProfileImage(response.data.profileImageUrl);
            }
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Erro ao salvar as alterações do perfil.');
        }
    };

    return (
        <div className="edit-profile-page">
            <header className="edit-header">
                <div className="back-nav">
                    <span className="back-arrow" onClick={() => navigate(-1)}>&lt;</span>
                    <img src={HomeIcon} alt="Home" className="home-icon" onClick={() => navigate('/feed')} />
                </div>
            </header>

            <main className="edit-container">
                <section className="edit-left-column">
                    <div className="profile-pic-container" onClick={handleAvatarClick}>
                        <img src={profileImage} alt="Profile" className={hasUploadedPhoto ? "user-photo" : "large-avatar"} />
                        <div className="avatar-overlay"><span>Alterar Foto</span></div>
                    </div>
                    
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/png, image/jpeg" 
                        style={{ display: 'none' }} 
                    />

                    <div className="input-stack">
                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nome" />
                        <div className="username-input-wrapper">
                            <span className="at-symbol">@</span>
                            <input type="text" name="username" value={formData.username} onChange={handleChange} />
                        </div>
                        <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} placeholder="CPF" />
                        <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Cidade, Estado, País" />
                    </div>
                </section>

                <section className="edit-right-column">
                    <div className="top-boxes">
                        <div className="bio-box">
                            <textarea name="bio" placeholder="Biografia do usuário" value={formData.bio} onChange={handleChange} />
                        </div>
                        <div className="tags-box">
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
                                    <span key={tag} className="tag-item" onClick={() => removeTag(tag)}>#{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="instruments-full-box">
                        {instruments.map(inst => {
                            const isBlocked = inst.nome.trim() === '';
                            return (
                                <div key={inst.id} className="instrument-edit-row">
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
                                                    style={{ '--bar-color': colors[bar - 1], height: `${20 + (bar * 15)}%` }}
                                                    onClick={() => handleLevelClick(inst.id, bar)}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </main>

            <footer className="footer-actions-row">
                <button className="btn-secondary" onClick={() => navigate('/change-password')}>Alterar senha</button>
                <button className="btn-primary" onClick={handleSaveProfile}>Salvar alterações</button>
            </footer>
        </div>
    );
}

export default EditProfile;