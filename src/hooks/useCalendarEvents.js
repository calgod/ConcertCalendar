import { useQuery } from '@tanstack/react-query';
import { fetchCalendarEvents } from '../API/api';

export function useCalendarEvents() {
  return useQuery({
    queryKey: ['calendar-events'],
    queryFn: async () => {
      const data = await fetchCalendarEvents();
      return data.calendarEvents.items;
    },
    staleTime: 5 * 60 * 1000,
  });
}
