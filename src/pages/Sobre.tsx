import {Heading, Text} from '../ui';
import {Blockquote} from '../ui';
import {Seo} from '../components/Seo';
import {Section} from '../components/Section';
import {WhatsCta} from '../components/WhatsCta';
import {asset} from '../data';

const ESPACO = [
  {src: '/images/espaco/atelie-galeria.webp', alt: 'Galeria de exposições da escola'},
  {src: '/images/espaco/sala-01-mesas.webp', alt: 'Ateliê 01 com mesas de desenho'},
  {src: '/images/espaco/sala-01-parede.webp', alt: 'Parede de trabalhos do ateliê 01'},
  {src: '/images/espaco/sala-02.webp', alt: 'Ateliê 02'},
  {src: '/images/espaco/sala-03.webp', alt: 'Ateliê 03'},
  {src: '/images/espaco/biblioteca.webp', alt: 'Biblioteca de arte'},
  {src: '/images/espaco/cozinha.webp', alt: 'Cozinha e café da escola'},
];

export function Sobre() {
  return (
    <>
      <Seo
        title="Sobre a escola"
        description="A Desenhe ensina desenho e pintura em Curitiba desde 1988. Conheça a história da escola fundada por Oscar Pedroso, nossa filosofia de ensino e o nosso espaço."
        path="/sobre"
      />

      <div className="container course-hero">
        <div>
          <span className="section__eyebrow">Desde 1988</span>
          <Heading level={1}>38 anos formando artistas em Curitiba</Heading>
          <div className="prose" style={{marginTop: 20}}>
            <p>
              A Desenhe nasceu em 1988, fundada pelo professor e artista Oscar
              Pedroso — licenciado em Educação Artística pela FAP, com passagem
              pela Editora Abril e autor de manuais de desenho para o SENAC
              Paraná.
            </p>
            <p>
              Acreditamos que o ensino das técnicas do desenho artístico,
              aliado ao desenvolvimento criativo, são as bases da arte de alto
              nível. Por isso o ensino é individualizado: turmas de no máximo 8
              alunos, com cronogramas adaptados aos objetivos e ao ritmo de
              cada um.
            </p>
            <p>
              Hoje somos uma equipe de artistas-professores atendendo crianças,
              adolescentes e adultos — do primeiro traço ao trabalho autoral.
            </p>
          </div>
        </div>
        <img
          src={asset('/images/professores/oscar-pedroso.webp')}
          alt="Oscar Pedroso, fundador da Desenhe, trabalhando no ateliê"
        />
      </div>

      <Section muted>
        <div style={{maxWidth: 720, marginInline: 'auto'}} className="text-center">
          <Blockquote>
            Procuramos alunos apaixonados por arte, curiosos e dispostos a
            compartilhar experiências para avançar no domínio da própria
            expressão artística.
          </Blockquote>
        </div>
      </Section>

      <Section
        kicker="Nosso espaço"
        title="Ateliês, galeria e biblioteca"
        lead="Salas de aula equipadas, uma galeria para expor os trabalhos dos alunos, biblioteca de arte e um café para os intervalos — no bairro Mercês, em Curitiba."
      >
        <div className="masonry">
          {ESPACO.map((img) => (
            <img key={img.src} src={asset(img.src)} alt={img.alt} loading="lazy" />
          ))}
        </div>
        <div style={{marginTop: 32}} className="text-center">
          <WhatsCta
            message="Olá! Gostaria de agendar uma visita para conhecer a Desenhe."
            label="Agendar uma visita"
          />
        </div>
      </Section>

      <Section kicker="Nossa filosofia" title="Técnica e criatividade, juntas" muted>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 32,
          }}
        >
          <div>
            <Heading level={3}>Turmas pequenas</Heading>
            <div style={{marginTop: 8}}>
              <Text color="secondary">
                No máximo 8 alunos por turma, garantindo atenção individual em
                um ambiente acolhedor que incentiva a expressão de cada um.
              </Text>
            </div>
          </div>
          <div>
            <Heading level={3}>Ensino individualizado</Heading>
            <div style={{marginTop: 8}}>
              <Text color="secondary">
                Cronogramas adaptáveis e personalizados: o curso acompanha o
                nível e o ritmo de cada aluno, seja iniciante ou avançado.
              </Text>
            </div>
          </div>
          <div>
            <Heading level={3}>O ano todo</Heading>
            <div style={{marginTop: 8}}>
              <Text color="secondary">
                Matrículas abertas de janeiro a dezembro, com calendário
                adaptado para 4 semanas de aula por mês e recessos programados.
              </Text>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
