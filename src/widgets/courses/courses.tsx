import { courseCards } from '@/shared/data/content';
import { Button } from '@/shared/ui/button/button';
import { Container } from '@/shared/ui/container/container';
import { SectionHeading } from '@/shared/ui/section-heading/section-heading';

import './courses.scss';

export const Courses = () => {
  return (
    <section className="courses" id="courses" aria-labelledby="courses-title">
      <Container>
        <SectionHeading
          eyebrow="Программы"
          title="Пример карточек, которые легко заменить на реальные блоки из макета"
          description="Контент вынесен в массивы данных, поэтому карточки и секции можно быстро синхронизировать с дизайном без переписывания логики."
        />

        <div className="courses__grid">
          {courseCards.map((course) => (
            <article className="course-card" key={course.title}>
              <span className="course-card__badge">{course.badge}</span>
              <h3 className="course-card__title">{course.title}</h3>
              <p className="course-card__description">{course.description}</p>
              <div className="course-card__footer">
                <span className="course-card__meta">{course.lessons}</span>
                <Button variant="secondary">Подробнее</Button>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
};
