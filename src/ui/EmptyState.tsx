import type {ReactNode} from 'react';
import {Heading, Text} from './Text';

export interface EmptyStateProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

/** Estado vazio (ex.: página 404). Substitui o <EmptyState> do Astryx. */
export function EmptyState({title, description, actions}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <Heading level={2}>{title}</Heading>
      {description && (
        <Text color="secondary" display="block">
          {description}
        </Text>
      )}
      {actions && <div className="empty-state__actions">{actions}</div>}
    </div>
  );
}
