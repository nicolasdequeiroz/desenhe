import {useEffect, useState} from 'react';
import {NavLink, Link, useLocation} from 'react-router-dom';
import {List, X} from '@phosphor-icons/react';
import {WhatsCta} from './WhatsCta';
import {NavCoursesDropdown} from './NavCoursesDropdown';
import {BrandLogo} from './BrandLogo';
import {FEATURED_PROMO} from '../data';

const HORARIOS_ITEM = {to: '/horarios', label: 'Horários'};
const PROFESSORES_ITEM = {to: '/professores', label: 'Professores'};
const PRECOS_ITEM = {to: '/precos', label: 'Preços'};
const SOBRE_ITEM = {to: '/sobre', label: 'Sobre'};
const CONTATO_ITEM = {to: '/contato', label: 'Contato'};

// A campanha em destaque (Colônia de Férias, Coworking, etc.) entra na nav
// como um link só enquanto `FEATURED_PROMO` não for `null` (ver src/data/promo.ts).
const PROMO_ITEM = FEATURED_PROMO
  ? {to: FEATURED_PROMO.path, label: FEATURED_PROMO.nav.label}
  : null;

const NAV_ITEMS = [
  HORARIOS_ITEM,
  PROFESSORES_ITEM,
  ...(PROMO_ITEM ? [PROMO_ITEM] : []),
];

/** Itens auxiliares (Preços, Sobre, Contato) agrupados perto das ações. */
const AUX_NAV_ITEMS = [PRECOS_ITEM, SOBRE_ITEM, CONTATO_ITEM];

/** Itens do menu mobile: mesma ordem lógica da nav + Cursos como link direto. */
const MOBILE_NAV_ITEMS = [
  {to: '/cursos', label: 'Cursos'},
  HORARIOS_ITEM,
  PRECOS_ITEM,
  PROFESSORES_ITEM,
  ...(PROMO_ITEM ? [PROMO_ITEM] : []),
  SOBRE_ITEM,
  CONTATO_ITEM,
];

export function SiteHeader() {
  const {pathname} = useLocation();
  // A home, o Sobre, os Preços e as páginas de curso deixam o header flutuar
  // por cima do conteúdo (transparente no topo, ganha fundo ao rolar), em vez
  // de empurrar tudo com uma faixa opaca.
  const overlay =
    pathname === '/' ||
    pathname === '/sobre' ||
    pathname === '/precos' ||
    /^\/cursos\/[^/]+$/.test(pathname);
  // /precos flutua como o Sobre, mas já entra com o fundo do estado rolado
  // (nada de transparência sobre o conteúdo antes do primeiro scroll).
  const alwaysScrolled = pathname === '/precos';
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Fecha o menu ao navegar para outra página.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Header transparente no topo; ganha fundo ao rolar a página.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fecha com Escape (padrão de disclosure acessível).
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  return (
    <header
      className={`site-header${overlay ? ' site-header--overlay' : ''}${scrolled || alwaysScrolled ? ' site-header--scrolled' : ''}${menuOpen ? ' is-menu-open' : ''}`}
    >
      <div className="container site-header__inner">
        <button
          type="button"
          className="site-header__toggle"
          aria-expanded={menuOpen}
          aria-controls="site-mobile-menu"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? (
            <X size={22} weight="bold" aria-hidden="true" />
          ) : (
            <List size={22} weight="bold" aria-hidden="true" />
          )}
        </button>
        <nav className="site-nav" aria-label="Navegação principal">
          <NavCoursesDropdown />
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <Link to="/" className="site-header__brand">
          <BrandLogo />
        </Link>
        <div className="site-header__right">
          <div className="site-header__actions">
            {AUX_NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} className="site-header__nav-link">
                {item.label}
              </NavLink>
            ))}
          </div>
          <WhatsCta
            message="Olá! Gostaria de mais informações sobre os cursos da Desenhe."
            label="Matricule-se"
            size="sm"
            className="site-header__cta"
          />
        </div>
      </div>

      <div
        id="site-mobile-menu"
        className={`site-menu${menuOpen ? ' is-open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <nav className="site-menu__nav" aria-label="Navegação principal (menu)">
          {MOBILE_NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} className="site-menu__link">
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="site-menu__cta">
          <WhatsCta
            message="Olá! Gostaria de mais informações sobre os cursos da Desenhe."
            label="Matricule-se"
          />
        </div>
      </div>
    </header>
  );
}
