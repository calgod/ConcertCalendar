import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import App from './App';
import Concerts from './Concerts'
import reportWebVitals from './reportWebVitals';
import CssBaseline from '@mui/material/CssBaseline';

export default function Index() {
  return (
    <BrowserRouter>
      <Routes>
          <Route index element={<App />} />
          <Route path="concerts" element={<Concerts />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Index />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
