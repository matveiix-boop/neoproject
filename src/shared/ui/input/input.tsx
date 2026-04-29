import { InputHTMLAttributes, KeyboardEventHandler } from 'react';

import './input.scss';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  isValid?: boolean;
  isInvalid?: boolean;
  error?: string;
};

const NUMBER_FORBIDDEN_KEYS = ['e', 'E', '+', '-', '.', ','];

export const Input = ({
  className = '',
  isValid = false,
  isInvalid = false,
  error,
  type = 'text',
  onKeyDown,
  ...props
}: InputProps) => {
  const classes = [
    'field-input',
    isValid ? 'field-input--valid' : '',
    isInvalid ? 'field-input--invalid' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (type === 'number' && NUMBER_FORBIDDEN_KEYS.includes(event.key)) {
      event.preventDefault();
    }

    onKeyDown?.(event);
  };

  return (
    <div className="field-input-wrap">
      <input
        className={classes}
        type={type}
        aria-invalid={isInvalid}
        onKeyDown={handleKeyDown}
        {...props}
      />
      {(isValid || isInvalid) && (
        <span
          className={`field-input-wrap__icon${isInvalid ? ' field-input-wrap__icon--invalid' : ''}`}
          aria-hidden="true"
        />
      )}
      {isInvalid && error && <p className="field-input-wrap__error">{error}</p>}
    </div>
  );
};
