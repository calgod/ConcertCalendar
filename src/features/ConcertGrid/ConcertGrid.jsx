import { Card, Text, Group, Collapse, SimpleGrid } from '@mantine/core';
import { useState, useMemo } from 'react';
import { useCalendarEvents } from '../../hooks/useCalendarEvents';
import './ConcertGrid.css';

function ConcertGrid() {
  const { data, isLoading, isError, error } = useCalendarEvents();
  const [expandedEventId, setExpandedEventId] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const toggleExpanded = id => {
    if (isTransitioning) return;

    if (expandedEventId && expandedEventId !== id) {
      setIsTransitioning(true);
      setExpandedEventId(null);
      // Wait for collapse animation to finish before expanding new card
      setTimeout(() => {
        setExpandedEventId(id);
        setIsTransitioning(false);
      }, 200);
    } else {
      setExpandedEventId(expandedEventId === id ? null : id);
    }
  };

  const getEventStart = event => {
    if (event.start.date) {
      const [y, m, d] = event.start.date.split('-').map(Number);
      return new Date(y, m - 1, d);
    }
    return new Date(event.start.dateTime);
  };

  const events = useMemo(() => {
    if (!data) return [];

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    return data
      .map(event => ({ event, start: getEventStart(event) }))
      .filter(({ start }) => start >= startOfToday)
      .sort((a, b) => a.start - b.start)
      .map(({ event }) => event);
  }, [data]);

  const formatDateTime = dateString => {
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

  const formatDate = dateString => {
    const date = new Date(Date.parse(dateString));
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'UTC',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  if (isLoading) return <Text>Loading events...</Text>;
  if (isError) return <Text>Error: {error.message}</Text>;

  const rows = events.map(event => (
    <Card
      key={event.id}
      shadow='sm'
      padding='lg'
      radius='md'
      withBorder
      onClick={() => toggleExpanded(event.id)}
      className='concert-card'
      style={{
        cursor: 'pointer',
        width: '100%',
        maxWidth: 350,
        height: 'auto',
        maxHeight: expandedEventId === event.id ? 500 : 90,
        transition: 'all 0.2s ease',
        overflow: 'hidden',
        backgroundColor: 'white',
        color: 'rgb(59, 59, 59)',
      }}
    >
      <Group position='apart' style={{ marginBottom: 5 }}>
        <Text
          weight={500}
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          {event.summary || 'No Title'}
        </Text>
        <Text
          c='dimmed'
          size='sm'
          style={{ flex: 1, whiteSpace: 'wrap', marginLeft: 'auto' }}
        >
          {event.start.dateTime
            ? formatDateTime(event.start.dateTime)
            : formatDate(event.start.date)}
        </Text>
      </Group>
      <Collapse in={expandedEventId === event.id} transitionDuration={200}>
        <Text
          size='sm'
          color='gray'
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
    <div className='simpleGridDiv'>
      <SimpleGrid
        cols={{ base: 1, sm: 2, lg: 3 }}
        spacing={{ base: 10, sm: 'xl' }}
        verticalSpacing={{ base: 'md', sm: 'xl' }}
        pt='lg'
      >
        {rows}
      </SimpleGrid>
    </div>
  );
}

export default ConcertGrid;
