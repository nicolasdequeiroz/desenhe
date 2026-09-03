import {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import {Text} from '../ui';
import {Seo} from '../components/Seo';
import {Section} from '../components/Section';
import {ProfessorModal} from '../components/ProfessorModal';
import {TEACHERS, asset, type Teacher} from '../data';

export function Professores() {
  const [selected, setSelected] = useState<Teacher | null>(null);
  const {hash} = useLocation();

  /**
   * As páginas individuais de professor do site antigo (ex.: /oscar-pedroso)
   * redirecionam para /professores#<slug>: quem chega por esses links cai
   * direto na bio da pessoa que procurava, não numa lista genérica.
   */
  useEffect(() => {
    const slug = decodeURIComponent(hash.replace('#', ''));
    const teacher = TEACHERS.find((candidate) => candidate.slug === slug);
    if (teacher) setSelected(teacher);
  }, [hash]);

  return (
    <div className="professores-page">
      <Seo
        title="Professores de Desenho e Pintura"
        description="Os professores da Desenhe são artistas visuais, ilustradores e pesquisadores formados em belas artes, que acompanham cada aluno de perto em turmas pequenas."
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
                key={teacher.slug}
                id={teacher.slug}
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
    </div>
  );
}
