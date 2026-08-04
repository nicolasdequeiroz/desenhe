/** Depoimentos de alunos: extraídos de avaliações reais no Google. */

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Recomendo muito a escola Desenhe a quem busca qualidade no ensino e um ambiente acolhedor para aprender. A organização é impecável e o cuidado com os alunos é genuíno. Destaco o professor Rafa, cuja didática clara e dedicação fizeram toda a diferença no meu aprendizado.',
    author: 'Marlon S.',
    role: 'Aluno',
  },
  {
    quote:
      'Fui aluna da Desenhe na época da faculdade e até hoje acompanho o trabalho deles: é referência em estudo de desenho na cidade! Espaço acolhedor e professores incríveis.',
    author: 'Dora S.',
    role: 'Ex-aluna',
  },
  {
    quote:
      'Fiz uma aula experimental e saí matriculada. Amei a proposta de ensino e o atendimento desde o primeiro contato no Instagram e WhatsApp até a aula. Muito organizado e professor atencioso.',
    author: 'Ana C.',
    role: 'Aluna',
  },
  {
    quote:
      'Ótima. Local tranquilo para o aprendizado, excelente professor e valor justo. Minha filha está amando.',
    author: 'Viviane L.',
    role: 'Mãe de aluna',
  },
  {
    quote:
      'Sou aposentada e estou usando meu tempo livre para aprender o que sempre quis. A Desenhe é um lugar muito agradável para isso e me senti muito acolhida para também fazer novos amigos.',
    author: 'Sueli D.',
    role: 'Aluna',
  },
  {
    quote:
      'Tratamento muito profissional e excelentes professores. Ensinam desde o básico até técnicas avançadas de desenho artístico, para adultos e crianças, e também preparam para vestibular.',
    author: 'Luiz P.',
    role: 'Aluno',
  },
  {
    quote:
      'Ótima escola, professores atenciosos e espaço incrivelmente aconchegante!',
    author: 'Ju W.',
    role: 'Aluna',
  },
  {
    quote: 'Escola ótima! Professores incríveis!',
    author: 'Delnice N.',
    role: 'Aluna',
  },
  {
    quote: 'Melhor escola de desenho de Curitiba.',
    author: 'Matheus T.',
    role: 'Aluno',
  },
  {
    quote:
      'A escola é incrível e tem opção de pagar aulas avulsas. Recomendo.',
    author: 'Patrícia M.',
    role: 'Aluna',
  },
];
