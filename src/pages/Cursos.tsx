import {Seo} from '../components/Seo';
import {Section} from '../components/Section';
import {CourseCard} from '../components/CourseCard';
import {WhatsCta} from '../components/WhatsCta';
import {COURSES} from '../data';

export function Cursos() {
  return (
    <>
      <Seo
        title="Cursos de desenho e pintura"
        description="Cursos de desenho artístico, quadrinhos, pintura a óleo e acrílica, aquarela e guache, desenho infantil e história da arte em Curitiba. Matrículas abertas o ano todo."
        path="/cursos"
      />
      <Section
        kicker="Cursos"
        title="Encontre o seu caminho na arte"
        lead="Turmas de no máximo 8 alunos, cronogramas personalizados e matrículas abertas o ano inteiro — presencial ou online ao vivo."
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
    </>
  );
}
