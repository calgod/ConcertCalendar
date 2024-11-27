import './App.css';
import React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import ConcertGrid from '../ConcertGrid/ConcertGrid';
import ResponsiveHeader from '../ResponsiveHeader/ResponsiveHeader';
import ConcertHistory from '../ConcertHistory/ConcertHistory';
import { Space, Tabs, rem } from '@mantine/core';
import {IconMusicPin, IconHistory} from '@tabler/icons-react';

function App() {
  const iconStyle = { width: rem(16), height: rem(16) };

  return (
    <div className='App'>
      <Space h={30}></Space>
      <div className='headerDiv'>
        <ResponsiveHeader></ResponsiveHeader>
      </div>

      <div>
      <Tabs defaultValue="upcoming">
        <Tabs.List justify='center'>
          <Tabs.Tab value="upcoming" leftSection={<IconMusicPin style={iconStyle} />}>
            Upcoming
          </Tabs.Tab>
          <Tabs.Tab value="history" leftSection={<IconHistory style={iconStyle} />}>
            History
          </Tabs.Tab>
        </Tabs.List>
  
        <Tabs.Panel value="upcoming">
    
          <div>
            <ConcertGrid></ConcertGrid>
          </div>
        </Tabs.Panel>
  
        <Tabs.Panel value="history">
          <div>
            <ConcertHistory></ConcertHistory>
          </div>     
        </Tabs.Panel>
  
      </Tabs>
      </div>

    </div>
  );
}

export default App;
