import { Navigate, createBrowserRouter } from 'react-router-dom';

import { MainLayout } from '@/layouts/main-layout/main-layout';
import { CodePage } from '@/pages/code-page/code-page';
import { DocumentPage } from '@/pages/document-page/document-page';
import { HomePage } from '@/pages/home-page/home-page';
import { LoanPage } from '@/pages/loan-page/loan-page';
import { NotFoundPage } from '@/pages/not-found-page/not-found-page';
import { ScoringPage } from '@/pages/scoring-page/scoring-page';
import { SignPage } from '@/pages/sign-page/sign-page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'loan',
        element: <LoanPage />,
      },
      {
        path: 'loan/:applicationId',
        element: <ScoringPage />,
      },
      {
        path: 'loan/:applicationId/document',
        element: <DocumentPage />,
      },
      {
        path: 'loan/:applicationId/document/sign',
        element: <SignPage />,
      },
      {
        path: 'loan/:applicationId/code',
        element: <CodePage />,
      },
      {
        path: 'not-found',
        element: <NotFoundPage />,
      },
      {
        path: '*',
        element: <Navigate to="/not-found" replace />,
      },
    ],
  },
]);
