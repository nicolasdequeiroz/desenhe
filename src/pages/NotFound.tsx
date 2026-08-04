import {EmptyState} from '../ui';
import {Button} from '../ui';
import {Seo} from '../components/Seo';

export function NotFound() {
  return (
    <>
      <Seo title="Página não encontrada" />
      <div className="container section">
        <EmptyState
          title="Página não encontrada"
          description="O endereço que você acessou não existe ou mudou de lugar no novo site."
          actions={<Button label="Voltar para a home" href="/" variant="primary" />}
        />
      </div>
    </>
  );
}
