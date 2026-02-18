import { Box } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import desktopLogo from './assets/cals_concert_calendar_lettering.svg';
import mobileLogo from './assets/cals_concert_calendar_lettering_mobile.svg';

function ResponsiveHeader() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <Box
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '1rem 1rem 1.5rem',
      }}
    >
      <img
        src={isMobile ? mobileLogo : desktopLogo}
        alt='Concert Calendar'
        style={{
          width: '100%',
          maxWidth: isMobile ? '350px' : '900px',
          maxHeight: '20vh',
        }}
      />
    </Box>
  );
}

export default ResponsiveHeader;
