import {useEffect, useState} from 'react';
import {PROMO_ROTATION_MS} from '../data';

/**
 * Índice da campanha em destaque agora, girando sozinho entre `count` itens a
 * cada `PROMO_ROTATION_MS`. Com um item só não liga timer nenhum. `paused`
 * segura a rotação (mouse em cima, foco do teclado) e quem pediu "menos
 * movimento" no sistema não ganha rotação automática: troca só pelos pontos.
 *
 * O primeiro render (inclusive o pré-renderizado no build) é sempre o item 0;
 * o timer só começa depois da hidratação.
 */
export function usePromoRotation(count: number, paused = false) {
  const [index, setIndex] = useState(0);
  const [calm, setCalm] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setCalm(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (count < 2 || paused || calm) return;
    // Depender de `index` reinicia o relógio quando alguém troca pelos pontos.
    const timer = window.setTimeout(
      () => setIndex((current) => (current + 1) % count),
      PROMO_ROTATION_MS,
    );
    return () => window.clearTimeout(timer);
  }, [count, paused, calm, index]);

  return [index % Math.max(count, 1), setIndex] as const;
}
