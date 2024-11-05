import { Card, Text, Group, Collapse, SimpleGrid } from '@mantine/core';
import { useState, useEffect } from 'react';
import { fetchCalendarEvents } from '../API/api';

function ConcertGrid() {
  const [events, setEvents] = useState([]);
  const [expandedEventId, setExpandedEventId] = useState(null);

  const toggleExpanded = (id) => {
    setExpandedEventId((prevId) => (prevId === id ? null : id));
  };

  useEffect(() => {
    async function fetchData() {
      const data = await fetchCalendarEvents();
      const today = new Date().toISOString();
      const upcomingEvents = data.items.filter(event => {
        const eventDate = event.start.dateTime || event.start.date;
        return eventDate >= today;
      });
      setEvents(upcomingEvents);
    }

    fetchData();
  }, []);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatDate = (dateString) => {
    const date = new Date(Date.parse(dateString));
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'UTC',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date); 
  };

  // Sort events by date in descending order
  events.sort((a, b) => {
    const dateA = new Date(a.start.dateTime || a.start.date);
    const dateB = new Date(b.start.dateTime || b.start.date);
    return dateA - dateB;
  });

  const rows = events.map((event) => (
    <Card
      key={event.id}
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      onClick={() => toggleExpanded(event.id)}
      style={{
        cursor: 'pointer',
        width: '100%',
        maxWidth: 300,
        height: 'auto', // Change this to a fixed height if needed
      }}
    >
      <Group position="apart" style={{ marginBottom: 5 }}>
        <Text weight={500} style={{ flex: 1 }}>
          {event.summary || 'No Title'}
        </Text>
        <Text color="dimmed" size="sm" style={{ whiteSpace: 'nowrap', marginLeft: 'auto' }}>
          {event.start.dateTime ? formatDateTime(event.start.dateTime) : formatDate(event.start.date)}
        </Text>
      </Group>
      <Collapse in={expandedEventId === event.id}>
        <Text
          size="sm"
          color="gray"
          style={{
            overflowWrap: 'break-word',
          }}
        >
          {event.location || 'No Location Available'}
        </Text>
      </Collapse>
    </Card>
  ));

  return (
    <SimpleGrid
      cols={{ base: 1, sm: 2, lg: 3 }}
      spacing={{ base: 10, sm: 'xl' }}
      verticalSpacing={{ base: 'md', sm: 'xl' }}
    >
      {rows}
    </SimpleGrid>
  );
}

export default ConcertGrid;
