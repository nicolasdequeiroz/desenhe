import {useState} from 'react';
import {Text} from '../ui';
import {Seo} from '../components/Seo';
import {Section} from '../components/Section';
import {ProfessorModal} from '../components/ProfessorModal';
import {TEACHERS, asset, type Teacher} from '../data';

export function Professores() {
  const [selected, setSelected] = useState<Teacher | null>(null);

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
        lead="Artistas visuais, ilustradores e pesquisadores, cada um com sua trajetória, todos dedicados a acompanhar o seu desenvolvimento."
      >
        <div className="professors-content">
          <div className="professors-banner" />


          <div className="professors-grid">
            {TEACHERS.map((teacher) => (
              <button
                key={teacher.name}
                type="button"
                className="professor-card"
                onClick={() => setSelected(teacher)}
              >
                <span className="professor-card__image-wrap">
                  <img
                    className="professor-card__image"
                    src={asset(teacher.photo)}
                    alt={`${teacher.name}, ${teacher.role.toLowerCase()} da Desenhe`}
                    loading="lazy"
                  />
                </span>
                <span className="professor-card__details">
                  <Text as="span" weight="bold" display="block">
                    {teacher.name}
                  </Text>
                  <Text type="supporting" display="block">
                    {teacher.role}
                  </Text>
                  <span className="professor-card__cta">Ler biografia →</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </Section>

      {selected && (
        <ProfessorModal teacher={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
