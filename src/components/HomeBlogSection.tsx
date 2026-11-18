import {Button} from '../ui';
import {Section} from './Section';
import {BlogCard} from './BlogCard';
import {BLOG_POSTS} from '../data';

/**
 * Faixa do blog na home, antes da seção do espaço: os três posts mais
 * recentes nos mesmos cards da /blog, com o link para o blog inteiro ao lado
 * do título. Sem post publicado, a faixa não aparece.
 */
export function HomeBlogSection() {
  const latest = BLOG_POSTS.slice(0, 3);
  if (latest.length === 0) return null;

  return (
    <Section
      kicker="Blog"
      title="Dicas e bastidores da sala"
      lead="Técnicas, materiais e o que alunos e professores andam produzindo, escrito por quem ensina na Desenhe."
      centered={false}
      className="home-blog"
      actions={<Button label="Ver o blog" href="/blog" variant="secondary" />}
    >
      <div className="course-grid">
        {latest.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </Section>
  );
}
