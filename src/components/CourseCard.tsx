import {Link} from 'react-router-dom';
import {Badge} from '../ui';
import {Text} from '../ui';
import {asset, COURSE_CATEGORY_LABELS, type Course} from '../data';

export function CourseCard({course}: {course: Course}) {
  return (
    <Link to={`/cursos/${course.slug}`} className="course-card">
      <div className="course-card__cover">
        <img
          src={asset(course.cover)}
          alt={`Curso de ${course.shortTitle} na Desenhe`}
          loading="lazy"
        />
        <span className={`category-tag category-tag--${course.category}`}>
          {COURSE_CATEGORY_LABELS[course.category]}
        </span>
      </div>
      <div className="course-card__body">
        <Badge label={course.audience} />
        <h3 className="course-card__title">{course.shortTitle}</h3>
        <Text type="body" color="secondary">
          {course.excerpt}
        </Text>
        <span className="course-card__cta">Conhecer o curso →</span>
      </div>
    </Link>
  );
}
