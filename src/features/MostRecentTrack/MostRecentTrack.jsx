import { Card, Group, Image, Text } from '@mantine/core';
import './MostRecentTrack.css';
import { useLastFm } from '../../hooks/useLastFm';

const MostRecentTrack = () => {
  const { data: track, isLoading, isError, error } = useLastFm();

  if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error: {error.message}</Text>;
  if (!track) return <Text>No recent track found.</Text>;

  const imageUrl = track.image?.[2]?.['#text'] || track.image?.[1]?.['#text'];
  const trackName = track.name || 'Unknown Track';
  const artistName = track.artist?.['#text'] || 'Unknown Artist';
  const albumName = track.album?.['#text'];

  return (
    <div className='cardDiv'>
      <Card shadow='sm' padding='lg' radius='md' withBorder className='trackCard'>
        <Group wrap='nowrap'>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`${trackName} album art`}
              width={100}
              height={100}
              radius='md'
            />
          ) : (
            <div className='albumArtFallback'>No Art</div>
          )}
          <div className='textDiv'>
            <Text weight={500}>
              <strong>Track:</strong> {trackName}
            </Text>
            <Text>
              <strong>Artist:</strong> {artistName}
            </Text>
            {albumName && (
              <Text>
                <strong>Album:</strong> {albumName}
              </Text>
            )}
          </div>
        </Group>
      </Card>
    </div>
  );
};

export default MostRecentTrack;
