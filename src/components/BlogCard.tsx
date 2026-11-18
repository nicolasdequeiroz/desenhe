import {Link} from 'react-router-dom';
import {ArrowUpRight} from '@phosphor-icons/react';
import {Text} from '../ui';
import {asset, formatPostDate, formatPostDateShort, type BlogPostMeta} from '../data';

/**
 * Card de post: o mesmo polaroid dos cursos (`.course-card`), para a lista do
 * blog falar a mesma língua da lista de cursos. Muda o corpo, que traz a
 * categoria, a data e o tempo de leitura no lugar das modalidades, e a foto
 * fica limpa, sem etiqueta por cima.
 */
export function BlogCard({post}: {post: BlogPostMeta}) {
  return (
    <Link to={`/blog/${post.slug}`} className="course-card blog-card">
      <div className="course-card__frame">
        <div className="course-card__cover">
          <img src={asset(post.cover)} alt={post.coverAlt} loading="lazy" />
          <span className="course-card__arrow" aria-hidden="true">
            <ArrowUpRight size={18} weight="bold" />
          </span>
        </div>
      </div>
      <div className="course-card__body">
        {/* Categoria em laranja e, depois de um fio, data e leitura em cinza:
            o mesmo rótulo do post em destaque, sem nada por cima da foto. */}
        <span className="blog-card__meta text-style-label">
          {post.category && <span className="blog-card__category">{post.category}</span>}
          <span className="blog-card__when">
            <time dateTime={post.date} title={formatPostDate(post.date)}>
              {formatPostDateShort(post.date)}
            </time>
            <span aria-hidden="true">·</span>
            <span>{post.readingMinutes} min</span>
          </span>
        </span>
        <h3 className="course-card__title">{post.title}</h3>
        <Text type="body" color="secondary">
          {post.description}
        </Text>
      </div>
    </Link>
  );
}
