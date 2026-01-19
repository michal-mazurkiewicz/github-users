import { Box, CircularProgress } from '@mui/material';

export const RouteLoader = () => {
  return (
    <Box className="text-center" justifyContent={'center'} alignItems={'center'} sx={{ height: '100vh' }}>
      <CircularProgress color="primary" />
    </Box>
  );
};
