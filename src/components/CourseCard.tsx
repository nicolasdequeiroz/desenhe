import {Link} from 'react-router-dom';
import {Badge} from '@astryxdesign/core/Badge';
import {Text} from '@astryxdesign/core/Text';
import {asset, type Course} from '../data';

export function CourseCard({course}: {course: Course}) {
  return (
    <Link to={`/cursos/${course.slug}`} className="course-card">
      <img
        src={asset(course.cover)}
        alt={`Curso de ${course.shortTitle} na Desenhe`}
        loading="lazy"
      />
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
