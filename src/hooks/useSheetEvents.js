import { useQuery } from '@tanstack/react-query';
import { fetchCalendarEvents } from '../API/api';

export function useSheetEvents() {
  return useQuery({
    queryKey: ['sheet-events'],
    queryFn: async () => {
      const data = await fetchCalendarEvents();
      return data.sheetData?.values?.flat() || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}
