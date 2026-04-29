import { SelectHTMLAttributes } from 'react';

import './select.scss';

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  options: SelectOption[];
  isInvalid?: boolean;
  error?: string;
};

export const Select = ({
  className = '',
  options,
  isInvalid = false,
  error,
  ...props
}: SelectProps) => {
  const classes = ['field-select', isInvalid ? 'field-select--invalid' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="field-select-wrap">
      <select className={classes} aria-invalid={isInvalid} {...props}>
        {options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {isInvalid && error && <p className="field-select-wrap__error">{error}</p>}
    </div>
  );
};
