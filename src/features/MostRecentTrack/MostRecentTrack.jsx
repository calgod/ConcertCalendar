import { Card, Group, Image, Text } from '@mantine/core';
import './MostRecentTrack.css';
import { useLastFm } from '../../hooks/useLastFm';

const MostRecentTrack = () => {
  const { data: track, isLoading, isError, error } = useLastFm();

  if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error: {error.message}</Text>;

  return (
    <div className='cardDiv'>
      <Card
        className='track-card'
        shadow='sm'
        padding='lg'
        radius='md'
        withBorder
      >
        <Group wrap='nowrap' align='center' gap='md'>
          <Image
            className='albumArt'
            src={track.image[2]['#text']}
            alt='Album Art'
            width={96}
            height={96}
            radius='md'
          />
          <div className='textDiv'>
            <Text className='track-kicker'>Now playing</Text>
            <Text className='track-name'>{track.name}</Text>
            <Text className='track-meta'>{track.artist['#text']}</Text>
            {track.album['#text'] && (
              <Text className='track-meta'>{track.album['#text']}</Text>
            )}
          </div>
        </Group>
      </Card>
    </div>
  );
};

export default MostRecentTrack;
