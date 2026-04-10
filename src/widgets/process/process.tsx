import { processSteps } from '@/shared/data/content';
import { Container } from '@/shared/ui/container/container';
import { SectionHeading } from '@/shared/ui/section-heading/section-heading';

import './process.scss';

export const Process = () => {
  return (
    <section className="process" id="about" aria-labelledby="process-title">
      <Container className="process__container">
        <div className="process__content">
          <SectionHeading
            eyebrow="Как это работает"
            title="Готовая семантическая основа для информационных блоков главной страницы"
            description="Вместо монолитной верстки используется деление на изолированные секции. Это делает код чище и облегчает ревью в Pull Request."
          />
        </div>

        <ol className="process__list">
          {processSteps.map((step, index) => (
            <li className="process__item" key={step}>
              <span className="process__index">0{index + 1}</span>
              <p className="process__text">{step}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
};
