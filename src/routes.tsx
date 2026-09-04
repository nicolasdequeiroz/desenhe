import type {RouteRecord} from 'vite-react-ssg';
import {RootLayout} from './components/RootLayout';
import {Home} from './pages/Home';
import {Cursos} from './pages/Cursos';
import {CursoDetalhe} from './pages/CursoDetalhe';
import {Professores} from './pages/Professores';
import {Precos} from './pages/Precos';
import {Horarios} from './pages/Horarios';
import {ColoniaDeFerias} from './pages/ColoniaDeFerias';
import {CoworkingArtistico} from './pages/CoworkingArtistico';
import {Sobre} from './pages/Sobre';
import {Contato} from './pages/Contato';
import {NotFound} from './pages/NotFound';
import {Redirect} from './components/Redirect';
import {COURSES} from './data';

/**
 * URLs do site antigo (Wix) → destino no site novo.
 *
 * A lista cobre todas as páginas do `pages-sitemap.xml` do Wix, para que
 * nenhum link indexado, impresso ou compartilhado caia em 404. Cada uma
 * vira um HTML pré-renderizado com `meta refresh` + canonical (ver
 * `Redirect`), que é o mais próximo de um 301 possível no GitHub Pages.
 */
const LEGACY_REDIRECTS: [string, string][] = [
  // Páginas que existiam no Wix e viraram outra rota aqui.
  ['pintura-a-oleo-ou-acrilica', '/cursos/pintura-a-oleo-ou-acrilica'],
  ['precos-mensalidades', '/precos'],
  ['cursos/para-alem-do-canone', '/cursos/historia-da-arte'],
  ['aula-1', '/cursos/desenho-artistico'],
  ['arte-botanica', '/cursos'],
  ['mentoria', '/cursos'],
  ['exposicoes', '/sobre'],
  ['inquiry-services-page', '/contato'],
  // Campanha encerrada (37% de desconto, válida até 30/06/2025).
  ['promo37anos', '/precos'],
  // Uma página por artista no Wix: a âncora abre a bio no modal.
  ['efigenio-pavei', '/professores#efigenio-pavei'],
  ['mateus-dukevicz', '/professores#mateus-dukevicz'],
  ['oscar-pedroso', '/professores#oscar-pedroso'],
  ['rafael-mesquita', '/professores#rafael-mesquita'],
  // Rennan Negrão expôs na galeria, mas não dá aula: vai para a lista.
  ['rennan-negrao', '/professores'],
  // Blog do Wix, descontinuado.
  ['blog', '/'],
  ['post/blog-desenhe-arte-desenhe-curitiba', '/'],
];

/**
 * Famílias de URL do Wix sem equivalente aqui (posts, categorias do blog e
 * páginas de evento). São rotas coringa: não geram HTML próprio, o redirect
 * acontece pelo 404.html que o GitHub Pages serve como fallback.
 */
const LEGACY_WILDCARDS: [string, string][] = [
  ['post/*', '/'],
  ['blog/categories/*', '/'],
  ['informa-es-do-evento-e-registro/*', '/sobre'],
];

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {index: true, element: <Home />},
      {path: 'cursos', element: <Cursos />},
      // Rotas estáticas explícitas por curso, para o pré-render gerar
      // um HTML por página (SEO) sem depender de getStaticPaths.
      ...COURSES.map((course) => ({
        path: `cursos/${course.slug}`,
        element: <CursoDetalhe slug={course.slug} />,
      })),
      {path: 'professores', element: <Professores />},
      {path: 'precos', element: <Precos />},
      {path: 'horarios', element: <Horarios />},
      {path: 'colonia-de-ferias', element: <ColoniaDeFerias />},
      {path: 'coworking-artistico', element: <CoworkingArtistico />},
      {path: 'sobre', element: <Sobre />},
      {path: 'contato', element: <Contato />},
      ...[...LEGACY_REDIRECTS, ...LEGACY_WILDCARDS].map(([from, to]) => ({
        path: from,
        element: <Redirect to={to} />,
      })),
      {path: '*', element: <NotFound />},
    ],
  },
];
