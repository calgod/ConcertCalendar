import { createTheme } from '@mantine/core';

const rose = [
  '#fbf6f5',
  '#f6ebe8',
  '#f0ddd8',
  '#e4c9c2',
  '#d4aaa1',
  '#c48b80',
  '#b37268',
  '#96584f',
  '#7a453e',
  '#5c332e',
];

const gray = [
  '#f8f4f3',
  '#f0eae8',
  '#e6dcd9',
  '#d5c8c4',
  '#b7a8a3',
  '#9a8882',
  '#7d6b66',
  '#645652',
  '#4a403d',
  '#2c2422',
];

export const theme = createTheme({
  primaryColor: 'rose',
  primaryShade: 7,
  defaultRadius: 'md',
  fontFamily: 'Roboto, sans-serif',
  fontWeights: {
    medium: '500',
  },
  white: '#fffdfc',
  black: '#2c2422',
  colors: {
    rose,
    gray,
  },
  shadows: {
    xs: '0 1px 2px rgba(62, 32, 28, 0.05)',
    sm: '0 1px 2px rgba(62, 32, 28, 0.04), 0 8px 18px rgba(62, 32, 28, 0.06)',
    md: '0 10px 24px rgba(62, 32, 28, 0.1)',
  },
});
