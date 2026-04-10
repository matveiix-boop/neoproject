import { Container } from '@/shared/ui/container/container';
import { Button } from '@/shared/ui/button/button';
import { heroCards } from '@/shared/data/content';

import './hero.scss';

export const Hero = () => {
  return (
    <section className="hero" id="hero">
      <Container className="hero__container">
        <div className="hero__content">
          <h1 className="hero__title">Choose the design you like and apply for card right now</h1>
          <Button className="hero__button" type="button">
            Choose the card
          </Button>
        </div>

        <div className="hero__cards" aria-label="Card designs">
          {heroCards.map((card) => (
            <article className="hero__card" key={card.alt}>
              <img className="hero__card-image" src={card.image} alt={card.alt} />
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
};
