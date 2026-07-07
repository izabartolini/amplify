import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button, Loader, Center, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import Navbar from '../../components/Navbar/Navbar';
import './EventDetails.css';

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequesting, setIsRequesting] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);



  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch(`/api/events/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
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

      const response = await fetch(`/api/events/${id}/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });


      if (response.ok || response.status === 201) {

        setHasRequested(true);

        notifications.show({
          title: "Sucesso!",
          message: event.is_private
            ? "Sua solicitação foi enviada ao organizador."
            : "Você entrou no evento.",
          color: "green",
        });


      } else {

        const errorData = await response.json();

        notifications.show({
          title: "Erro",
          message: errorData.error || "Não foi possível processar.",
          color: "red",
        });

      }


    } catch (error) {

      notifications.show({
        title: "Erro de conexão",
        message: "Verifique sua internet.",
        color: "red",
      });


    } finally {
      setIsRequesting(false);
    }
  };


  const handleDelete = async () => {

    const confirm = window.confirm(
      "Tem certeza que deseja excluir este evento?"
    );

    if (!confirm) return;


    try {

      const token = localStorage.getItem("token");


      const response = await fetch(`/api/events/${id}/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      if (response.ok) {

        notifications.show({
          title: "Evento excluído",
          message: "O evento foi removido com sucesso.",
          color: "green",
        });


        navigate("/eventos");


      } else {

        const error = await response.json();

        notifications.show({
          title: "Erro",
          message: error.error || "Não foi possível excluir o evento.",
          color: "red",
        });

      }


    } catch (error) {

      notifications.show({
        title: "Erro",
        message: "Erro de conexão.",
        color: "red",
      });

    }

  };


  if (isLoading) {
    return (
      <div className="event-details-page">
        <Navbar />

        <Center style={{ height: '70vh' }}>
          <Loader color="blue" size="xl" />
        </Center>

      </div>
    );
  }


  if (!event) {
    return (
      <div className="event-details-page">
        <Navbar />

        <Center style={{ height: '70vh' }}>
          <Text size="xl">
            Evento não encontrado.
          </Text>
        </Center>

      </div>
    );
  }


  const date = new Date(event.date);


  return (

    <div className="event-details-page">

      <Navbar />


      <div className="event-details-content">

        <Link
          to="/eventos"
          className="back-link"
        >
          ← Voltar para eventos
        </Link>


        <div className="event-details-card">


          <div className="event-details-header">


            <div className="event-date-badge-large">

              <span className="event-day-large">
                {date.getDate()}
              </span>

              <span className="event-month-large">
                {date.toLocaleDateString(
                  'pt-BR',
                  { month: 'short' }
                )}
              </span>

            </div>
            <div style={{ flex: 1 }}>

              <h1 className="event-details-name">
                {event.name}
              </h1>
              <p className="event-details-organizer">

                Organizado por{" "}

                <strong>
                  {event.organizer?.name || "Usuário"}
                </strong>


                {
                  event.organizer?.username &&
                  ` (@${event.organizer.username})`
                }

              </p>


            </div>
            <Button
              color="white"
              variant="light"
              onClick={handleDelete}
            >
              Excluir
            </Button>
          </div>
          <p className="event-details-description">
            {event.description}
          </p>
          <div className="event-details-meta">

            <span>
              📍 {event.place}
            </span>

            <span>
              {event.city}, {event.state}
            </span>


            {
              event.is_private &&
              <span className="event-details-private">
                🔒 Evento privado
              </span>
            }


          </div>
          {
            event.is_private ? (

              <Button
                className="btn-participar"
                color={hasRequested ? "gray" : "blue"}
                size="md"
                mt="xl"
                loading={isRequesting}
                disabled={hasRequested}
                onClick={handleRequestJoin}
                fullWidth
              >

                {
                  hasRequested
                    ? "Solicitação Pendente"
                    : "Solicitar participação"
                }

              </Button>


            ) : (


              <Button
                className="btn-participar"
                color={hasRequested ? "gray" : "green"}
                size="md"
                mt="xl"
                loading={isRequesting}
                disabled={hasRequested}
                onClick={handleRequestJoin}
                fullWidth
              >

                {
                  hasRequested
                    ? "✓ Você já participa deste evento"
                    : "Participar"
                }

              </Button>


            )
          }


        </div>


      </div>


    </div>

  );

}


export default EventDetails;