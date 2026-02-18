import {
  Card,
  Text,
  Group,
  Collapse,
  SimpleGrid,
  Stack,
  TextInput,
  Paper,
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useState, useMemo, useRef, useEffect } from 'react';
import { useCalendarEvents } from '../../hooks/useCalendarEvents';
import './ConcertGrid.css';

const GRID_SPACING = 20;

function ConcertGrid() {
  const { data, isLoading, isError, error } = useCalendarEvents();
  const [expandedEventId, setExpandedEventId] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const transitionTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const toggleExpanded = id => {
    if (isTransitioning) return;

    if (expandedEventId && expandedEventId !== id) {
      setIsTransitioning(true);
      setExpandedEventId(null);
      transitionTimeoutRef.current = window.setTimeout(() => {
        setExpandedEventId(id);
        setIsTransitioning(false);
        transitionTimeoutRef.current = null;
      }, 200);
    } else {
      setExpandedEventId(expandedEventId === id ? null : id);
    }
  };

  const getEventStart = event => {
    if (event.start.date) {
      const [year, month, day] = event.start.date.split('-').map(Number);
      return new Date(year, month - 1, day);
    }
    return new Date(event.start.dateTime);
  };

  const upcomingEvents = useMemo(() => {
    if (!data) return [];

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    return data
      .map(event => ({ event, start: getEventStart(event) }))
      .filter(({ start }) => start >= startOfToday)
      .sort((a, b) => a.start - b.start)
      .map(({ event }) => event);
  }, [data]);

  const events = useMemo(() => {
    if (!searchValue.trim()) {
      return upcomingEvents;
    }

    const normalizedQuery = searchValue.trim().toLowerCase();
    return upcomingEvents.filter(event => {
      const title = event.summary?.toLowerCase() ?? '';
      const location = event.location?.toLowerCase() ?? '';
      return title.includes(normalizedQuery) || location.includes(normalizedQuery);
    });
  }, [upcomingEvents, searchValue]);

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
    const isExpanded = expandedEventId === event.id;

    return (
      <Card
        key={event.id}
        shadow='sm'
        padding='lg'
        radius='md'
        withBorder
        onClick={() => toggleExpanded(event.id)}
        role='button'
        tabIndex={0}
        aria-expanded={isExpanded}
        onKeyDown={evt => {
          if (evt.key === 'Enter' || evt.key === ' ') {
            evt.preventDefault();
            toggleExpanded(event.id);
          }
        }}
        className='concert-card'
        style={{
          cursor: 'pointer',
          width: '100%',
          maxWidth: 350,
          height: 'auto',
          maxHeight: isExpanded ? 500 : 90,
          transition: 'all 0.2s ease',
          overflow: 'hidden',
          backgroundColor: 'white',
          color: 'rgb(59, 59, 59)',
        }}
      >
        <Group justify='space-between' style={{ marginBottom: 5 }}>
          <Text weight={500} style={{ flex: 1, textAlign: 'left' }}>
            {event.summary || 'No Title'}
          </Text>
          <Text
            c='dimmed'
            size='sm'
            style={{ flex: 1, whiteSpace: 'normal', textAlign: 'right' }}
          >
            {event.start.dateTime
              ? formatDateTime(event.start.dateTime)
              : formatDate(event.start.date)}
          </Text>
        </Group>
        <Collapse in={isExpanded} transitionDuration={200}>
          <Text
            size='sm'
            c='gray'
            style={{
              overflowWrap: 'break-word',
              textAlign: 'left',
            }}
          >
            {event.location || 'No Location Available'}
          </Text>
        </Collapse>
      </Card>
    );
  });

  return (
    <Stack className='concert-grid-container'>
      <div className='concert-grid-shell'>
        <Paper withBorder shadow='xs' radius='md' p='sm' className='concert-toolbar'>
          <Group
            justify='space-between'
            align='center'
            wrap='wrap'
            className='concert-toolbar-layout'
          >
            <div className='concert-toolbar-copy'>
              <Text fw={600} size='sm'>
                Upcoming Events
              </Text>
              <Text c='dimmed' size='xs'>
                {events.length} shown
                {searchValue.trim()
                  ? ` (filtered from ${upcomingEvents.length})`
                  : ''}
              </Text>
            </div>

            <TextInput
              value={searchValue}
              onChange={event => setSearchValue(event.currentTarget.value)}
              placeholder='Search by artist, venue, or city'
              aria-label='Search upcoming events'
              className='concert-search'
              size='sm'
              radius='md'
              variant='filled'
              leftSection={<IconSearch size={15} stroke={1.8} />}
            />
          </Group>
        </Paper>
        <div className='simpleGridDiv'>
          {events.length === 0 ? (
            <Text className='no-events-text'>No matching upcoming events found.</Text>
          ) : (
            <SimpleGrid
              cols={{ base: 1, sm: 2, lg: 3 }}
              spacing={GRID_SPACING}
              verticalSpacing={GRID_SPACING}
              pt='lg'
            >
              {rows}
            </SimpleGrid>
          )}
        </div>
      </div>
    </Stack>
  );
}

export default ConcertGrid;
