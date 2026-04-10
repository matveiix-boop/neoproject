import { ButtonHTMLAttributes, ReactNode } from 'react';

import './button.scss';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  wide?: boolean;
};

export const Button = ({
  children,
  variant = 'primary',
  wide = false,
  className = '',
  ...props
}: ButtonProps) => {
  const classes = ['button', `button--${variant}`, wide ? 'button--wide' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};
