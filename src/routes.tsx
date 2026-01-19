import { createBrowserRouter } from 'react-router';
import { Dashboard } from './pages';
import { Favourites } from './pages/favourites';
import Layout from './components/Layout';
import { ProfilePage } from './pages/profile';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: 'favourites',
          element: <Favourites />,
        },
        {
          path: 'user/:handle',
          element: <ProfilePage />,
        },
      ],
    },
  ],
  {
    future: {
      //@ts-ignore
      v7_relativeSplatPath: true,
    },
  },
);

export default router;
