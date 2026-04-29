import { LabelHTMLAttributes, ReactNode } from 'react';

import './label.scss';

type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  children: ReactNode;
  required?: boolean;
};

export const Label = ({ children, required = false, className = '', ...props }: LabelProps) => {
  const classes = ['field-label', className].filter(Boolean).join(' ');

  return (
    <label className={classes} {...props}>
      {children}
      {required && <span className="field-label__required"> *</span>}
    </label>
  );
};
