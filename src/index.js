import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import App from './App/App';
import reportWebVitals from './reportWebVitals';
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
