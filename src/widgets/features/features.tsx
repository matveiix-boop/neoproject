import illustrationImage from '@/shared/assets/images/illustration.png';
import { Container } from '@/shared/ui/container/container';
import { featureItems } from '@/shared/data/content';

import './features.scss';

export const Features = () => {
  return (
    <section className="features" id="features">
      <Container className="features__container">
        <div className="features__media">
          <img className="features__image" src={illustrationImage} alt="Bank application illustration" />
        </div>

        <div className="features__content">
          <h2 className="features__title">We Provide Many Features You Can Use</h2>
          <p className="features__description">
            You can explore the features that we provide with fun and have their own functions each feature
          </p>

          <ul className="features__list">
            {featureItems.map((item) => (
              <li className="features__item" key={item.label}>
                <img className="features__item-icon" src={item.icon} alt="" aria-hidden="true" />
                <span className="features__item-text">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
};
