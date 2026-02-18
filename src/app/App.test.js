import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

jest.mock('../features/ConcertGrid/ConcertGrid', () => () => <div>Grid</div>);
jest.mock('../features/ConcertHistory/ConcertHistory', () => () => <div>History</div>);
jest.mock('../features/MostRecentTrack/MostRecentTrack', () => () => <div>Track</div>);
jest.mock('../features/ResponsiveHeader/ResponsiveHeader', () => () => (
  <div>Header</div>
));

describe('App', () => {
  test('renders tab labels', () => {
    render(
      <MemoryRouter initialEntries={['/upcoming']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole('tab', { name: /upcoming/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /history/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /now playing/i })).toBeInTheDocument();
  });

  test('selects tab based on route', () => {
    render(
      <MemoryRouter initialEntries={['/history']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole('tab', { name: /history/i })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });
});
