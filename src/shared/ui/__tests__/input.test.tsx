import { createEvent, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Input } from '@/shared/ui/input/input';

describe('Input', () => {
  it('renders input and forwards standard props', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Input aria-label="First name" placeholder="Enter name" onChange={onChange} />);

    const input = screen.getByLabelText('First name');
    expect(input).toHaveAttribute('placeholder', 'Enter name');

    await user.type(input, 'Ivan');
    expect(onChange).toHaveBeenCalled();
  });

  it('shows invalid state and error text', () => {
    render(<Input aria-label="Email" isInvalid error="Incorrect email" />);

    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Incorrect email')).toBeInTheDocument();
  });

  it('prevents non-integer symbols for number inputs but still calls custom keydown handler', () => {
    const onKeyDown = vi.fn();
    render(<Input aria-label="Amount" type="number" onKeyDown={onKeyDown} />);

    const input = screen.getByLabelText('Amount');
    const event = createEvent.keyDown(input, { key: 'e' });
    const preventDefault = vi.spyOn(event, 'preventDefault');

    fireEvent(input, event);

    expect(preventDefault).toHaveBeenCalled();
    expect(onKeyDown).toHaveBeenCalled();
  });
});
