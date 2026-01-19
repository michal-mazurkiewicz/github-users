import { Typography } from '@mui/material';
import { useParams } from 'react-router';
import { RouteLoader } from '../components/RouteLoader';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUserByHandle, selectUser } from '../store/slices/users';
import UserCard from '../components/UserCard';
import { useEffect } from 'react';

export const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const { handle } = useParams();
  const user = useAppSelector(selectUser);
  const isLoading = useAppSelector(state => state.users.userStatus === 'loading');

  useEffect(() => {
    const init = async () => {
      if (!handle) return;
      await dispatch(fetchUserByHandle(handle));
    };
    init();
  }, []);

  if (isLoading) {
    return <RouteLoader />;
  }

  if (!user) {
    return <Typography>User not found</Typography>;
  }

  return <UserCard user={user} />;
};
