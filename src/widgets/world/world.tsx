import worldMapImage from '@/shared/assets/images/world-map.svg';
import { Container } from '@/shared/ui/container/container';

import './world.scss';

export const World = () => {
  return (
    <section className="world">
      <Container className="world__container">
        <header className="world__header">
          <h2 className="world__title">You can use our services anywhere in the world</h2>
          <p className="world__description">Withdraw and transfer money online through our application</p>
        </header>

        <img className="world__map" src={worldMapImage} alt="World map with bank coverage points" />
      </Container>
    </section>
  );
};
