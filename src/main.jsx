import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import './main.css';
import App from './app/App';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Mantine 9 changes the default radius (sm -> md) and medium font weight
// (500 -> 600). Pin the previous values so existing components look the same.
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

        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </MantineProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
