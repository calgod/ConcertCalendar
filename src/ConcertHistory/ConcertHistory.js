import React, { useState, useEffect } from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Card, Text, Group, SimpleGrid } from '@mantine/core';
import { fetchCalendarEvents } from '../API/api';

function ConcertHistory() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await fetchCalendarEvents();
      const previousEvents = data.sheetData.values; // Assuming this is an array of arrays
      setEvents(previousEvents.flat()); // Flatten the array to get all strings
    }

    fetchData();
  }, []);

  const rows = events.map((event, index) => (
    <Card
      key={index}
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      className="concert-card"
      style={{
        cursor: 'pointer',
        width: '100%',
        maxWidth: 350,
        height: 'auto',
        maxHeight: 90,
        transition: 'all 0.2s ease',
        overflow: 'hidden',
        backgroundColor: 'white',
        color: 'rgb(59, 59, 59)'
      }}
    >
      <Group position="apart" style={{ marginBottom: 5 }}>
        <Text weight={500} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {event}
        </Text>
      </Group>
    </Card>
  ));

  return (
    <SimpleGrid
      cols={4}
      spacing="lg"
      verticalSpacing="lg"
      pt="lg"
    >
      {rows}
    </SimpleGrid>
  );
}

export default ConcertHistory;