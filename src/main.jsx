import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import './main.css';
import App from './app/App';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const ReactQueryDevtools = import.meta.env.DEV
  ? (await import('@tanstack/react-query-devtools')).ReactQueryDevtools
  : null;

const theme = createTheme({
  defaultRadius: 'sm',
  fontWeights: {
    medium: '500',
  },
});

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
      <MantineProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route index element={<App />} />
          </Routes>
        </BrowserRouter>

        {ReactQueryDevtools && <ReactQueryDevtools initialIsOpen={false} />}
      </MantineProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
