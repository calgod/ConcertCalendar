import { Card, Group, Image, Skeleton, Text } from '@mantine/core';
import './MostRecentTrack.css';
import { useLastFm } from '../../hooks/useLastFm';

const MostRecentTrack = () => {
  const { data: track, isLoading, isError, error } = useLastFm();

  if (isLoading) {
    return (
      <div className='cardDiv'>
        <Card shadow='sm' padding='lg' radius='md' withBorder>
          <Group wrap='nowrap'>
            <Skeleton width={100} height={100} radius='md' />
            <div className='textDiv'>
              <Skeleton height={16} width={160} mb={8} />
              <Skeleton height={16} width={120} mb={8} />
              <Skeleton height={16} width={140} />
            </div>
          </Group>
        </Card>
      </div>
    );
  }
  if (isError) return <Text>Error: {error.message}</Text>;

  return (
    <div className='cardDiv'>
      <Card shadow='sm' padding='lg' radius='md' withBorder>
        <Group wrap='nowrap'>
          <Image
            className='albumArt'
            src={track.image[2]['#text']}
            alt='Album Art'
            width={100}
            height={100}
            radius='md'
          />
          <div className='textDiv'>
            <Text weight={500}>
              <strong>Track:</strong> {track.name}
            </Text>
            <Text>
              <strong>Artist:</strong> {track.artist['#text']}
            </Text>
            {track.album['#text'] && (
              <Text>
                <strong>Album:</strong> {track.album['#text']}
              </Text>
            )}
          </div>
        </Group>
      </Card>
    </div>
  );
};

export default MostRecentTrack;
