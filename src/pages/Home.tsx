import {Link} from 'react-router-dom';
import {Button} from '@astryxdesign/core/Button';
import {Text} from '@astryxdesign/core/Text';
import {Blockquote} from '@astryxdesign/core/Blockquote';
import {Seo} from '../components/Seo';
import {Section} from '../components/Section';
import {CourseCard} from '../components/CourseCard';
import {WhatsCta} from '../components/WhatsCta';
import {COURSES, asset} from '../data';

const FEATURED_SLUGS = [
  'desenho-artistico',
  'pintura-a-oleo-ou-acrilica',
  'quadrinhos-hq-manga-cartoon',
];

const ESPACO = [
  {src: '/images/espaco/atelie-galeria.webp', alt: 'Galeria de arte da escola'},
  {src: '/images/espaco/sala-01-mesas.webp', alt: 'Ateliê 01 com mesas de desenho'},
  {src: '/images/espaco/biblioteca.webp', alt: 'Biblioteca de arte da escola'},
  {src: '/images/espaco/sala-02.webp', alt: 'Ateliê 02'},
];

export function Home() {
  const featured = COURSES.filter((c) => FEATURED_SLUGS.includes(c.slug));

  return (
    <>
      <Seo path="/" />

      <div className="hero">
        <div className="container hero__grid">
          <div>
            <span className="section__kicker">
              Escola de arte em Curitiba · desde 1988
            </span>
            <h1>
              Aprenda a <em>desenhar</em> e <em>pintar</em> de verdade
            </h1>
            <div style={{marginTop: 16, maxWidth: 520}}>
              <Text type="large" color="secondary">
                Técnica e desenvolvimento criativo são as bases da arte de alto
                nível. Turmas de no máximo 8 alunos, ensino individualizado e
                38 anos de experiência — para todas as idades.
              </Text>
            </div>
            <div style={{display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap'}}>
              <WhatsCta
                message="Olá! Quero agendar uma aula experimental na Desenhe."
                label="Agendar aula experimental"
                size="lg"
              />
              <Button label="Ver cursos" href="/cursos" variant="secondary" size="lg" />
            </div>
          </div>
          <div className="hero__collage">
            <img
              src={asset('/images/trabalhos/koi.webp')}
              alt="Carpa koi em lápis de cor, trabalho de aluno da Desenhe"
            />
            <img
              src={asset('/images/cursos/pintura-oleo-acrilica/galeria-1.webp')}
              alt="Estudo de pintura de olho feito por aluno"
            />
          </div>
        </div>
      </div>

      <Section
        kicker="Cursos em destaque"
        title="Do primeiro traço ao trabalho autoral"
        lead="Todos os cursos têm matrículas abertas o ano inteiro e acompanham o nível e o ritmo de cada aluno."
        actions={<Button label="Todos os cursos" href="/cursos" variant="ghost" />}
      >
        <div className="course-grid">
          {featured.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      </Section>

      <Section
        kicker="Colônia de férias · inverno 2026"
        title="Cinco dias de muita arte para a criançada"
        lead="De 13 a 17 de julho, para crianças de 6 a 12 anos. Desenho à mão livre, guache, lápis de cor e colagem — materiais e lanche inclusos."
        muted
        actions={
          <Button
            label="Saiba mais"
            href="/colonia-de-ferias"
            variant="primary"
          />
        }
      >
        <img
          className="img-round"
          src={asset('/images/colonia/atividade.webp')}
          alt="Crianças pintando na colônia de férias da Desenhe"
          style={{width: '100%', maxHeight: 420, objectFit: 'cover'}}
          loading="lazy"
        />
      </Section>

      <Section
        kicker="Nosso espaço"
        title="Um ateliê feito para criar"
        lead="Salas de aula amplas, galeria de exposições, biblioteca de arte e um cafezinho para os intervalos."
        actions={<Button label="Conheça a escola" href="/sobre" variant="ghost" />}
      >
        <div className="masonry">
          {ESPACO.map((img) => (
            <img key={img.src} src={asset(img.src)} alt={img.alt} loading="lazy" />
          ))}
        </div>
      </Section>

      <Section muted>
        <div style={{maxWidth: 720, marginInline: 'auto'}} className="text-center">
          <Blockquote>
            Procuramos alunos apaixonados por arte, curiosos e dispostos a
            compartilhar experiências para avançar no domínio da própria
            expressão artística.
          </Blockquote>
          <div style={{marginTop: 24, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap'}}>
            <WhatsCta
              message="Olá! Quero conhecer a Desenhe e saber mais sobre os cursos."
              label="Fale com a gente"
            />
            <Link to="/precos" style={{alignSelf: 'center'}}>
              <Text color="accent" weight="semibold">
                Ver planos e preços →
              </Text>
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
