import { List, type ListImperativeAPI } from 'react-window';
import { Box, Paper, Typography } from '@mui/material';
import type { User } from '../types/users';
import { useRef } from 'react';
import { UserRow } from './UserRow';

type UserListProps = {
  users: User[];
};

export default function FavouriteList({ users }: UserListProps) {
  const listRef = useRef<ListImperativeAPI>(null);

  if (users.length === 0) {
    return (
      <Box sx={{ px: 3, py: 6, textAlign: 'center' }}>
        <Typography color="text.secondary">You don't have any favourite users yet 😊</Typography>
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
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <List rowCount={users.length} rowHeight={88} rowComponent={UserRow} rowProps={{ users }} overscanCount={5} listRef={listRef} />
        </Box>
      </Paper>
    </>
  );
}
