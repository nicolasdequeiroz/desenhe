import {Link} from 'react-router-dom';
import {Text} from '../ui';
import {asset, COURSE_CATEGORY_LABELS, type Course} from '../data';

export function CourseCard({
  course,
  fullTitle = false,
}: {
  course: Course;
  /** Usa o título completo (só na listagem /cursos); na home e nos
   *  relacionados fica o nome curto. */
  fullTitle?: boolean;
}) {
  return (
    <Link to={`/cursos/${course.slug}`} className="course-card">
      {/*
        Polaroid: moldura de papel tortinha, mesma linguagem do baralho da
        primeira dobra e da parede de trabalhos na página do curso. O texto
        fica fora dela, direto sobre o fundo da página, e não dentro de um
        cartão retangular como antes.
      */}
      <div className="course-card__frame">
        <div className="course-card__cover">
          {course.cover ? (
            <img
              src={asset(course.cover)}
              alt={`Curso de ${course.shortTitle} na Desenhe`}
              loading="lazy"
            />
          ) : (
            // Curso novo, ainda sem fotos de trabalhos de alunos.
            <div
              className={`course-card__cover-placeholder category-tint--${course.category}`}
              aria-hidden="true"
            >
              <span>{course.shortTitle}</span>
            </div>
          )}
          <span className={`category-tag category-tag--${course.category}`}>
            {COURSE_CATEGORY_LABELS[course.category]}
          </span>
        </div>
      </div>
      <div className="course-card__body">
        <h3 className="course-card__title">
          {fullTitle ? course.title : course.shortTitle}
        </h3>
        <Text type="body" color="secondary">
          {course.excerpt}
        </Text>
        {/*
          Curso guarda-chuva: os nomes das linguagens reunidas no curso,
          para deixar claro na lista que não é tudo a mesma coisa.
        */}
        {course.strands && (
          <ul className="course-card__strands" aria-label="Modalidades deste curso">
            {course.strands.map((strand) => (
              <li key={strand.name} className="course-card__strand">
                {strand.name}
              </li>
            ))}
          </ul>
        )}
        {/* Só aparece no hover/foco: ver .course-card__cta no CSS. */}
        <span className="course-card__cta">
          Conhecer o curso <span className="course-card__cta-arrow">→</span>
        </span>
      </div>
    </Link>
  );
}
