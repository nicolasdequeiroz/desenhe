import {Heading, Text} from '../ui';
import {Seo} from '../components/Seo';
import {Section} from '../components/Section';
import {TEACHERS, asset} from '../data';

export function Professores() {
  return (
    <>
      <Seo
        title="Professores"
        description="Conheça os professores da Desenhe: artistas visuais, ilustradores e pesquisadores com formação em belas artes, dedicados ao ensino individualizado de desenho e pintura."
        path="/professores"
      />
      <Section
        kicker="Equipe"
        title="Professores que vivem de arte"
        lead="Artistas visuais, ilustradores e pesquisadores — cada um com sua trajetória, todos dedicados a acompanhar o seu desenvolvimento."
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 32,
          }}
        >
          {TEACHERS.map((teacher) => (
            <article key={teacher.name}>
              <img
                className="img-round"
                src={asset(teacher.photo)}
                alt={`${teacher.name}, ${teacher.role.toLowerCase()} da Desenhe`}
                style={{width: '100%', aspectRatio: '4 / 3', objectFit: 'cover'}}
                loading="lazy"
              />
              <div style={{marginTop: 12}}>
                <Heading level={3}>{teacher.name}</Heading>
                <Text type="supporting" display="block">
                  {teacher.role}
                </Text>
                <div style={{marginTop: 8}}>
                  <Text color="secondary">{teacher.bio}</Text>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
