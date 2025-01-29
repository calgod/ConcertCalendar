import React, { useEffect, useState } from 'react';
import { Card, Group, Image, Text } from '@mantine/core';
import './MostRecentTrack.css'
import { fetchLastFm } from '../API/api';

const MostRecentTrack = () => {
  const [track, setTrack] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentTrack = async () => {
      try {
        const data = await fetchLastFm();

        if (data.recenttracks?.track?.length) {
          setTrack(data.recenttracks.track[0]);
        }
      } catch (err) {
        setError('Failed to fetch the recent track.');
      }
    };

    fetchRecentTrack();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='cardDiv'>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        {track ? (
          <Group noWrap>
            <Image
              src={track.image[2]['#text']}
              alt="Album Art"
              width={100}
              height={100}
              radius="md"
            />
            <div className='textDiv'>
              <Text weight={500}><strong>Track:</strong> {track.name}</Text>
              <Text><strong>Artist:</strong> {track.artist['#text']}</Text>
              {track.album['#text'] && <Text><strong>Album:</strong> {track.album['#text']}</Text>}
            </div>
          </Group>
        ) : (
          <Text>Loading...</Text>
        )}
      </Card>
    </div>
  );
};

export default MostRecentTrack;
