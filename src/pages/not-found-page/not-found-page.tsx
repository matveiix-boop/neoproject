import { useNavigate } from 'react-router-dom';

import { Button } from '@/shared/ui/button/button';
import { Container } from '@/shared/ui/container/container';
import { Footer } from '@/widgets/footer/footer';
import { Header } from '@/widgets/header/header';

import './not-found-page.scss';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <main className="not-found-page">
        <Container>
          <div className="not-found-page__content">
            <div className="not-found-page__picture" aria-hidden="true">
              <span className="not-found-page__circle not-found-page__circle--large" />
              <span className="not-found-page__circle not-found-page__circle--small" />
              <span className="not-found-page__code">404</span>
            </div>
            <p className="not-found-page__eyebrow">Oops....</p>
            <h1 className="not-found-page__title">Page not found</h1>
            <p className="not-found-page__text">
              This Page doesn`t exist or was removed! We suggest you go back.
            </p>
            <Button className="not-found-page__button" type="button" onClick={() => navigate(-1)}>
              Go back
            </Button>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
};
