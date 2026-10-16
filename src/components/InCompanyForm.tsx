import {useState, type FormEvent} from 'react';
import {Button} from '../ui';
import {IN_COMPANY_FORMATS, whatsappLink} from '../data';

const OTHER = 'Ainda não sei, quero uma sugestão';

/**
 * Pedido de proposta. O site não tem backend: o formulário monta a mensagem
 * e abre o WhatsApp da escola com ela pré-preenchida, como os demais CTAs.
 */
export function InCompanyForm() {
  const [error, setError] = useState('');

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const get = (key: string) => String(data.get(key) ?? '').trim();

    if (!get('empresa') || !get('objetivo')) {
      setError('Preencha ao menos o nome da empresa e o objetivo.');
      return;
    }
    setError('');

    const lines = [
      'Olá! Gostaria de uma proposta de In Company da Desenhe.',
      `Empresa: ${get('empresa')}`,
      get('area') && `Área: ${get('area')}`,
      get('pessoas') && `Número de pessoas: ${get('pessoas')}`,
      get('data') && `Data prevista: ${get('data')}`,
      `Formato: ${get('formato')}`,
      `Objetivo: ${get('objetivo')}`,
    ].filter(Boolean);

    window.open(whatsappLink(lines.join('\n')), '_blank', 'noopener,noreferrer');
  };

  return (
    <form className="ic-form" onSubmit={onSubmit} noValidate>
      <label className="ic-form__field">
        <span>Empresa</span>
        <input name="empresa" type="text" autoComplete="organization" required />
      </label>
      <label className="ic-form__field">
        <span>Sua área</span>
        <input name="area" type="text" placeholder="RH, eventos, marketing..." />
      </label>
      <label className="ic-form__field">
        <span>Número de pessoas</span>
        <input name="pessoas" type="text" inputMode="numeric" placeholder="Ex.: 25" />
      </label>
      <label className="ic-form__field">
        <span>Data prevista</span>
        <input name="data" type="text" placeholder="Ex.: 12/12 ou novembro" />
      </label>
      <label className="ic-form__field ic-form__field--wide">
        <span>Formato</span>
        <select name="formato" defaultValue={OTHER}>
          {IN_COMPANY_FORMATS.map((format) => (
            <option key={format.slug} value={format.title}>
              {format.title}
            </option>
          ))}
          <option value={OTHER}>{OTHER}</option>
        </select>
      </label>
      <label className="ic-form__field ic-form__field--wide">
        <span>Qual o objetivo da ação?</span>
        <textarea name="objetivo" rows={3} required />
      </label>
      {error && (
        <p className="ic-form__error" role="alert">
          {error}
        </p>
      )}
      <div className="ic-form__actions">
        <Button type="submit" label="Enviar pelo WhatsApp" variant="primary" size="sm" />
        <span className="ic-form__hint">A mensagem abre pronta no WhatsApp: é só enviar.</span>
      </div>
    </form>
  );
}
