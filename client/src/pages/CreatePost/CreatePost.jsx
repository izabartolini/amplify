import {
    ActionIcon,
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    Container,
    Flex,
    Group,
    Image,
    Paper,
    Stack,
    Text,
    TextInput,
    Title,
} from "@mantine/core";

import { Dropzone } from "@mantine/dropzone";
import Navbar from "../../components/Navbar/Navbar";
import ProfileSidebar from "../../components/ProfileSidebar/ProfileSidebar";
import fotoPerfil from '../../assets/foto-perfil.jpeg';
import './CreatePost.css'

import {
    IconBell,
    IconChevronLeft,
    IconMail,
    IconPhoto,
    IconPlayerPlay,
    IconSearch,
    IconUpload,
    IconUser,
    IconX,
} from "@tabler/icons-react";

import { useState, useEffect } from "react";
import { Navigate, useNavigate, useParams } from 'react-router-dom'

export default function CreatePost() {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const isSingle = previews.length === 1;

    const [user, setUser] = useState(null)
    const { id } = useParams()
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);

    const token = localStorage.getItem('token')
    const loggedUserID = localStorage.getItem('userID')
    const isOwnProfile = String(loggedUserID) === String(id)

    const [subtitle, setSubtitle] = useState("");
    const [publishing, setPublishing] = useState(false);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const headers = { 'Authorization': `Bearer ${token}` }

                const userRes = await fetch(
                    `http://localhost:8080/api/users/${id}`,
                    { headers }
                );

                const userData = await userRes.json()

                setUser({
                    name: userData.name,
                    username: userData.username,
                    profilePicture: userData.profile_picture,
                    bio: userData.bio,
                    city: userData.city,
                    state: userData.state,
                    country: userData.country,
                    followers: userData.followers_count,
                    following: userData.following_count,
                    tags: [],
                })
                if (!isOwnProfile) {
                    const followRes = await fetch(`http://localhost:8080/api/users/${id}/follow`, { headers })
                    const followData = await followRes.json()
                    setIsFollowing(followData.is_following)
                }
            } catch (err) {
                console.error('Erro ao carregar perfil:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [id])

    function handleFiles(newFiles) {
        if (files.length + newFiles.length > 5) {
            alert("Você pode enviar no máximo 5 arquivos.");
            return;
        }
        const newPreviews = newFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        setFiles(prev => [...prev, ...newFiles]);
        setPreviews(prev => [...prev, ...newPreviews]);
    }


    function removeFile(index) {
        URL.revokeObjectURL(previews[index].preview);

        setFiles(files.filter((_, i) => i !== index));
        setPreviews(previews.filter((_, i) => i !== index));
    }

    function getGridColumns(count) {
        switch (count) {
            case 1:
                return "1fr";
            case 2:
                return "1fr 1fr";
            case 3:
                return "repeat(3, 1fr)";
            case 4:
                return "repeat(2, 1fr)";
            case 5:
                return "repeat(3, 1fr)";
            default:
                return "repeat(3, 1fr)";
        }
    }

    async function handlePublish() {
        if (files.length === 0) {
            alert("Selecione pelo menos uma mídia.");
            return;
        }

        try {
            setPublishing(true);

            const formData = new FormData();

            formData.append("subtitle", subtitle);

            files.forEach((file) => {
                formData.append("medias", file);
            });

            const response = await fetch(
                "http://localhost:8080/api/posts",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Erro ao publicar.");
            }

            alert("Post publicado com sucesso!");

            navigate(`/profile/${id}`);

        } catch (err) {
            console.error(err);
            alert(err.message);
        } finally {
            setPublishing(false);
        }
    }

    return (
        <Box>
            <Navbar />

            <Flex gap={40} mr={40}>

                <ProfileSidebar user={user} isOwnProfile={true} />

                <Box flex={1}>
                    <Group mb={5} mt={10} gap={4}>
                        <ActionIcon variant="transparent" size="xl" onClick={() => navigate(`/profile/${id}`)}>
                            <IconChevronLeft size={40} stroke={2.2} />
                            <IconUser size={40} stroke={2.2} />
                        </ActionIcon>
                    </Group>

                    <Paper
                        p={20}
                        radius="lg"
                        bg="#9f0f0f"
                    >
                        <Box pos="relative">
                            <Dropzone
                                onDrop={handleFiles}
                                multiple={true}
                                activateOnClick={false}
                                radius="lg"
                                className="dropzone"
                            >
                                {previews.length > 0 ? (
                                    <Box
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: getGridColumns(previews.length),
                                            gap: 12,
                                        }}
                                    >
                                        {previews.map((item, index) => (
                                            <Box key={index} pos="relative">
                                                {item.file.type.startsWith("video") ? (
                                                    <video
                                                        controls
                                                        src={item.preview}
                                                        style={{
                                                            width: "100%",
                                                            height: previews.length === 1 ? 430 : 220,
                                                            objectFit: "cover",
                                                            borderRadius: 8,
                                                        }}
                                                    />
                                                ) : (
                                                    <Box key={index} pos="relative">
                                                        <Image
                                                            src={item.preview}
                                                            h={previews.length === 1 ? 430 : 220}
                                                            fit="cover"
                                                            radius="md"
                                                        />
                                                    </Box>
                                                )}

                                                <ActionIcon
                                                    color="#9f0f0f"
                                                    radius="xl"
                                                    pos="absolute"
                                                    top={8}
                                                    right={8}
                                                    onClick={() => removeFile(index)}
                                                >
                                                    <IconX size={16} />
                                                </ActionIcon>
                                            </Box>
                                        ))}
                                    </Box>
                                ) : (
                                    <Flex
                                        justify="center"
                                        align="center"
                                        direction="column"
                                        h={430}
                                        gap={20}
                                    >
                                        <Group gap={5}>
                                            <IconPhoto
                                                size={70}
                                                color="#c98f5d"
                                            />

                                            <IconPlayerPlay
                                                size={70}
                                                color="#c98f5d"
                                            />
                                        </Group>

                                        <Text
                                            fw={600}
                                            size="xl"
                                        >
                                            Drag and drop an image or video here
                                        </Text>

                                        <Text c="dimmed">or</Text>

                                        <Button
                                            radius="xl"
                                            leftSection={<IconUpload size={18} />}
                                            component="label"
                                            color="red"
                                        >
                                            Upload from device

                                            <input
                                                hidden
                                                multiple
                                                type="file"
                                                accept="image/*,video/*"
                                                onChange={(e) => handleFiles(Array.from(e.target.files).slice(0, 5))}
                                            />
                                        </Button>
                                    </Flex>
                                )}
                            </Dropzone>
                        </Box>

                        <Flex
                            mt={20}
                            justify="space-between"
                            gap={20}
                        >
                            <TextInput
                                placeholder="Write a caption..."
                                radius="md"
                                flex={1}
                                value={subtitle}
                                onChange={(e) => setSubtitle(e.currentTarget.value)}
                            />

                            <Button
                                radius="xl"
                                color="gray"
                                variant="filled"
                                onClick={() => navigate(`/profile/${id}`)}
                            >
                                Cancel
                            </Button>

                            <Button
                                radius="xl"
                                color="red"
                                onClick={handlePublish}
                                loading={publishing}
                            >
                                Publish
                            </Button>
                        </Flex>
                    </Paper>
                </Box>
            </Flex>
        </Box>
    );
}