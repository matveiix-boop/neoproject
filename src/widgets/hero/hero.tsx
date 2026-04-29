import { Container } from '@/shared/ui/container/container';
import { heroCards } from '@/shared/data/content';

import './hero.scss';

export const Hero = () => {
  return (
    <section className="hero" id="hero">
      <Container className="hero__container">
        <div className="hero__content">
          <h1 className="hero__title">Choose the design you like and apply for card right now</h1>
          <a className="button button--primary hero__button" href="/loan">
            Choose the card
          </a>
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
