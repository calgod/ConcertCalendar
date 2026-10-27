import { Card, Text, Collapse, SimpleGrid } from '@mantine/core';
import { IconMapPin } from '@tabler/icons-react';
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

  const rows = events.map(event => {
    const location = event.location?.trim();
    const expanded = expandedEventId === event.id;
    const dateParts = getDateParts(event);
    const fullDate = event.start.dateTime
      ? formatDateTime(event.start.dateTime)
      : formatDate(event.start.date);

    return (
      <Card
        key={event.id}
        shadow='sm'
        radius='md'
        withBorder
        onClick={() => toggleExpanded(event.id)}
        className={expanded ? 'concert-card expanded' : 'concert-card'}
      >
        <div className='concert-card-main'>
          <div className='concert-date-badge' title={fullDate}>
            <span className='concert-date-month'>{dateParts.month}</span>
            <span className='concert-date-day'>{dateParts.day}</span>
          </div>
          <div className='concert-card-copy'>
            <Text className='concert-card-title'>
              {event.summary || 'No Title'}
            </Text>
            <Text className='concert-card-time'>
              {dateParts.time} · {dateParts.year}
            </Text>
          </div>
        </div>
        <Collapse expanded={expanded} transitionDuration={200}>
          <Text className='concert-card-location'>
            {location ? (
              <a
                className='concert-location'
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
                target='_blank'
                rel='noopener noreferrer'
                onClick={e => e.stopPropagation()}
              >
                <IconMapPin size={14} className='concert-location-pin' />
                {location}
              </a>
            ) : (
              'No Location Available'
            )}
          </Text>
        </Collapse>
      </Card>
    );
  });

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

function getDateParts(event) {
  const hasTime = Boolean(event.start.dateTime);
  const date = hasTime
    ? new Date(event.start.dateTime)
    : new Date(Date.parse(event.start.date));
  const timeZone = hasTime ? 'America/New_York' : 'UTC';
  const month = new Intl.DateTimeFormat('en-US', {
    timeZone,
    month: 'short',
  }).format(date);
  const day = new Intl.DateTimeFormat('en-US', {
    timeZone,
    day: 'numeric',
  }).format(date);
  const year = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
  }).format(date);
  const time = hasTime
    ? new Intl.DateTimeFormat('en-US', {
        timeZone,
        hour: 'numeric',
        minute: '2-digit',
      }).format(date)
    : 'All day';

  return { month, day, time, year };
}

export default ConcertGrid;
