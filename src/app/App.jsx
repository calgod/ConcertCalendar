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
import { Tabs, rem } from '@mantine/core';
import {
  IconMusicPin,
  IconHistory,
  IconBrandLastfm,
} from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';

const tabs = [
  {
    value: 'upcoming',
    label: 'Upcoming',
    icon: IconMusicPin,
    panel: <ConcertGrid />,
  },
  {
    value: 'history',
    label: 'History',
    icon: IconHistory,
    panel: <ConcertHistory />,
  },
  {
    value: 'nowplaying',
    label: 'Now Playing',
    icon: IconBrandLastfm,
    panel: <MostRecentTrack />,
  },
];

function App() {
  const iconStyle = { width: rem(16), height: rem(16) };
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.split('/')[1];
  const activeTab = tabs.some(tab => tab.value === currentPath)
    ? currentPath
    : 'upcoming';

  return (
    <div className='app-shell'>
      <header className='app-header'>
        <ResponsiveHeader />
      </header>

      <Tabs
        value={activeTab}
        onChange={value => {
          if (!value || value === activeTab) return;
          navigate(`/${value}`);
        }}
        className='app-tabs'
      >
        <Tabs.List justify='center'>
          {tabs.map(({ value, label, icon: Icon }) => (
            <Tabs.Tab
              key={value}
              value={value}
              leftSection={<Icon style={iconStyle} />}
            >
              {label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        <main className='contentDiv'>
          {tabs.map(({ value, panel }) => (
            <Tabs.Panel key={value} value={value}>
              {panel}
            </Tabs.Panel>
          ))}
        </main>
      </Tabs>
    </div>
  );
}

export default App;
