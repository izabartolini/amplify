import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button, Loader, Center, Text, TextInput, Textarea, Checkbox, Group, Stack } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import Navbar from '../../components/Navbar/Navbar';
import './EventDetails.css';

const getLoggedUserId = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.user_id || payload.id || payload.sub;
  } catch (error) {
    return null;
  }
};

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isRequesting, setIsRequesting] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState({});

  const currentUserId = getLoggedUserId();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setEvent(data);
        } else {
          console.error("Erro ao buscar evento.");
        }
      } catch (error) {
        console.error("Erro de conexão:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleRequestJoin = async () => {
    setIsRequesting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/events/${id}/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok || response.status === 201) {
        setHasRequested(true);
        notifications.show({ title: "Sucesso!", message: "Solicitação enviada/processada.", color: "green" });
      } else {
        const errorData = await response.json();
        notifications.show({ title: "Erro", message: errorData.error || "Erro ao processar.", color: "red" });
      }
    } catch (error) {
      notifications.show({ title: "Erro", message: "Erro de conexão.", color: "red" });
    } finally {
      setIsRequesting(false);
    }
  };

  const handleLeaveEvent = async () => {
    setIsRequesting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/events/${id}/leave`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        notifications.show({ title: "Sucesso", message: "Você saiu do evento.", color: "blue" });
        const refreshResponse = await fetch(`http://localhost:8080/api/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (refreshResponse.ok) setEvent(await refreshResponse.json());
      } else {
        notifications.show({ title: "Erro", message: "Não foi possível sair.", color: "red" });
      }
    } catch (error) {
      notifications.show({ title: "Erro", message: "Erro de conexão.", color: "red" });
    } finally {
      setIsRequesting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja excluir este evento?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/events/${id}/delete`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        notifications.show({ title: "Sucesso", message: "Evento excluído.", color: "green" });
        navigate("/eventos");
      }
    } catch (error) {
      notifications.show({ title: "Erro", message: "Erro de conexão.", color: "red" });
    }
  };

  const startEditing = () => {
    setEditData({
      name: event.name,
      description: event.description,
      place: event.place,
      city: event.city,
      state: event.state,
      is_private: event.is_private,
      date: new Date(event.date),
    });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const payload = { ...editData, date: new Date(editData.date).toISOString() };

      const response = await fetch(`http://localhost:8080/api/events/${id}/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const freshEvent = await (await fetch(`http://localhost:8080/api/events/${id}`, { headers: { Authorization: `Bearer ${token}` } })).json();
        setEvent(freshEvent);
        setIsEditing(false);
        notifications.show({ title: "Sucesso", message: "Evento atualizado!", color: "green" });
      }
    } catch (error) {
      notifications.show({ title: "Erro", message: "Erro ao atualizar.", color: "red" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="event-details-page"><Navbar /><Center style={{ height: '70vh' }}><Loader color="blue" size="xl" /></Center></div>;
  if (!event) return <div className="event-details-page"><Navbar /><Center style={{ height: '70vh' }}><Text size="xl">Evento não encontrado.</Text></Center></div>;

  const date = new Date(event.date);
  const isOwner = Number(currentUserId) === Number(event.user_id || event.UserID);
  const isParticipant = event.participants?.some((p) => Number(p.user_id) === Number(currentUserId));
  const eventOrganizer = event.organizer || {};

  return (
    <div className="event-details-page">
      <Navbar />
      <div className="event-details-content">
        <Link to="/eventos" className="back-link">← Voltar para eventos</Link>

        <div className="event-details-card">
          <div className="event-details-header">
            <div className="event-date-badge-large">
              <span className="event-day-large">{date.getUTCDate()}</span>
              <span className="event-month-large">{date.toLocaleDateString('pt-BR', { month: 'short', timeZone: 'UTC' })}</span>
            </div>
            <div style={{ flex: 1 }}>
              <h1 className="event-details-name">{event.name}</h1>
              <p className="event-details-organizer">Organizado por <strong>{eventOrganizer.Name || "Usuário"}</strong></p>
            </div>
            {isOwner && !isEditing && (
              <Group>
                <Button color="white" variant="light" onClick={startEditing}>Editar</Button>
                <Button color="white" variant="light" onClick={handleDelete}>Excluir</Button>
              </Group>
            )}
          </div>

          {isEditing ? (
            <Stack mt="md" spacing="sm">
              <TextInput label="Nome do Evento" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
              <DateInput label="Data do Evento" value={editData.date} onChange={(date) => setEditData({ ...editData, date })} valueFormat="DD/MM/YYYY" placeholder="Selecione a nova data" />
              <Textarea label="Descrição" value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} />
              <Group grow>
                <TextInput label="Local" value={editData.place} onChange={(e) => setEditData({ ...editData, place: e.target.value })} />
                <TextInput label="Cidade" value={editData.city} onChange={(e) => setEditData({ ...editData, city: e.target.value })} />
                <TextInput label="Estado" value={editData.state} onChange={(e) => setEditData({ ...editData, state: e.target.value })} />
              </Group>
              <Checkbox mt="sm" label="Evento Privado" checked={editData.is_private} onChange={(e) => setEditData({ ...editData, is_private: e.currentTarget.checked })} />
              <Group mt="md">
                <Button onClick={handleSaveEdit} loading={isSaving} color="green">Salvar Alterações</Button>
                <Button variant="default" onClick={() => setIsEditing(false)} disabled={isSaving}>Cancelar</Button>
              </Group>
            </Stack>
          ) : (
            <>
              <p className="event-details-description">{event.description}</p>
              <div className="event-details-meta">
                <span>📍 {event.place}</span>
                <span>{event.city}, {event.state}</span>
                {event.is_private && <span className="event-details-private">🔒 Evento privado</span>}
              </div>

              {!isOwner && (
                isParticipant ? (
                  <Button className="btn-participar" color="red" size="md" mt="xl" loading={isRequesting} onClick={handleLeaveEvent} fullWidth>
                    Cancelar participação
                  </Button>
                ) : event.is_private ? (
                  <Button className="btn-participar" color={hasRequested ? "gray" : "blue"} size="md" mt="xl" loading={isRequesting} disabled={hasRequested} onClick={handleRequestJoin} fullWidth>
                    {hasRequested ? "Solicitação Pendente" : "Solicitar participação"}
                  </Button>
                ) : (
                  <Button className="btn-participar" color="green" size="md" mt="xl" loading={isRequesting} disabled={hasRequested} onClick={handleRequestJoin} fullWidth>
                    Participar
                  </Button>
                )
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventDetails;