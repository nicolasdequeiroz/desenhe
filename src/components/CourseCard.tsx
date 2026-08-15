import {Link} from 'react-router-dom';
import {Badge, Text} from '../ui';
import {asset, COURSE_CATEGORY_LABELS, type Course} from '../data';

export function CourseCard({course}: {course: Course}) {
  return (
    <Link to={`/cursos/${course.slug}`} className="course-card">
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
        <span className="course-card__age-badge">
          <Badge label={course.ageBadge} />
        </span>
      </div>
      <div className="course-card__body">
        <h3 className="course-card__title">{course.shortTitle}</h3>
        <Text type="body" color="secondary">
          {course.excerpt}
        </Text>
        <span className="course-card__cta">
          Conhecer o curso <span className="course-card__cta-arrow">→</span>
        </span>
      </div>
    </Link>
  );
}
