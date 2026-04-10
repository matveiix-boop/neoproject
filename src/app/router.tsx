import { createBrowserRouter } from 'react-router-dom';

import { MainLayout } from '@/layouts/main-layout/main-layout';
import { HomePage } from '@/pages/home-page/home-page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
]);
