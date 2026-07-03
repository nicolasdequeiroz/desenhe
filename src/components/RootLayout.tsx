import {forwardRef} from 'react';
import {Outlet, ScrollRestoration, Link as RouterLink} from 'react-router-dom';
import {Theme} from '@astryxdesign/core/theme';
import {LinkProvider} from '@astryxdesign/core/Link';
import {desenheTheme} from '../theme/desenhe';
import {SiteHeader} from './SiteHeader';
import {SiteFooter} from './SiteFooter';

/**
 * Adapta o Link do react-router para o contrato href/children que os
 * componentes Astryx (Link, Button com href) esperam. URLs externas
 * continuam em <a> normal.
 */
const RouterLinkAdapter = forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>(function RouterLinkAdapter({href = '', children, ...rest}, ref) {
  const isExternal = /^(https?:|mailto:|tel:)/.test(href);
  if (isExternal) {
    return (
      <a ref={ref} href={href} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <RouterLink ref={ref} to={href} {...rest}>
      {children}
    </RouterLink>
  );
});

export function RootLayout() {
  return (
    <Theme theme={desenheTheme}>
      <LinkProvider component={RouterLinkAdapter}>
        <SiteHeader />
        <main>
          <Outlet />
        </main>
        <SiteFooter />
        <ScrollRestoration />
      </LinkProvider>
    </Theme>
  );
}
