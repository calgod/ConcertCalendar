import cx from 'clsx';
import { useState, useEffect } from 'react';
import { Table, ScrollArea } from '@mantine/core';
import classes from './EventTable.module.css';

export function EventTable() {
    const [events, setEvents] = useState([]);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {

        const fetchCalendarEvents = async () => {
        try {
            const response = await fetch(
                `https://www.calgod.com/api`
            );
            const data = await response.json();

            // Filter events to exclude those before today
            const today = new Date().toISOString();
            const upcomingEvents = data.items.filter(event => {
                const eventDate = event.start.dateTime || event.start.date;
                return eventDate >= today;
            });

            setEvents(upcomingEvents);
        } catch (error) {
            console.error("Error fetching calendar events: ", error);
        }
        };

        fetchCalendarEvents();
    }, []);

    // Function to format the date
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        const options = { month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true};
        return date.toLocaleString('en-US', options); // Adjust this if you want a specific format
    };

    // Function to format the date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { month: '2-digit', day: '2-digit', year: 'numeric' };
        return date.toLocaleDateString('en-US', options); // Formats date to MM/DD/YYYY
    };

    // Sort events by date in descending order
    events.sort((a, b) => {
        const dateA = new Date(a.start.dateTime || a.start.date);
        const dateB = new Date(b.start.dateTime || b.start.date);
        return dateA - dateB;
    });

    const rows = events.map((event) => (
        <Table.Tr key={event.id}>
        <Table.Td>{event.summary || 'No Title'}</Table.Td>
        <Table.Td>        
            {event.start.dateTime ? formatDateTime(event.start.dateTime) : formatDate(event.start.date)}
        </Table.Td>
        <Table.Td>{event.location}</Table.Td>
        </Table.Tr>
    ));

    return (
        <ScrollArea h={500} w={700} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
        <Table miw={50}>
            <Table.Thead className={cx(classes.tableHeader, { [classes.scrolled]: scrolled })}>
            <Table.Tr>
                <Table.Th>Event</Table.Th>
                <Table.Th>Date</Table.Th>
                <Table.Th>Location</Table.Th>
            </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
        </ScrollArea>
    );
    }

export default EventTable;
