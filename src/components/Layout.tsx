import { Box } from '@mui/material';
import { Outlet, useMatch } from 'react-router';
import Navbar from './Navbar';

export default function Layout() {
  const isFavourites = Boolean(useMatch('/favourites'));
  const isProfile = Boolean(useMatch('/user/:handle'));

  const variant = isFavourites ? 'favourites' : isProfile ? 'profile' : 'search';

  return (
    <Box sx={{ minHeight: '100vh', width: '100%' }}>
      <Navbar variant={variant} />
      <Box
        component="main"
        sx={{
          width: '100%',
          px: 3,
          py: 4,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
