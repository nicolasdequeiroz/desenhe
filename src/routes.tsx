import type {RouteRecord} from 'vite-react-ssg';
import {RootLayout} from './components/RootLayout';
import {Home} from './pages/Home';
import {Cursos} from './pages/Cursos';
import {CursoDetalhe} from './pages/CursoDetalhe';
import {Professores} from './pages/Professores';
import {Precos} from './pages/Precos';
import {Horarios} from './pages/Horarios';
import {ColoniaDeFerias} from './pages/ColoniaDeFerias';
import {Sobre} from './pages/Sobre';
import {Contato} from './pages/Contato';
import {NotFound} from './pages/NotFound';
import {Redirect} from './components/Redirect';
import {COURSES} from './data';

/** URLs do site antigo (Wix) → destino no site novo. */
const LEGACY_REDIRECTS: [string, string][] = [
  ['pintura-a-oleo-ou-acrilica', '/cursos/pintura-a-oleo-ou-acrilica'],
  ['precos-mensalidades', '/precos'],
  ['cursos/para-alem-do-canone', '/cursos/historia-da-arte'],
  ['blog', '/'],
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
      {path: 'sobre', element: <Sobre />},
      {path: 'contato', element: <Contato />},
      ...LEGACY_REDIRECTS.map(([from, to]) => ({
        path: from,
        element: <Redirect to={to} />,
      })),
      {path: '*', element: <NotFound />},
    ],
  },
];
