import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Checkbox } from '@/shared/ui/checkbox/checkbox';

describe('Checkbox', () => {
  it('renders checkbox with text label', () => {
    render(<Checkbox label="I agree" name="agreement" />);

    expect(screen.getByRole('checkbox', { name: 'I agree' })).toBeInTheDocument();
  });

  it('uses provided id for label association', () => {
    render(<Checkbox id="custom-checkbox" label="Documents" />);

    expect(screen.getByRole('checkbox', { name: 'Documents' })).toHaveAttribute('id', 'custom-checkbox');
  });

  it('forwards checked state and change handler', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Checkbox label="Confirm" checked={false} onChange={onChange} />);

    await user.click(screen.getByRole('checkbox', { name: 'Confirm' }));

    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
