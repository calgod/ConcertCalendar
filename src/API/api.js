export const fetchCalendarEvents = async () => {
    try {
        const response = await fetch(
            `https://www.calgod.com/api`
        );
        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching calendar events: ", error);
    }
    };