import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { router } from '@/app/router';
import { ApplicationStoreProvider } from '@/entities/application/model/application-store';
import '@/app/styles/index.scss';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ApplicationStoreProvider>
      <RouterProvider router={router} />
    </ApplicationStoreProvider>
  </React.StrictMode>,
);
