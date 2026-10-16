import {useEffect, useRef, useState} from 'react';
import {NavLink, useLocation} from 'react-router-dom';
import {CaretDown} from '@phosphor-icons/react';

export interface NavDropdownItem {
  to: string;
  label: string;
  /**
   * Subpáginas do item. Com elas, o item vira o título de um grupo (ainda
   * clicável) e as subpáginas aparecem recuadas logo abaixo, no mesmo menu:
   * nada de submenu abrindo ao lado, que exige mira e não funciona no toque.
   */
  children?: NavDropdownItem[];
}

interface Props {
  /** Texto do botão que abre o menu. */
  label: string;
  /** Id do painel, para o `aria-controls` do botão. */
  id: string;
  items: NavDropdownItem[];
  /** Primeiro item em destaque, separado dos demais (ex.: "Todos os cursos"). */
  allItem?: NavDropdownItem;
}

/**
 * Item da navegação desktop que abre um menu suspenso (Cursos, Serviços).
 * Fecha ao navegar, com Escape e com clique fora. O botão fica marcado como
 * ativo quando a página atual é um dos itens do menu (ou uma subpágina dele).
 */
export function NavDropdown({label, id, items, allItem}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const {pathname} = useLocation();
  const isActive = [allItem, ...items, ...items.flatMap((item) => item.children ?? [])].some(
    (item) => item && (pathname === item.to || pathname.startsWith(`${item.to}/`)),
  );

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
        aria-controls={id}
        onClick={(event) => {
          event.stopPropagation();
          setOpen((value) => !value);
        }}
      >
        {label}
        <CaretDown
          className="site-nav-dropdown__chevron"
          size={12}
          weight="bold"
          aria-hidden="true"
        />
      </button>
      <div id={id} className="site-nav-dropdown__menu" role="menu" aria-label={label}>
        {allItem && (
          <NavLink
            to={allItem.to}
            className="site-nav-dropdown__item site-nav-dropdown__item--all"
            role="menuitem"
          >
            {allItem.label}
          </NavLink>
        )}
        {items.map((item) =>
          item.children ? (
            <div key={item.to} className="site-nav-dropdown__group" role="group" aria-label={item.label}>
              <NavLink
                to={item.to}
                end
                className="site-nav-dropdown__item site-nav-dropdown__item--group"
                role="menuitem"
              >
                {item.label}
              </NavLink>
              {item.children.map((child) => (
                <NavLink
                  key={child.to}
                  to={child.to}
                  className="site-nav-dropdown__item site-nav-dropdown__item--sub"
                  role="menuitem"
                >
                  {child.label}
                </NavLink>
              ))}
            </div>
          ) : (
            <NavLink key={item.to} to={item.to} className="site-nav-dropdown__item" role="menuitem">
              {item.label}
            </NavLink>
          ),
        )}
      </div>
    </div>
  );
}
