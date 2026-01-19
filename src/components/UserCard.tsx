import { Avatar, Box, IconButton, Typography } from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectIsFavourite, toggleFavourite } from '../store/slices/users';

interface Props {
  user?: any;
}

export default function UserCard({ user }: Props) {
  const dispatch = useAppDispatch();
  const isFavourite = useAppSelector(selectIsFavourite(user?.login));

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 900,
        borderRadius: 3,
        backgroundColor: '#fff',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
        p: 2,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        gap: 4,
        position: 'relative',
      }}
    >
      <IconButton
        aria-label="Star user"
        sx={{ position: 'absolute', top: { xs: 5, md: 20 }, right: { xs: 5, md: 20 } }}
        onClick={() => dispatch(toggleFavourite(user))}
      >
        {isFavourite ? <StarIcon sx={{ fontSize: 30, color: '#f4b400' }} /> : <StarBorderIcon sx={{ fontSize: 30, color: 'rgba(0, 0, 0, 0.55)' }} />}
      </IconButton>
      <Box
        sx={{
          width: 220,
          minWidth: 220,
          borderRadius: 4,
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Avatar src={user.avatar_url} alt={user.name ?? user.login} sx={{ width: 180, height: 180, borderRadius: 4 }} />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' }, textAlign: { xs: 'center', md: 'left' } }}>
        <Typography sx={{ fontSize: 36, fontWeight: 500, letterSpacing: '-0.02em' }}>{user.name ?? user.login}</Typography>
        <Typography
          sx={{
            fontSize: 20,
            color: '#1e88e5',
            fontWeight: 500,
            mt: 0.5,
          }}
        >
          @{user.login}
        </Typography>
        {user.bio && <Typography sx={{ color: 'rgba(0, 0, 0, 0.5)', mt: 1.5 }}>{user.bio}</Typography>}
        <Box sx={{ display: 'flex', gap: 6, mt: 5, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
          <Box>
            <Typography sx={{ fontSize: 36, fontWeight: 500 }}>{user.followers ?? 0}</Typography>
            <Typography
              sx={{
                fontSize: 12,
                letterSpacing: '0.12em',
                color: 'rgba(0, 0, 0, 0.45)',
                mt: 0.5,
              }}
            >
              FOLLOWERS
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 36, fontWeight: 500 }}>{user.following * 100000}</Typography>
            <Typography
              sx={{
                fontSize: 12,
                letterSpacing: '0.12em',
                color: 'rgba(0, 0, 0, 0.45)',
                mt: 0.5,
              }}
            >
              FOLLOWING
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 36, fontWeight: 500 }}>{user.public_repos ?? 0}</Typography>
            <Typography
              sx={{
                fontSize: 12,
                letterSpacing: '0.12em',
                color: 'rgba(0, 0, 0, 0.45)',
                mt: 0.5,
              }}
            >
              REPOS
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
