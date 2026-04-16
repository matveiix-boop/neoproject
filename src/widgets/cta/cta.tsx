import { Button } from '@/shared/ui/button/button';
import { Container } from '@/shared/ui/container/container';

import './cta.scss';

export const Cta = () => {
  return (
    <section className="cta" aria-labelledby="cta-title">
      <Container>
        <div className="cta__box">
          <div className="cta__content">
            <span className="cta__eyebrow">0</span>
            <h2 className="cta__title" id="cta-title">
              0
            </h2>
            <p className="cta__description">
              
            </p>
          </div>

          <div className="cta__actions">
            <Button>0</Button>
            <Button variant="secondary">0</Button>
          </div>
        </div>
      </Container>
    </section>
  );
};
