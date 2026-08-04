import {useEffect, useRef} from 'react';
import {X} from '@phosphor-icons/react';
import {asset, type Teacher} from '../data';

const FOCUSABLE_SELECTOR =
  'button:not(:disabled), [href], input:not(:disabled), select, textarea, [tabindex]:not([tabindex="-1"])';

interface Props {
  teacher: Teacher;
  onClose: () => void;
}

/** Modal de biografia: abre com os dados de um professor a partir do card clicado. */
export function ProfessorModal({teacher, onClose}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !panel) return;

      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <>
      <div className="professor-modal-backdrop" onClick={onClose} aria-hidden="true" />
      <div
        className="professor-modal"
        role="dialog"
        aria-modal="true"
        aria-label={teacher.name}
        ref={panelRef}
      >
        <button
          type="button"
          className="professor-modal__close"
          onClick={onClose}
          aria-label="Fechar"
        >
          <X size={18} weight="bold" />
        </button>

        <div className="professor-modal__media">
          <img
            src={asset(teacher.photo)}
            alt={`${teacher.name}, ${teacher.role.toLowerCase()} da Desenhe`}
          />
        </div>

        <div className="professor-modal__body">
          <p className="professor-modal__role">{teacher.role}</p>
          <h3 className="professor-modal__name">{teacher.name}</h3>
          <p className="professor-modal__bio">{teacher.bio}</p>
        </div>
      </div>
    </>
  );
}
