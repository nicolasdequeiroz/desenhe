import {Heading, Text} from '../ui';
import {Seo} from '../components/Seo';
import {Section} from '../components/Section';
import {CourseCard} from '../components/CourseCard';
import {WhatsCta} from '../components/WhatsCta';
import {COURSES} from '../data';

const PROPOSTA = [
  {
    title: 'Um plano de estudos sob medida',
    text: 'Cada matrícula parte de uma conversa sobre o seu nível, seus interesses e onde você quer chegar. O conteúdo e o ritmo das aulas são ajustados a essa trajetória: você não entra numa turma padrão, entra num plano pensado para o seu momento como artista.',
  },
  {
    title: 'Formação, não só passatempo',
    text: 'As aulas são leves e o processo é prazeroso, mas o compromisso por trás delas é sério: desenvolver técnica, repertório e critério próprio. O objetivo é formar artistas capazes de evoluir sozinhos, não só preencher uma tarde livre.',
  },
  {
    title: 'Orientação de quem vive de arte',
    text: 'Você é acompanhado por artistas-professores que fazem uma leitura crítica do seu trabalho a cada encontro, com o rigor de quem ensina profissionalmente e a experiência de quem produz arte fora da sala de aula.',
  },
];

export function Cursos() {
  return (
    <>
      <Seo
        title="Cursos de desenho e pintura"
        description="Cursos de desenho artístico, quadrinhos, desenho de moda, pintura a óleo e acrílica, aquarela e guache, desenho infantil e história da arte em Curitiba. Matrículas abertas o ano todo."
        path="/cursos"
      />
      <Section
        kicker="Cursos"
        title="Encontre o seu caminho na arte"
        lead="Turmas de no máximo 8 alunos, cronogramas personalizados e matrículas abertas o ano inteiro: aulas presenciais em Curitiba."
      >
        <div className="course-grid">
          {COURSES.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
        <div style={{marginTop: 40}} className="text-center">
          <WhatsCta
            message="Olá! Estou em dúvida sobre qual curso da Desenhe combina comigo. Podem me ajudar?"
            label="Não sabe por onde começar? Fale conosco"
            variant="secondary"
          />
        </div>
      </Section>

      <section className="course-philosophy">
        <div className="container">
          <div className="course-philosophy__top">
            <Heading level={2} className="course-philosophy__heading">
              Você não está matriculando numa aula, está começando um plano de
              formação
            </Heading>
            <Text as="p" type="large" color="secondary" className="course-philosophy__lead">
              Por trás de cada curso da lista acima existe uma abordagem
              construída para o aluno que vai fazê-lo, não um conteúdo
              genérico repetido de turma em turma.
            </Text>
          </div>
          <div className="course-philosophy__body">
            <span className="course-philosophy__eyebrow">Como ensinamos</span>
            <div className="course-philosophy__grid">
              {PROPOSTA.map((item) => (
                <div className="course-philosophy__item" key={item.title}>
                  <Heading level={3}>{item.title}</Heading>
                  <Text color="secondary">{item.text}</Text>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
