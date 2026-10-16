import {NavDropdown} from './NavDropdown';
import {COURSES} from '../data';

const COURSE_ITEMS = COURSES.map((course) => ({
  to: `/cursos/${course.slug}`,
  label: course.shortTitle,
}));

/** Menu "Cursos" da navegação desktop: todos os cursos e um link por curso. */
export function NavCoursesDropdown() {
  return (
    <NavDropdown
      label="Cursos"
      id="nav-courses-menu"
      allItem={{to: '/cursos', label: 'Todos os cursos'}}
      items={COURSE_ITEMS}
    />
  );
}
