import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './main.css';
import App from './app/App';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Navigate to='/upcoming' replace />} />
            <Route path='/upcoming' element={<App />} />
            <Route path='/history' element={<App />} />
            <Route path='/nowplaying' element={<App />} />
            <Route path='*' element={<Navigate to='/upcoming' replace />} />
          </Routes>
        </BrowserRouter>

        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </MantineProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
