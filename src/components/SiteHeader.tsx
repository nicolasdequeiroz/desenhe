import {NavLink, Link} from 'react-router-dom';
import {WhatsCta} from './WhatsCta';

const NAV_ITEMS = [
  {to: '/cursos', label: 'Cursos'},
  {to: '/horarios', label: 'Horários'},
  {to: '/precos', label: 'Preços'},
  {to: '/professores', label: 'Professores'},
  {to: '/colonia-de-ferias', label: 'Colônia de Férias'},
  {to: '/sobre', label: 'Sobre'},
  {to: '/contato', label: 'Contato'},
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="site-header__brand">
          DESENHE <em>escola de arte</em>
        </Link>
        <nav className="site-nav" aria-label="Navegação principal">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <WhatsCta
          message="Olá! Gostaria de mais informações sobre os cursos da Desenhe."
          label="Matricule-se"
          size="sm"
        />
      </div>
    </header>
  );
}
