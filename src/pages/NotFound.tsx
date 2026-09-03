import {EmptyState} from '../ui';
import {Button} from '../ui';
import {Seo} from '../components/Seo';

export function NotFound() {
  return (
    <>
      <Seo
        title="Página não encontrada"
        description="A página que você procura não existe ou mudou de endereço. Veja os cursos de desenho e pintura da Desenhe, escola de arte em Curitiba."
        noindex
      />
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
