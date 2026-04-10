import { ReactNode } from 'react';

import './container.scss';

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export const Container = ({ children, className = '' }: ContainerProps) => {
  const classes = ['container', className].filter(Boolean).join(' ');

  return <div className={classes}>{children}</div>;
};
