import { Box, Avatar, Typography, IconButton, Divider } from '@mui/material';
import { Link } from 'react-router';
import type { RowComponentProps } from 'react-window';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectIsFavourite, toggleFavourite } from '../store/slices/users';
import type { User } from '../types/users';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';

type RowProps = {
  users: User[];
};

export const UserRow = ({ index, style, users, ariaAttributes }: RowComponentProps<RowProps>) => {
  const dispatch = useAppDispatch();
  const user = users[index];
  const isFavourite = useAppSelector(selectIsFavourite(user?.login));

  return (
    <Box style={style} {...ariaAttributes}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 2,
          height: 88,
        }}
      >
        <Avatar src={user?.avatar_url} alt={user?.login} sx={{ width: 56, height: 56, mr: 2 }} />
        <Typography
          component={Link}
          to={`/user/${user?.login}`}
          sx={{
            flex: 1,
            fontSize: 20,
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          @{user?.login}
        </Typography>
        <IconButton aria-label="Toggle star" onClick={() => dispatch(toggleFavourite(user))}>
          {isFavourite ? <StarIcon sx={{ color: '#f4b400' }} /> : <StarBorderIcon sx={{ color: 'rgba(0, 0, 0, 0.5)' }} />}
        </IconButton>
      </Box>
      <Divider />
    </Box>
  );
};
