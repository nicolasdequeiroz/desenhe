import {useEffect, useRef, useState} from 'react';
import {Quotes, Star} from '@phosphor-icons/react';
import {WhatsCta} from './WhatsCta';
import {Button} from '../ui';
import {SITE, TESTIMONIALS, type Testimonial} from '../data';

const TICKER_SPEED_PX_PER_SEC = 40;
/** Movimento necessário para decidir se um toque é arrasto do trilho (px). */
const DRAG_LOCK_THRESHOLD = 6;

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
  /*
   * No toque não dá para "capturar" o ponteiro logo no `pointerdown`: o
   * navegador ainda pode decidir que o gesto é rolagem vertical da página, e
   * capturar cedo faz o Android/iOS dispararem `pointercancel` e matarem o
   * arrasto. Então guardamos o toque como "pendente" e só travamos o arrasto
   * (captura + flag) quando o movimento se confirma mais horizontal que
   * vertical. Com mouse não há ambiguidade: trava na hora.
   */
  const pendingRef = useRef<{
    x: number;
    y: number;
    pointerId: number;
    position: number;
  } | null>(null);
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

  const lockDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const pending = pendingRef.current;
    if (!pending) return;
    draggingRef.current = true;
    dragStartXRef.current = pending.x;
    dragStartPositionRef.current = pending.position;
    setIsDragging(true);
    try {
      event.currentTarget.setPointerCapture(pending.pointerId);
    } catch {
      /* ponteiro já solto */
    }
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    pendingRef.current = {
      x: event.clientX,
      y: event.clientY,
      pointerId: event.pointerId,
      position: positionRef.current,
    };
    if (event.pointerType === 'mouse') lockDrag(event);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    updateHintPosition(event);

    const pending = pendingRef.current;
    if (pending && !draggingRef.current) {
      const dx = event.clientX - pending.x;
      const dy = event.clientY - pending.y;
      if (Math.abs(dx) < DRAG_LOCK_THRESHOLD && Math.abs(dy) < DRAG_LOCK_THRESHOLD) {
        return;
      }
      // Gesto mais vertical que horizontal: é rolagem da página, desiste.
      if (Math.abs(dy) > Math.abs(dx)) {
        pendingRef.current = null;
        return;
      }
      lockDrag(event);
    }

    if (!draggingRef.current) return;
    // Arrasto travado: segura a página parada enquanto o trilho se move.
    if (event.cancelable) event.preventDefault();
    const delta = event.clientX - dragStartXRef.current;
    positionRef.current = dragStartPositionRef.current + delta;
  };

  const stopDragging = (event: React.PointerEvent<HTMLDivElement>) => {
    pendingRef.current = null;
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setIsDragging(false);
    try {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    } catch {
      /* ponteiro já solto */
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
          Arraste para ver mais
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
