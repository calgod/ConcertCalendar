import './App.css';
import React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import ConcertGrid from '../features/ConcertGrid/ConcertGrid';
import ResponsiveHeader from '../features/ResponsiveHeader/ResponsiveHeader';
import ConcertHistory from '../features/ConcertHistory/ConcertHistory';
import MostRecentTrack from '../features/MostRecentTrack/MostRecentTrack';
import { Space, Tabs } from '@mantine/core';
import {
  IconMusicPin,
  IconHistory,
  IconBrandLastfm,
} from '@tabler/icons-react';

function App() {
  return (
    <div className='App'>
      <Space h={30}></Space>
      <div className='headerDiv'>
        <ResponsiveHeader></ResponsiveHeader>

        <Tabs
          className='concertTabs'
          variant='pills'
          defaultValue='upcoming'
          keepMountedMode='display-none'
        >
          <Tabs.List justify='center'>
            <Tabs.Tab
              value='upcoming'
              leftSection={<IconMusicPin size={16} stroke={1.75} />}
            >
              Upcoming
            </Tabs.Tab>
            <Tabs.Tab
              value='history'
              leftSection={<IconHistory size={16} stroke={1.75} />}
            >
              History
            </Tabs.Tab>
            <Tabs.Tab
              value='recent'
              leftSection={<IconBrandLastfm size={16} stroke={1.75} />}
            >
              Now Playing
            </Tabs.Tab>
          </Tabs.List>
          <div className='contentDiv'>
            <Tabs.Panel value='upcoming'>
              <div>
                <ConcertGrid></ConcertGrid>
              </div>
            </Tabs.Panel>

            <Tabs.Panel value='history'>
              <div>
                <ConcertHistory></ConcertHistory>
              </div>
            </Tabs.Panel>

            <Tabs.Panel value='recent'>
              <div>
                <MostRecentTrack></MostRecentTrack>
              </div>
            </Tabs.Panel>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

export default App;
