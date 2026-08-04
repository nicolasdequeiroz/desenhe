import {useEffect, useRef, useState} from 'react';
import {Quotes, Star} from '@phosphor-icons/react';
import {WhatsCta} from './WhatsCta';
import {Button} from '../ui';
import {SITE, TESTIMONIALS, type Testimonial} from '../data';

const TICKER_SPEED_PX_PER_SEC = 40;

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
      <Quotes
        className="testimonials__quote-icon"
        weight="fill"
        aria-hidden="true"
      />
    </article>
  );
}

/** Depoimentos: layout testimonial3 (header + trilho horizontal arrastável). */
export function TestimonialsSection() {
  const tickerItems = [...TESTIMONIALS, ...TESTIMONIALS];
  const trackRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLSpanElement>(null);
  const positionRef = useRef(0);
  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartPositionRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (reduceMotion) return;

    let raf: number;
    let lastTime: number | null = null;

    const step = (time: number) => {
      if (lastTime === null) lastTime = time;
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (!draggingRef.current) {
        positionRef.current -= TICKER_SPEED_PX_PER_SEC * dt;
      }

      const halfWidth = track.scrollWidth / 2;
      if (halfWidth > 0) {
        positionRef.current =
          ((positionRef.current % halfWidth) + halfWidth) % halfWidth;
        positionRef.current -= halfWidth;
      }

      track.style.transform = `translateX(${positionRef.current}px)`;
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const updateHintPosition = (event: React.PointerEvent<HTMLDivElement>) => {
    const carousel = carouselRef.current;
    const hint = hintRef.current;
    if (!carousel || !hint) return;
    const rect = carousel.getBoundingClientRect();
    hint.style.left = `${event.clientX - rect.left}px`;
    hint.style.top = `${event.clientY - rect.top}px`;
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    dragStartXRef.current = event.clientX;
    dragStartPositionRef.current = positionRef.current;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    updateHintPosition(event);
    if (!draggingRef.current) return;
    const delta = event.clientX - dragStartXRef.current;
    positionRef.current = dragStartPositionRef.current + delta;
  };

  const stopDragging = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <section className="section section--muted testimonials">
      <div className="container testimonials__inner">
        <div className="testimonials__header">
          <div className="testimonials__intro">
            <span className="section__eyebrow">Depoimentos</span>
            <h2 className="testimonials__title">
              Quem já passou pela Desenhe conta como foi
            </h2>
            <p className="testimonials__lead">
              Cada turma é um grupo pequeno, com professores que acompanham o
              ritmo e os objetivos de cada aluno, do primeiro traço ao trabalho
              autoral.
            </p>
            <div className="testimonials__actions">
              <WhatsCta
                message="Olá! Quero conhecer a Desenhe e saber mais sobre os cursos."
                label="Fale com a gente"
                size="sm"
              />
              <Button
                label="Avaliar no Google"
                variant="ghost"
                size="sm"
                href={SITE.googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        ref={carouselRef}
        className={`testimonials__carousel${isDragging ? ' testimonials__carousel--dragging' : ''}`}
        aria-label="Depoimentos de alunos"
        onPointerEnter={updateHintPosition}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        onPointerLeave={stopDragging}
      >
        <span ref={hintRef} className="testimonials__hint" aria-hidden="true">
          Clique e arraste
        </span>
        <div className="testimonials__track" ref={trackRef}>
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
