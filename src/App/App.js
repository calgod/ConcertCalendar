import './App.css';
import React from 'react';
import { Link } from "react-router-dom";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import ConcertGrid from '../ConcertGrid/ConcertGrid';
import ResponsiveHeader from '../ResponsiveHeader/ResponsiveHeader';
import { Space } from '@mantine/core';

function App() {

  return (
    <div className='App'>
      <Space h={30}></Space>
      <div className='headerDiv'>
        <ResponsiveHeader></ResponsiveHeader>
      </div>
      <Space h={30}></Space>
      <div>
        <ConcertGrid></ConcertGrid>
      </div>
      <Space h={30}></Space>
      <div>
        <Link hidden = "true" className='link' to="/concerts">Concerts I've been to</Link>
      </div>
    </div>
  );
}

export default App;
