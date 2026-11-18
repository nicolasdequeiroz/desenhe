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
import {InCompany} from './pages/InCompany';
import {InCompanyFormato} from './pages/InCompanyFormato';
import {Sobre} from './pages/Sobre';
import {Contato} from './pages/Contato';
import {Blog} from './pages/Blog';
import {BlogPost} from './pages/BlogPost';
import {CentralDaMarca} from './pages/CentralDaMarca';
import {Componentes} from './pages/Componentes';
import {NotFound} from './pages/NotFound';
import {Redirect} from './components/Redirect';
import {BLOG_POSTS, COURSES, IN_COMPANY_FORMATS} from './data';

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
  // In Company: URLs de 16 a 23/10/2026, trocadas pelas com a palavra buscada.
  ['in-company/criatividade-para-resolver-problemas', '/in-company/palestra-criatividade'],
  ['in-company/pausa-de-descompressao', '/in-company/acao-saude-mental'],
  ['in-company/retratos-em-dupla', '/in-company/dinamica-confraternizacao'],
  ['in-company/oficina-sob-medida', '/in-company/workshop-arte-empresas'],
  // Posts do blog do Wix que foram migrados: cada post declara a URL antiga
  // no campo `legacyPath` do próprio arquivo (content/blog/*.md).
  ...BLOG_POSTS.filter((post) => post.legacyPath).map(
    (post): [string, string] => [post.legacyPath!, `/blog/${post.slug}`],
  ),
];

/**
 * Famílias de URL do Wix sem equivalente aqui (posts não migrados, categorias
 * e tags do blog, páginas de evento). São rotas coringa: não geram HTML próprio, o redirect
 * acontece pelo 404.html que o GitHub Pages serve como fallback.
 */
const LEGACY_WILDCARDS: [string, string][] = [
  ['post/*', '/blog'],
  ['blog/categories/*', '/blog'],
  ['blog/tags/*', '/blog'],
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
      {path: 'in-company', element: <InCompany />},
      // Uma página por formato In Company, cada uma com HTML próprio, como nos cursos.
      ...IN_COMPANY_FORMATS.filter((format) => format.page).map((format) => ({
        path: `in-company/${format.slug}`,
        element: <InCompanyFormato slug={format.slug} />,
      })),
      {path: 'sobre', element: <Sobre />},
      {path: 'contato', element: <Contato />},
      {path: 'blog', element: <Blog />},
      // Um HTML por post, como nos cursos (ver src/data/blog.ts).
      ...BLOG_POSTS.map((post) => ({
        path: `blog/${post.slug}`,
        element: <BlogPost slug={post.slug} />,
      })),
      {path: 'central-da-marca', element: <CentralDaMarca />},
      // Inventário interno de componentes: fora do menu, do sitemap e do Google.
      {path: 'componentes', element: <Componentes />},
      ...[...LEGACY_REDIRECTS, ...LEGACY_WILDCARDS].map(([from, to]) => ({
        path: from,
        element: <Redirect to={to} />,
      })),
      {path: '*', element: <NotFound />},
    ],
  },
];
