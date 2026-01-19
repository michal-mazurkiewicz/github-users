import { Box, Typography, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { searchUsers, selectPaginationInfo, selectRateLimitResetAt } from '../store/slices/users';

export const RateLimitFooter = () => {
  const dispatch = useAppDispatch();
  const [nowSeconds, setNowSeconds] = useState(() => Math.floor(Date.now() / 1000));
  const rateLimitResetAt = useAppSelector(selectRateLimitResetAt);
  const { page, query, has_more } = useAppSelector(selectPaginationInfo);

  useEffect(() => {
    if (!rateLimitResetAt) {
      return;
    }

    setNowSeconds(Math.floor(Date.now() / 1000));
    const interval = window.setInterval(() => {
      setNowSeconds(Math.floor(Date.now() / 1000));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [rateLimitResetAt]);

  if (!rateLimitResetAt) {
    return null;
  }

  const rateLimitActive = nowSeconds < rateLimitResetAt;
  const waitSeconds = rateLimitActive ? rateLimitResetAt - nowSeconds : 0;
  const buttonDisabled = query.trim().length < 3 || !has_more;

  const formatWaitTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes === 0) {
      return `${remainingSeconds}s`;
    }
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <Box
      sx={{
        borderTop: '1px solid rgba(0, 0, 0, 0.08)',
        px: 3,
        py: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        backgroundColor: '#fff',
      }}
    >
      {rateLimitActive ? (
        <Typography color="text.secondary" sx={{ fontSize: 14 }}>
          Rate limit reached. Try again in {formatWaitTime(waitSeconds)}.
        </Typography>
      ) : (
        <Button variant="outlined" size="small" disabled={buttonDisabled} onClick={() => dispatch(searchUsers({ query, page }))}>
          Load more
        </Button>
      )}
    </Box>
  );
};
