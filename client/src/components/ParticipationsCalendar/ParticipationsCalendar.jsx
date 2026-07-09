import { useState } from 'react';
import { DatePicker } from '@mantine/dates';
import { Indicator, Drawer, Text, Card, Badge, Group, Button, Box, Paper, ScrollArea, Stack } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

import './ParticipationsCalendar.css';

export default function ParticipationsCalendar({ events }) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [drawerOpened, setDrawerOpened] = useState(false);
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
            setDrawerOpened(true);
        }
    };

    return (
        <Box className="calendar-scroll-container">
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

                        const hasOrganizedEvent = dayEvents.some(e => e.is_organizer);

                        return (
                            <Indicator
                                size={hasEvent ? 20 : 0}
                                color={hasOrganizedEvent ? '#9f0f0f' : '#e69e38'}
                                offset={4}
                                disabled={!hasEvent}
                                processing={hasEvent}
                                zIndex={2}
                                label={dayEvents.length > 1 ? dayEvents.length : null}
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

            <Drawer
                opened={drawerOpened}
                onClose={() => setDrawerOpened(false)}
                title={<Text weight={700} size="lg">Eventos do dia ({selectedDate?.length})</Text>}
                padding="md"
                size="md"
                position="right"
            >
                <ScrollArea.Autosize maxHeight="90vh" offsetScrollbars>
                    <Stack spacing="md">
                        {selectedDate?.map((event) => (
                            <Card key={event.id} shadow="sm" p="md" radius="md" withBorder>
                                <Group position="apart" mb="xs">
                                    <Text weight={700} size="md" c="#5d2b16">{event.name}</Text>
                                    {event.is_private && <Badge color="red" variant="light" size="sm">Privado</Badge>}
                                </Group>
                                
                                <Text size="sm" color="dimmed" lineClamp={2} mb="sm">
                                    {event.description}
                                </Text>
                                
                                <Text size="xs" color="dimmed" mb="md">
                                    📍 {event.place ? `${event.place}, ` : ''}{event.city} - {event.state}
                                </Text>

                                <Button
                                    variant="filled"
                                    color="red"
                                    bg="#9f0f0f"
                                    fullWidth
                                    radius="xl"
                                    size="sm"
                                    onClick={() => navigate(`/eventos/${event.id}`)}
                                >
                                    Ver Detalhes
                                </Button>
                            </Card>
                        ))}
                    </Stack>
                </ScrollArea.Autosize>
            </Drawer>
        </Box>
    );
}