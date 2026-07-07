import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditProfile.css';
import HomeIcon from '../../assets/home.png';
import UserPlaceholder from '../../assets/user.png';

function EditProfile() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

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

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userID = localStorage.getItem('userID');

        if (!token || !userID) {
            alert('Acesso negado. Por favor, faça login novamente.');
            navigate('/login');
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/users/${userID}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const user = response.data;

                setFormData({
                    name: user.name || '',
                    username: user.username || '',
                    cpf: user.cpf || '',
                    location: user.city || '',
                    bio: user.bio || ''
                });

                if (user.profile_picture) {
                    setProfileImage(user.profile_picture);
                }

                if (user.Tag && Array.isArray(user.Tag)) {
                    const loadedTags = user.Tag.map(t => t.name);
                    setTags(loadedTags);
                } else if (user.tags && Array.isArray(user.tags)) {
                    setTags(user.tags);
                }

                if (user.instruments && Array.isArray(user.instruments)) {
                    const loadedInstruments = user.instruments.map((inst) => ({
                        id: inst.id,
                        nome: inst.nome || '',
                        nivel: inst.nivel || 0
                    }));

                    const completeInstruments = [...loadedInstruments];
                    while (completeInstruments.length < 5) {
                        completeInstruments.push({ id: completeInstruments.length + 1, nome: '', nivel: 0 });
                    }
                    setInstruments(completeInstruments);
                }

            } catch (error) {
                console.error("Erro ao buscar dados do usuário:", error);
            }
        };

        fetchUserData();
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
            setSelectedFile(file);
            setProfileImage(URL.createObjectURL(file));
        }
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

    const handleSaveProfile = async (e) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.username.trim()) {
            alert('Os campos Nome e Username são obrigatórios.');
            return;
        }

        const token = localStorage.getItem('token');

        if (!token) {
            alert('Sessão inválida ou expirada. Por favor, faça login novamente.');
            navigate('/login');
            return;
        }

        const payload = new FormData();
        payload.append('name', formData.name);
        payload.append('username', formData.username);
        payload.append('cpf', formData.cpf);
        payload.append('bio', formData.bio);
        payload.append('city', formData.location);

        payload.append('tags', JSON.stringify(tags));
        payload.append('instruments', JSON.stringify(instruments.filter(i => i.nome.trim() !== '')));

        if (selectedFile) {
            payload.append('image', selectedFile);
        }

        try {
            const response = await axios.put('http://localhost:8080/api/users/update', payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            alert('Alterações salvas com sucesso!');
            if (response.data.profileImageUrl) {
                setProfileImage(response.data.profileImageUrl);
                localStorage.setItem('profile_picture', response.data.profileImageUrl)
                window.location.reload();
            }
        } catch (error) {
            console.error("Erro detalhado retornado pelo Go no salvamento:", error);
            if (error.response && error.response.data && error.response.data.error) {
                alert(`Erro no servidor Go: ${error.response.data.error}`);
            } else {
                alert('Erro ao salvar as alterações do perfil.');
            }
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