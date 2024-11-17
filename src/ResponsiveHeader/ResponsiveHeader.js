import { Box } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import desktopLogo from '../assets/cals_concert_calendar_lettering.svg';
import mobileLogo from '../assets/cals_concert_calendar_lettering_mobile.svg';

function ResponsiveHeader() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <Box 
        sx={(theme) => ({
        display: 'flex',
        justifyContent: 'center',
        padding: '2rem'
        })}
    >
      <img 
        src={isMobile ? mobileLogo : desktopLogo}
        alt="Concert Calendar"
        style={{
          width: '100%',
          maxWidth: isMobile ? '350px' : '900px'
        }}
      />
    </Box>
  );
}

export default ResponsiveHeader;