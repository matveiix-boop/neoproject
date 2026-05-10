import { ReactNode } from 'react';

import { Button } from '@/shared/ui/button/button';
import { Container } from '@/shared/ui/container/container';

import './status-message.scss';

type StatusMessageProps = {
  title: string;
  text?: string;
  children?: ReactNode;
  className?: string;
};

export const StatusMessage = ({ title, text, children, className = '' }: StatusMessageProps) => {
  const classes = ['status-message', className].filter(Boolean).join(' ');

  return (
    <main className={classes}>
      <Container>
        <div className="status-message__content">
          <h1 className="status-message__title">{title}</h1>
          {text && <p className="status-message__text">{text}</p>}
          {children && <div className="status-message__actions">{children}</div>}
        </div>
      </Container>
    </main>
  );
};

export { Button as StatusButton };
