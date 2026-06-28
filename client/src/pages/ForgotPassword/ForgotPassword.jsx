import {
    Paper,
    TextInput,
    Button,
    Title,
    Text,
    Stack,
    Anchor,
    PasswordInput,
    Group,
    Collapse,
    Box
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useState } from "react"
import { useDisclosure } from '@mantine/hooks';
import "./ForgotPassword.css";
import VerificationCode from '../../components/VerificationCode/VerificationCode.jsx';

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [expanded, { toggle }] = useDisclosure(false);
    const [codeSent, setCodeSent] = useState(false);
    const [codeConfirmed, setCodeConfirmed] = useState(false);
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const [emailError, setEmailError] = useState("");
    const [codeError, setCodeError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const handleSendCode = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:8080/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                }),
            });

            if (!response.ok) {
                throw new Error("Erro ao enviar código");
            }

            setCodeSent(true);
        } catch (err) {
            console.error(err);
        }
    };
    const handleConfirmCode = async () => {
        setEmailError("");
        setCodeError("");
        setPasswordError("");
        setConfirmPasswordError("");

        try {
            const response = await fetch("http://localhost:8080/forgot-password/new-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    code,
                    newPassword,
                    confirmPassword
                }),
            });

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
                
                if (data.field === 'confirmPassword') {
                    setConfirmPasswordError(data.message)
                }

                return
            }

        } catch (err) {
            console.error(err);
        }
    };


    return (

        <div className="forgot-container">

            <Paper shadow="xl" radius="md" p="xl" className="forgot-card">
                <Title order={1} className="logo-text amplify-logo">
                    Amplify
                </Title>

                <Title order={3} mt={15}>
                    Recuperar Senha
                </Title>

                <Text c="dimmed" mt={8} mb="lg">
                    Informe seu e-mail cadastrado para receber um código de recuperação.
                </Text>

                <Stack>
                    <TextInput
                        leftSection="📧"
                        placeholder="Digite seu e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={codeSent}
                        loading={loading}
                    />

                    <Box maw={400} mx="auto">
                        <Group justify="center" mb={5}>
                            <Button onClick={handleSendCode}>
                                {codeSent ? "Reenviar código" : "Enviar código"}
                            </Button>
                        </Group>

                        <Collapse expanded={codeSent} onTransitionEnd={() => setLoading(false)}>
                            <Text c="dimmed" mt={8} mb="lg">Coloque o código que chegou em seu E-mail.</Text>

                            <VerificationCode
                                onComplete={(code) => {
                                    setCode(code);
                                    console.log(code);
                                    setCodeConfirmed(true);
                                }}
                            />

                            <Collapse expanded={codeConfirmed}>
                                <Text c="dimmed" mt={8} mb="lg">Escolha sua nova Senha.</Text>
                                <PasswordInput label="Senha" placeholder="Senha" error={passwordError} value={newPassword} onChange={(event) => setPassword(event.currentTarget.value)} style={{ width: '100%' }} />
                                <PasswordInput label="Confirme sua senha" placeholder="Confirme sua senha" error={confirmPasswordError} value={confirmPassword} onChange={(event) => setConfirmPassword(event.currentTarget.value)} style={{ width: '100%' }} />
                                <Group justify="center" mb={5} mt={10}>
                                    <Button onClick={handleConfirmCode}>
                                        Confirmar
                                    </Button>
                                </Group>
                            </Collapse>
                        </Collapse>
                    </Box>
                    <Anchor
                        ta="center"
                        onClick={() => navigate("/login")}
                    >
                        Voltar para Login
                    </Anchor>
                </Stack>
            </Paper>
        </div>
    );
}