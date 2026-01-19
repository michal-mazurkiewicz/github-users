import { Box } from '@mui/material';
import { Outlet } from 'react-router';
import Navbar from './Navbar';

export default function Layout() {
  
  return (
    <Box sx={{ minHeight: '100vh', width: '100%' }}>
      <Navbar />
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
