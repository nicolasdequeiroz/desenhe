import {Link} from 'react-router-dom';
import {Text} from '@astryxdesign/core/Text';
import {SITE, asset, whatsappLink} from '../data/site';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div>
          <Link to="/" className="site-header__brand">
            <img
              src={asset('/images/brand/logo.svg')}
              alt="Desenhe — Escola de Arte"
            />
          </Link>
          <div style={{marginTop: 12, maxWidth: 380}}>
            <Text type="supporting">
              Há 38 anos ensinando desenho e pintura em Curitiba, com turmas
              pequenas e ensino individualizado para todas as idades.
            </Text>
          </div>
        </div>

        <div>
          <h3>Visite-nos</h3>
          <ul>
            <li>
              <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer">
                {SITE.address.street}
                <br />
                {SITE.address.neighborhood}, {SITE.address.city}/
                {SITE.address.state}
              </a>
            </li>
            <li>
              <a
                href={whatsappLink('Olá! Vim pelo site da Desenhe.')}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp {SITE.whatsappDisplay}
              </a>
            </li>
            <li>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </li>
            <li>
              <a href={SITE.facebook} target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3>Navegue</h3>
          <ul>
            <li>
              <Link to="/cursos">Cursos</Link>
            </li>
            <li>
              <Link to="/horarios">Horários</Link>
            </li>
            <li>
              <Link to="/precos">Preços</Link>
            </li>
            <li>
              <Link to="/professores">Professores</Link>
            </li>
            <li>
              <Link to="/colonia-de-ferias">Colônia de Férias</Link>
            </li>
            <li>
              <Link to="/sobre">Sobre a escola</Link>
            </li>
          </ul>
        </div>
      </div>
      <div
        className="container"
        style={{marginTop: 40, paddingTop: 16, borderTop: '1px solid var(--color-border)'}}
      >
        <Text type="supporting">
          © {new Date().getFullYear()} Desenhe — Escola de Arte. Todos os
          direitos reservados.
        </Text>
      </div>
    </footer>
  );
}
