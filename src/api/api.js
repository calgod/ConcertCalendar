export const fetchCalendarEvents = async () => {
  const response = await fetch('https://www.calgod.com/api');

  if (!response.ok) {
    throw new Error('Failed to fetch calendar events');
  }

  return response.json();
};

export const fetchLastFm = async () => {
  const response = await fetch('https://www.calgod.com/lastfm-api');

  if (!response.ok) {
    throw new Error('Failed to fetch lastfm data');
  }

  return response.json();
};
