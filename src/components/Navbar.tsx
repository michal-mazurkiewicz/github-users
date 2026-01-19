import { Box, IconButton, InputBase, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useMatch, useNavigate, useParams } from 'react-router';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { searchUsers, selectRateLimitResetAt } from '../store/slices/users';
import { useGoBack } from '../hooks/useGoBack';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { handle } = useParams();
  const rateLimitResetAt = useAppSelector(selectRateLimitResetAt);
  const isFavourites = Boolean(useMatch('/favourites'));
  const isProfile = Boolean(useMatch('/user/:handle'));

  const [query, setQuery] = useState(useAppSelector(state => state.users.query) || '');
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const isVariant = isFavourites || isProfile;
  const title = isFavourites ? 'Favourites' : `@${handle}`;
  const goBack = useGoBack();

  useEffect(() => {
    const trimmed = query.trim();
    const timeout = setTimeout(() => {
      setDebouncedQuery(trimmed);
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.length < 3) {
      return;
    }
    if (rateLimitResetAt && Math.floor(Date.now() / 1000) < rateLimitResetAt) {
      return;
    }

    const searchUsersByQuery = async () => {
      try {
        await dispatch(searchUsers({ query: debouncedQuery, page: 1 }));
      } catch (error) {
        console.error('Error searching users:', error);
      }
    };

    searchUsersByQuery();
  }, [debouncedQuery]);

  return (
    <Box
      component="nav"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        height: 64,
        px: 3,
        backgroundColor: '#fff',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.06)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
      }}
    >
      {isVariant ? (
        <>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              width: '100%',
              maxWidth: 520,
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton aria-label="Back" size="small" onClick={() => goBack()}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" sx={{ letterSpacing: '-0.02em' }}>
                {title}
              </Typography>
            </Box>
            <IconButton aria-label="Favourites" component={Link} to="/favourites" size="small">
              {isFavourites ? <StarIcon sx={{ color: '#f4b400' }} /> : <StarBorderIcon />}
            </IconButton>
          </Box>
        </>
      ) : (
        <>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flex: 1,
              justifyContent: 'center',
              maxWidth: 520,
            }}
          >
            <SearchIcon sx={{ color: 'rgba(0, 0, 0, 0.6)' }} />
            <InputBase
              placeholder="Search for Github users...."
              inputProps={{ 'aria-label': 'Search for Github users' }}
              value={query ?? ''}
              onChange={event => setQuery(event.target.value)}
              sx={{
                flex: 1,
                color: 'inherit',
                '& input': {
                  p: 0,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                },
              }}
            />
            <IconButton aria-label="Favourites" component={Link} to="/favourites" size="small">
              <StarBorderIcon />
            </IconButton>
          </Box>
        </>
      )}
    </Box>
  );
}
