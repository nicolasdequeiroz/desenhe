import {useEffect, useRef, useState} from 'react';
import {NavLink, useLocation} from 'react-router-dom';
import {CaretDown} from '@phosphor-icons/react';
import {COURSES} from '../data';

export function NavCoursesDropdown() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const {pathname} = useLocation();
  const isActive = pathname === '/cursos' || pathname.startsWith('/cursos/');

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    const onClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('click', onClick);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={`site-nav-dropdown${open ? ' is-open' : ''}${isActive ? ' is-active' : ''}`}
    >
      <button
        type="button"
        className="site-nav-dropdown__trigger"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls="nav-courses-menu"
        onClick={(event) => {
          event.stopPropagation();
          setOpen((value) => !value);
        }}
      >
        Cursos
        <CaretDown
          className="site-nav-dropdown__chevron"
          size={12}
          weight="bold"
          aria-hidden="true"
        />
      </button>
      <div
        id="nav-courses-menu"
        className="site-nav-dropdown__menu"
        role="menu"
        aria-label="Cursos"
      >
        <NavLink
          to="/cursos"
          className="site-nav-dropdown__item site-nav-dropdown__item--all"
          role="menuitem"
        >
          Todos os cursos
        </NavLink>
        {COURSES.map((course) => (
          <NavLink
            key={course.slug}
            to={`/cursos/${course.slug}`}
            className="site-nav-dropdown__item"
            role="menuitem"
          >
            {course.shortTitle}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
