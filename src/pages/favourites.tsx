import FavouriteList from '../components/FavouriteList';
import { useAppSelector } from '../store/hooks';
import { selectFavourites } from '../store/slices/users';

export const Favourites = () => {
  const users = useAppSelector(selectFavourites);
  return <FavouriteList users={users} />;
};
