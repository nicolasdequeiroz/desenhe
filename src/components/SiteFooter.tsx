import {Link} from 'react-router-dom';
import {SITE, whatsappLink} from '../data/site';
import {Guestbook} from './Guestbook';

const EXPLORAR_LINKS = [
  {label: 'Cursos', to: '/cursos'},
  {label: 'Horários', to: '/horarios'},
  {label: 'Preços', to: '/precos'},
  {label: 'Sobre', to: '/sobre'},
] as const;

const CONTATO_LINKS = [
  {label: 'WhatsApp', href: whatsappLink('Olá! Vim pelo site da Desenhe.')},
  {label: 'Instagram', href: SITE.instagram},
  {label: 'Como chegar', href: SITE.mapsUrl},
] as const;

/** Footer — livro de visitas desenhado, no formato do site de referência. */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer__top">
        <div className="site-footer__intro">
          <span className="site-footer__badge">
            <span className="site-footer__badge-dot" aria-hidden="true" />
            Matrículas abertas
          </span>
          <h2 className="site-footer__headline">
            Antes de ir, deixe um desenho.
            <br />
            Toque no lápis para começar.
          </h2>
          <p className="site-footer__copyright">
            © {year} Desenhe — Escola de Arte · {SITE.address.street},{' '}
            {SITE.address.neighborhood}, {SITE.address.city}/{SITE.address.state}
          </p>
        </div>

        <div className="site-footer__nav-groups">
          <div className="site-footer__group">
            <p className="site-footer__group-title">(Explorar)</p>
            <nav className="site-footer__nav" aria-label="Explorar">
              {EXPLORAR_LINKS.map((item) => (
                <Link key={item.to} to={item.to} className="site-footer__link">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="site-footer__group">
            <p className="site-footer__group-title">(Contato)</p>
            <nav className="site-footer__nav" aria-label="Contato">
              {CONTATO_LINKS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="site-footer__link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.label} ↗
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <Guestbook />
    </footer>
  );
}
