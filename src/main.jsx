import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './main.css';
import App from './App/App';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css'; 

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <MantineProvider 
  >
    <BrowserRouter>
      <Routes>
        <Route index element={<App />} />
      </Routes>
    </BrowserRouter>
  </MantineProvider>
);