import { faqItems } from '@/shared/data/content';
import { Container } from '@/shared/ui/container/container';
import { SectionHeading } from '@/shared/ui/section-heading/section-heading';

import './faq-preview.scss';

export const FaqPreview = () => {
  return (
    <section className="faq-preview" id="faq" aria-labelledby="faq-title">
      <Container>
        <SectionHeading
          eyebrow="FAQ"
          title=""
          description=""
        />

        <div className="faq-preview__list">
          {faqItems.map((item) => (
            <article className="faq-preview-card" key={item.question}>
              <h3 className="faq-preview-card__title">{item.question}</h3>
              <p className="faq-preview-card__description">{item.answer}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
};
