import { Button } from '@/shared/ui/button/button';
import { Container } from '@/shared/ui/container/container';

import './cta.scss';

export const Cta = () => {
  return (
    <section className="cta" aria-labelledby="cta-title">
      <Container>
        <div className="cta__box">
          <div className="cta__content">
            <span className="cta__eyebrow">Следующий шаг</span>
            <h2 className="cta__title" id="cta-title">
              Замените демо-контент на данные из Figma и получите готовую главную страницу.
            </h2>
            <p className="cta__description">
              В проекте нет блока «лента новостей», как и требуется в задании. Остальные секции можно
              детализировать после получения скриншотов или публичного доступа к макету.
            </p>
          </div>

          <div className="cta__actions">
            <Button>Открыть проект</Button>
            <Button variant="secondary">Посмотреть структуру</Button>
          </div>
        </div>
      </Container>
    </section>
  );
};
