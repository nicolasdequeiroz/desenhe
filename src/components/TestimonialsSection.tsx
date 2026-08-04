import {Star} from '@phosphor-icons/react';
import {WhatsCta} from './WhatsCta';
import {TESTIMONIALS, type Testimonial} from '../data';

function TestimonialCard({
  item,
  duplicate = false,
}: {
  item: Testimonial;
  duplicate?: boolean;
}) {
  return (
    <article
      className="testimonials__card"
      aria-hidden={duplicate || undefined}
    >
      <div className="testimonials__stars" aria-hidden="true">
        {Array.from({length: 5}).map((_, index) => (
          <Star key={index} size={16} weight="fill" />
        ))}
      </div>
      <blockquote className="testimonials__quote">“{item.quote}”</blockquote>
      <footer className="testimonials__author">
        <cite className="testimonials__name">{item.author}</cite>
        <span className="testimonials__role">{item.role}</span>
      </footer>
    </article>
  );
}

/** Depoimentos — layout testimonial3 (header + trilho horizontal). */
export function TestimonialsSection() {
  const tickerItems = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section className="section section--muted testimonials">
      <div className="container testimonials__inner">
        <div className="testimonials__header">
          <div className="testimonials__intro">
            <h2 className="testimonials__title">
              “Procuramos alunos apaixonados por arte, curiosos e dispostos a
              compartilhar experiências.”
            </h2>
            <p className="testimonials__lead">
              Cada turma é um grupo pequeno, com professores que acompanham o
              ritmo e os objetivos de cada aluno — do primeiro traço ao trabalho
              autoral.
            </p>
            <div className="testimonials__actions">
              <WhatsCta
                message="Olá! Quero conhecer a Desenhe e saber mais sobre os cursos."
                label="Fale com a gente"
                size="sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="testimonials__carousel" aria-label="Depoimentos de alunos">
        <div className="testimonials__track">
          {tickerItems.map((item, index) => (
            <TestimonialCard
              key={`${item.author}-${index}`}
              item={item}
              duplicate={index >= TESTIMONIALS.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
