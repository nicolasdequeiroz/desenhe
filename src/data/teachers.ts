/** Equipe de professores, com bios extraídas do site atual. */

export interface Teacher {
  /**
   * Identificador na URL: cada professor tinha uma página própria no site
   * antigo (ex.: /oscar-pedroso), que agora redireciona para
   * /professores#<slug> e abre a bio direto no modal.
   */
  slug: string;
  name: string;
  role: string;
  /** Um ou mais parágrafos, renderizados como blocos separados no modal. */
  bio: string[];
  photo: string;
}

export const TEACHERS: Teacher[] = [
  {
    slug: 'efigenio-pavei',
    name: 'Efigênio Pavei',
    role: 'Artista visual e professor',
    bio: [
      'Artista visual e professor de desenho e pintura. Sua pesquisa artística tem o corpo humano como centro do trabalho criativo.',
    ],
    photo: '/images/professores/efigenio-pavei.webp',
  },
  {
    slug: 'mateus-dukevicz',
    name: 'Mateus Dukevicz',
    role: 'Professor de desenho e pintura',
    bio: [
      'Professor de desenho e pintura, formado pela EMBAP (Escola de Música e Belas Artes do Paraná). Ex-aluno da Desenhe, desenha desde sempre.',
    ],
    photo: '/images/professores/mateus-dikevicz.webp',
  },
  {
    slug: 'oscar-pedroso',
    name: 'Oscar Pedroso',
    role: 'Fundador e professor',
    bio: [
      'Professor, artista e fundador da Desenhe. Licenciado em Educação Artística com especialização em Artes Plásticas pela FAP (Faculdade de Artes do Paraná). Trabalhou na Editora Abril e é autor de manuais de desenho para o SENAC Paraná.',
    ],
    photo: '/images/professores/oscar-pedroso.webp',
  },
  {
    slug: 'rafael-mesquita',
    name: 'Rafael Mesquita',
    role: 'Artista visual e professor',
    bio: [
      'Rafael Mesquita (Paraná, 1994) é pintor, arte-educador e produtor cultural baseado em Curitiba. Atua na arte e cultura desde 2017 e desenvolve uma pesquisa em pintura figurativa contemporânea, tendo o óleo como principal linguagem. Seu trabalho investiga corpo, intimidade, vulnerabilidade e vivências LGBTQIA+, explorando cor, textura, matéria e gesto.',
      'Em 2026, realizou a exposição individual "Entre Gestos" no Café Cultura, em Curitiba, e já participou de salões e exposições em diferentes espaços culturais e museus pelo Brasil, incluindo o MUMA e o Cine Passeio (Curitiba). É vencedor do prêmio internacional Portrait Artist of the Year 2025, pela ARTIT, de Londres, na categoria de voto popular, e é representado pela Vórtice Cultural, de São Paulo.',
      'Sua produção também se estende às telas e ilustra capas de livros, EPs e discos de vinil lançados no Brasil e na Europa. Entre seus projetos, está a criação da capa e identidade artística do Congresso Internacional Hans Jonas. Seu trabalho já foi publicado em veículos e plataformas internacionais e integra acervos particulares em mais de 10 países.',
    ],
    photo: '/images/professores/rafael-mesquita.webp',
  },
  {
    slug: 'roberta-bentes',
    name: 'Roberta Bentes',
    role: 'Professora de desenho',
    bio: [
      'Professora de desenho com foco em história da arte, em especial nos estudos da cor. Vê a arte como um despertar dos sentidos, acessível a todas as pessoas.',
    ],
    photo: '/images/professores/roberta-bentes.webp',
  },
];
