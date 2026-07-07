import {
  ActionIcon,
  Box,
  Button,
  Checkbox,
  Flex,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { IconChevronLeft, IconUser } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';

import Navbar from "../../components/Navbar/Navbar";
import ProfileSidebar from "../../components/ProfileSidebar/ProfileSidebar";

const loggedUser = {
  name: "Eduardo da Silva",
  username: "eduardosilva",
  profilePicture: null,
  followers: 123,
  following: 321,
  city: "Campo Mourão",
  state: "PR",
  bio: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  instrument: "Guitarra",
  level: "Intermediário",
  tags: ["instrumento", "nivel", "tag"]
};


export default function CreateEvent() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: null,
    place: "",
    city: "",
    state: "",
    country: "Brasil",
    is_private: false,
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.date || !formData.description) {
      setErrorMessage("Por favor, preencha o nome, a descrição e selecione uma data.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");
      const userID = localStorage.getItem("userID");

      const eventData = {
        ...formData,
        date: new Date(formData.date).toISOString(),
      };

      const response = await fetch("http://localhost:8080/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha ao criar o evento.");
      }
      notifications.show({
        title: 'Sucesso!',
        message: 'O evento foi criado e já está disponível.',
        color: 'green',
        icon: <IconCheck size={18} />,
        autoClose: 3000,
      });

      if (userID) {
        navigate(`/profile/${userID}`);
      } else {
        navigate("/feed");
      }

    } catch (error) {
      console.error("Erro na criação:", error);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Navbar />

      <Flex gap={65} mt={0} mr={65}>

        <ProfileSidebar user={loggedUser} isOwnProfile={true} />

        <Box flex={1}>
          <Group mb={15} mt={35}>
            <ActionIcon variant="transparent" onClick={() => navigate(-1)}>
              <IconChevronLeft />
            </ActionIcon>

            <ActionIcon variant="transparent">
              <IconUser />
            </ActionIcon>
          </Group>

          <Paper p={20} radius="lg" bg="#9f0f0f">
            <Paper
              radius="lg"
              p={30}
              style={{
                minHeight: 470,
                background: "white",
                border: "1px solid #ddd",
              }}
            >
              <Flex gap={40} direction={{ base: "column", md: "row" }} align="flex-start" justify="flex-start">

                {/* LADO ESQUERDO */}
                <Box style={{ width: 450 }}>
                  <Text fw={700} size="xl" mb={15} c="#5d2b16">
                    Data do Evento
                  </Text>
                  <DatePicker
                    value={formData.date}
                    onChange={(value) => handleChange("date", value)}
                    size="xl"
                    className="mantine-DatePicker-calendar"
                  />
                </Box>

                {/* LADO DIREITO */}
                <Stack flex={1} w="100%" gap={20}>
                  <TextInput
                    label="Nome do Evento"
                    size="lg"
                    placeholder="Ex: Jam Session — Bar do Zé"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />

                  <Textarea
                    label="Descrição"
                    size="lg"
                    placeholder="Detalhes sobre o evento, rituais, regras..."
                    minRows={5}
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    required
                  />

                  <Group grow>
                    <TextInput label="Local" size="lg" value={formData.place} onChange={(e) => handleChange("place", e.target.value)} />
                    <TextInput label="Cidade" size="lg" value={formData.city} onChange={(e) => handleChange("city", e.target.value)} />
                  </Group>

                  <Group grow>
                    <TextInput label="Estado" size="lg" value={formData.state} onChange={(e) => handleChange("state", e.target.value)} />
                    <TextInput label="País" size="lg" value={formData.country} onChange={(e) => handleChange("country", e.target.value)} />
                  </Group>

                  <Checkbox
                    label="🔒 Este é um evento privado (Requer aprovação)"
                    checked={formData.is_private}
                    onChange={(e) => handleChange("is_private", e.currentTarget.checked)}
                    color="#9f0f0f"
                    mt="md"
                  />
                </Stack>
              </Flex>
            </Paper>

            <Flex mt={20} justify="flex-end" gap={20}>
              <Button
                radius="xl"
                color="gray"
                variant="filled"
                onClick={() => navigate("/eventos")}
                disabled={isLoading}
              >
                Cancelar
              </Button>

              <Button
                radius="xl"
                color="red"
                bg="white"
                c="#9f0f0f"
                onClick={handleSubmit}
                loading={isLoading}
              >
                Criar Evento
              </Button>
            </Flex>
          </Paper>
        </Box>
      </Flex>
    </Box>
  );
}