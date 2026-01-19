import { RouteLoader } from '../components/RouteLoader';
import UserList from '../components/UserList';
import { useAppSelector } from '../store/hooks';
import { selectUsers } from '../store/slices/users';

export const Dashboard = () => {
  const users = useAppSelector(selectUsers);
  const isLoading = useAppSelector(state => state.users.searchStatus === 'loading');

  if (isLoading && users.length === 0) {
    return <RouteLoader />;
  }

  return <UserList users={users} />;
};
