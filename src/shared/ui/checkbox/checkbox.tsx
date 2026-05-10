import { InputHTMLAttributes, ReactNode } from 'react';

import './checkbox.scss';

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: ReactNode;
};

export const Checkbox = ({ label, className = '', id, ...props }: CheckboxProps) => {
  const checkboxId = id || props.name;
  const classes = ['checkbox', className].filter(Boolean).join(' ');

  return (
    <label className={classes} htmlFor={checkboxId}>
      <input className="checkbox__input" id={checkboxId} type="checkbox" {...props} />
      <span className="checkbox__control" aria-hidden="true" />
      {label && <span className="checkbox__label">{label}</span>}
    </label>
  );
};
