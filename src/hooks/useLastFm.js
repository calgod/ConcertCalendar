import { useQuery } from '@tanstack/react-query';
import { fetchLastFm } from '../api/api';

export function useLastFm() {
  return useQuery({
    queryKey: ['lastfm'],
    queryFn: async () => {
      const data = await fetchLastFm();
      return data.recenttracks?.track?.[0] ?? null;
    },
    staleTime: 10000,
    refetchInterval: 10000,
  });
}
