import {useEffect, useRef} from 'react';
import {Link} from 'react-router-dom';
import {Button} from '../ui';
import {COURSES, asset} from '../data';

/**
 * Ajustes do efeito de hover (mesmos valores do componente de referência):
 * quanto a imagem pode extrapolar a coluna, o quanto ela gira/desloca
 * seguindo o cursor e o fator de suavização do lerp.
 */
const SETTINGS = {
  maxOverflow: 24,
  rotateAmount: 5,
  moveAmount: 10,
  smoothing: 0.12,
};

/**
 * Seção de cursos em destaque: lista de títulos grandes numerados e, ao lado,
 * a capa do curso sob o cursor — ela troca com blur + deslize e acompanha o
 * mouse com uma inclinação suave.
 */
export function FeaturedCoursesSection() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const wrap = root.querySelector<HTMLElement>('.featured-courses__images');
    const triggersWrap = root.querySelector<HTMLElement>('.featured-courses__links');
    if (!wrap || !triggersWrap) return;

    const targets = Array.from(wrap.children) as HTMLElement[];
    const triggers = Array.from(triggersWrap.children) as HTMLElement[];
    if (!targets.length || !triggers.length) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    let activeIndex = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frame = 0;
    const timeouts = new Set<number>();

    const clamp = (value: number, min: number, max: number) =>
      Math.min(Math.max(value, min), max);

    function setTargetVars(
      target: HTMLElement,
      rotate = 0,
      moveY = 0,
      moveX = 0,
      scale: number | null = null,
    ) {
      target.style.setProperty('--hover-rotate', `${rotate}deg`);
      target.style.setProperty('--hover-move-y', `${moveY}px`);
      target.style.setProperty('--hover-move-x', `${moveX}px`);
      if (scale !== null) target.style.setProperty('--hover-scale', String(scale));
    }

    /** Centra verticalmente a capa na linha ativa, sem sair muito da coluna. */
    function positionTarget(index: number) {
      const trigger = triggers[index];
      const target = targets[index];
      if (!trigger || !target || !wrap) return;

      const triggerRect = trigger.getBoundingClientRect();
      const wrapRect = wrap.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      const linkCenterY = triggerRect.top + triggerRect.height / 2;
      const desiredTop = linkCenterY - wrapRect.top - targetRect.height / 2;

      const minTop = -SETTINGS.maxOverflow;
      const maxTop = wrapRect.height - targetRect.height + SETTINGS.maxOverflow;

      target.style.top = `${clamp(desiredTop, minTop, maxTop)}px`;
    }

    function applyTransform() {
      const target = targets[activeIndex];
      const trigger = triggers[activeIndex];
      if (!target || !trigger) return;

      if (reduceMotion.matches) {
        setTargetVars(target, 0, 0, 0);
        return;
      }

      const rect = trigger.getBoundingClientRect();
      /*
       * Limita a -0,5..0,5: a última posição do cursor é em coordenada de
       * viewport, então rolar a página com um item ativo deixaria a conta
       * fora da faixa e jogaria a capa para longe.
       */
      const x = clamp((currentX - rect.left) / rect.width - 0.5, -0.5, 0.5);
      const y = clamp((currentY - rect.top) / rect.height - 0.5, -0.5, 0.5);

      setTargetVars(
        target,
        x * SETTINGS.rotateAmount,
        y * SETTINGS.moveAmount,
        x * SETTINGS.moveAmount,
      );
    }

    function animate() {
      currentX += (targetX - currentX) * SETTINGS.smoothing;
      currentY += (targetY - currentY) * SETTINGS.smoothing;
      applyTransform();
      frame = requestAnimationFrame(animate);
    }

    function setActive(index: number, event?: MouseEvent) {
      if (!targets[index] || !triggers[index]) return;

      const previousIndex = activeIndex;
      const direction = index > previousIndex ? 'from-bottom' : 'from-top';
      activeIndex = index;

      const triggerRect = triggers[index].getBoundingClientRect();
      targetX = event?.clientX ?? triggerRect.left + triggerRect.width / 2;
      targetY = event?.clientY ?? triggerRect.top + triggerRect.height / 2;
      currentX = targetX;
      currentY = targetY;

      triggers.forEach((trigger) => trigger.classList.remove('is-active'));
      targets.forEach((target) => {
        target.classList.remove('is-active', 'from-top', 'from-bottom');
        setTargetVars(target, 0, 0, 0, 0.96);
      });

      triggers[index].classList.add('is-active');
      targets[index].classList.add('is-active');
      if (!reduceMotion.matches) targets[index].classList.add(direction);

      setTargetVars(targets[index], 0, 0, 0, 1);
      applyTransform();
      positionTarget(index);

      const id = window.setTimeout(() => {
        targets[index].classList.remove('from-top', 'from-bottom');
        timeouts.delete(id);
      }, 650);
      timeouts.add(id);
    }

    const cleanups = triggers.map((trigger, index) => {
      const onEnter = (event: MouseEvent) => {
        if (index === activeIndex) return;
        setActive(index, event);
      };
      const onMove = (event: MouseEvent) => {
        if (index !== activeIndex) return;
        targetX = event.clientX;
        targetY = event.clientY;
      };
      // Teclado: navegar com Tab também troca a capa exibida.
      const onFocus = () => {
        if (index !== activeIndex) setActive(index);
      };

      trigger.addEventListener('mouseenter', onEnter);
      trigger.addEventListener('mousemove', onMove);
      trigger.addEventListener('focus', onFocus);

      return () => {
        trigger.removeEventListener('mouseenter', onEnter);
        trigger.removeEventListener('mousemove', onMove);
        trigger.removeEventListener('focus', onFocus);
      };
    });

    const onResize = () => positionTarget(activeIndex);
    window.addEventListener('resize', onResize);

    /*
     * A altura da capa só existe depois que a imagem decodifica, e a altura das
     * linhas muda quando a fonte de display carrega. O `load` não serve sozinho
     * (imagem em cache não dispara), então observamos o tamanho real.
     */
    const observer = new ResizeObserver(onResize);
    observer.observe(wrap);
    observer.observe(triggersWrap);
    targets.forEach((target) => observer.observe(target));

    setActive(0);
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
      observer.disconnect();
      cleanups.forEach((off) => off());
      timeouts.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  return (
    <section className="section featured-courses">
      <div className="container">
        <div className="featured-courses__block" ref={rootRef}>
          <span className="section__eyebrow">Cursos em destaque</span>

          <div className="featured-courses__services">
            <div className="featured-courses__images" aria-hidden="true">
              {COURSES.map((course, index) => (
                <img
                  key={course.slug}
                  className={`featured-courses__image${index === 0 ? ' is-active' : ''}`}
                  src={asset(course.cover)}
                  alt=""
                  loading={index === 0 ? undefined : 'lazy'}
                />
              ))}
            </div>

            <div className="featured-courses__links">
              {COURSES.map((course, index) => (
                <Link
                  key={course.slug}
                  to={`/cursos/${course.slug}`}
                  className={`featured-courses__link${index === 0 ? ' is-active' : ''}`}
                >
                  <span className="featured-courses__link-title">
                    {course.shortTitle}
                  </span>
                  <span className="featured-courses__count" aria-hidden="true">
                    <span>/</span>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <span>/</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <span className="featured-courses__divider" aria-hidden="true" />

          <div className="featured-courses__footer">
            <p className="featured-courses__footnote">
              Todos os cursos têm matrículas abertas o ano inteiro e acompanham
              o nível e o ritmo de cada aluno.
            </p>
            <Button label="Todos os cursos" href="/cursos" variant="primary" />
          </div>
        </div>
      </div>
    </section>
  );
}
