import { useState } from 'react';
import { DatePicker } from '@mantine/dates';
import { Indicator, Modal, Text, Card, Badge, Group, Button, Box, Paper } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

export default function ParticipationsCalendar({ events }) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [modalOpened, setModalOpened] = useState(false);
    const navigate = useNavigate();

    const getEventsForDate = (date) => {
        if (!date) return [];
        return events.filter((e) => {
            const eventDate = dayjs(e.date).format('YYYY-MM-DD');
            const targetDate = dayjs(date).format('YYYY-MM-DD');
            return eventDate === targetDate;
        });
    };

    const handleDayClick = (date) => {
        const dayEvents = getEventsForDate(date);
        if (dayEvents.length > 0) {
            setSelectedDate(dayEvents);
            setModalOpened(true);
        }
    };

    return (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '10px' }}>

            <Paper
                bg="#9f0f0f"
                p="md"
                radius="lg"
                shadow="md"
                sx={{ width: '100%' }}
            >
                <DatePicker
                    locale="pt-br"
                    size="sm"
                    onChange={handleDayClick}
                    allowDeselect={false}
                    styles={{
                        root: { width: '100%' },
                        calendar: { width: '100%' },
                        monthsList: { width: '100%' },

                        calendarHeader: {
                            width: '100%',
                            display: 'flex !important',
                            justifyContent: 'space-between !important',
                            alignItems: 'center',
                            marginBottom: '10px',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.4)',
                            paddingBottom: '10px',
                        },
                        calendarHeaderLevel: {
                            color: 'white',
                            fontSize: '1.2rem',
                            fontWeight: 700,
                            textTransform: 'capitalize',
                            flex: '1 !important',
                            textAlign: 'center',
                            display: 'flex',
                            justifyContent: 'center', 
                            margin: '0 !important',
                            '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                        },
                        calendarHeaderControl: {
                            color: 'white',
                            flex: '0 0 auto !important',
                            '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                        },
                        month: {
                            width: '100%',
                            tableLayout: 'fixed',
                            borderCollapse: 'separate',
                            borderSpacing: '5px',
                        },
                        weekday: {
                            color: 'white',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.4)',
                            paddingBottom: '6px',
                        },
                        day: {
                            width: '100%',
                            height: '95px',
                            padding: 0,
                            backgroundColor: 'white',
                            color: '#333',
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            borderRadius: '4px',
                            '&[data-outside]': {
                                backgroundColor: '#e6caca',
                                color: '#a38787',
                            },
                            '&:hover': {
                                backgroundColor: '#f1f1f1',
                            }
                        },
                    }}
                    renderDay={(date) => {
                        const dayEvents = getEventsForDate(date);
                        const hasEvent = dayEvents.length > 0;
                        const dayNumber = dayjs(date).date();

                        return (
                            <Indicator
                                size={18}
                                color="#e69e38"
                                offset={4}
                                disabled={!hasEvent}
                                processing={hasEvent}   
                                zIndex={2}
                                style={{ width: '100%', height: '100%', display: 'block' }}
                            >
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    justifyContent: 'flex-start',
                                }}>
                                    {dayNumber}
                                </div>
                            </Indicator>
                        );
                    }}
                />
            </Paper>

            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title={<Text weight={700} size="md">Eventos do dia</Text>}
                centered
            >
                {selectedDate?.map((event) => (
                    <Card key={event.id} shadow="sm" p="md" radius="md" withBorder mb="sm">
                        <Group position="apart" mt="xs" mb="xs">
                            <Text weight={700} size="md" c="#5d2b16">{event.name}</Text>
                            {event.is_private && <Badge color="red" variant="light" size="sm">Privado</Badge>}
                        </Group>

                        <Text size="sm" color="dimmed" lineClamp={3} mb="sm">
                            {event.description}
                        </Text>

                        <Text size="xs" color="dimmed" mb="sm">
                            📍 {event.place ? `${event.place}, ` : ''}{event.city} - {event.state}
                        </Text>

                        <Button
                            variant="filled"
                            color="red"
                            bg="#9f0f0f"
                            fullWidth
                            mt="sm"
                            radius="xl"
                            size="sm"
                            onClick={() => navigate(`/eventos/${event.id}`)}
                        >
                            Ver Detalhes do Evento
                        </Button>
                    </Card>
                ))}
            </Modal>
        </Box>
    );
}