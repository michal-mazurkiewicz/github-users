import { List, type ListImperativeAPI } from 'react-window';
import { Box, Paper, Typography } from '@mui/material';

import type { User } from '../types/users';
import { useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { searchUsers, selectPaginationInfo, selectRateLimitResetAt } from '../store/slices/users';
import { RateLimitFooter } from './RateLimitFooter';
import { UserRow } from './UserRow';
import { usePullToRefresh } from '../hooks/usePullToRefresh';

type UserListProps = {
  users: User[];
};

export default function UserList({ users }: UserListProps) {
  const dispatch = useAppDispatch();
  const { page, has_more, query, total_count } = useAppSelector(selectPaginationInfo);
  const isLoading = useAppSelector(state => state.users.searchStatus === 'loading');
  const rateLimitResetAt = useAppSelector(selectRateLimitResetAt);
  const listRef = useRef<ListImperativeAPI>(null);

  const { pullDistance, isPulling, touchHandlers } = usePullToRefresh({
    isLoading,
    listRef,
    onRefresh: () => dispatch(searchUsers({ query, page: 1 })),
  });

  const handleLoadMore = ({ stopIndex }: { startIndex: number; stopIndex: number }) => {
    if (!has_more || isLoading) {
      return;
    }
    if (rateLimitResetAt && Math.floor(Date.now() / 1000) < rateLimitResetAt) {
      return;
    }

    const loadThreshold = 15;
    if (stopIndex >= users.length - 1 - loadThreshold) {
      dispatch(searchUsers({ query, page }));
    }
  };

  if (users.length === 0) {
    return (
      <Box sx={{ px: 3, py: 6, textAlign: 'center' }}>
        <Typography color="text.secondary">No search results.</Typography>
      </Box>
    );
  }

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: 900,
          maxHeight: '85vh',
          borderRadius: 3,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            left: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 24,
            opacity: Math.min(1, pullDistance / 60),
            pointerEvents: 'none',
            color: 'rgba(0, 0, 0, 0.6)',
            fontSize: 12,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            zIndex: 1,
          }}
        >
          {pullDistance >= 60 ? 'Release to refresh' : 'Pull to refresh'}
        </Box>
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <List
            className="no-scrollbars"
            rowCount={total_count || 0}
            rowHeight={88}
            rowComponent={UserRow}
            rowProps={{ users }}
            overscanCount={10}
            onRowsRendered={handleLoadMore}
            listRef={listRef}
            {...touchHandlers}
            style={{
              transform: `translateY(${pullDistance}px)`,
              transition: isPulling ? 'none' : 'transform 180ms ease-out',
              overflowY: 'auto',
            }}
          />
        </Box>
        {!has_more && (
          <Box
            sx={{
              borderTop: '1px solid rgba(0, 0, 0, 0.08)',
              px: 3,
              py: 2,
              textAlign: 'center',
            }}
          >
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>
              That’s everything we found 😊
            </Typography>
          </Box>
        )}
        <RateLimitFooter />
      </Paper>
    </>
  );
}
