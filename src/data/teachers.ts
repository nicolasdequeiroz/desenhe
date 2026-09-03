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
  bio: string;
  photo: string;
}

export const TEACHERS: Teacher[] = [
  {
    slug: 'efigenio-pavei',
    name: 'Efigênio Pavei',
    role: 'Artista visual e professor',
    bio: 'Artista visual e professor de desenho e pintura. Sua pesquisa artística tem o corpo humano como centro do trabalho criativo.',
    photo: '/images/professores/efigenio-pavei.webp',
  },
  {
    slug: 'mateus-dukevicz',
    name: 'Mateus Dukevicz',
    role: 'Professor de desenho e pintura',
    bio: 'Professor de desenho e pintura, formado pela EMBAP (Escola de Música e Belas Artes do Paraná). Ex-aluno da Desenhe, desenha desde sempre.',
    photo: '/images/professores/mateus-dikevicz.webp',
  },
  {
    slug: 'oscar-pedroso',
    name: 'Oscar Pedroso',
    role: 'Fundador e professor',
    bio: 'Professor, artista e fundador da Desenhe. Licenciado em Educação Artística com especialização em Artes Plásticas pela FAP (Faculdade de Artes do Paraná). Trabalhou na Editora Abril e é autor de manuais de desenho para o SENAC Paraná.',
    photo: '/images/professores/oscar-pedroso.webp',
  },
  {
    slug: 'rafael-mesquita',
    name: 'Rafael Mesquita',
    role: 'Artista visual e professor',
    bio: 'Artista visual dedicado à pintura a óleo desde 2019. Autodidata, pesquisa retratos, olhares abstratos e o autorretrato.',
    photo: '/images/professores/rafael-mesquita.webp',
  },
  {
    slug: 'roberta-bentes',
    name: 'Roberta Bentes',
    role: 'Professora de desenho',
    bio: 'Professora de desenho com foco em história da arte, em especial nos estudos da cor. Vê a arte como um despertar dos sentidos, acessível a todas as pessoas.',
    photo: '/images/professores/roberta-bentes.webp',
  },
];
