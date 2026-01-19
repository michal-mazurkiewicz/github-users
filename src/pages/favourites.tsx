import FavoutiresList from '../components/FavouritesList';
import { useAppSelector } from '../store/hooks';
import { selectFavourites } from '../store/slices/users';

export const Favourites = () => {
  const users = useAppSelector(selectFavourites);
  return <FavoutiresList users={users} />;
};
