import { metrics } from '@/shared/data/content';
import { Container } from '@/shared/ui/container/container';

import './metrics.scss';

export const Metrics = () => {
  return (
    <section className="metrics" aria-label="Ключевые показатели">
      <Container>
        <ul className="metrics__list">
          {metrics.map((metric) => (
            <li className="metrics__item" key={metric.label}>
              <strong className="metrics__value">{metric.value}</strong>
              <span className="metrics__label">{metric.label}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
};
