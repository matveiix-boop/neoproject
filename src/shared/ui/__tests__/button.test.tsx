import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '@/shared/ui/button/button';

describe('Button', () => {
  it('renders children inside a button element', () => {
    render(<Button type="button">Apply</Button>);

    expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument();
  });

  it('applies variant, wide and custom classes', () => {
    render(
      <Button type="button" variant="secondary" wide className="extra-class">
        Continue
      </Button>,
    );

    expect(screen.getByRole('button', { name: 'Continue' })).toHaveClass(
      'button',
      'button--secondary',
      'button--wide',
      'extra-class',
    );
  });

  it('forwards click handler and disabled state', async () => {
    const enabledClick = vi.fn();
    const disabledClick = vi.fn();
    const user = userEvent.setup();

    render(
      <>
        <Button type="button" onClick={enabledClick}>Enabled</Button>
        <Button type="button" disabled onClick={disabledClick}>Disabled</Button>
      </>,
    );

    await user.click(screen.getByRole('button', { name: 'Enabled' }));
    await user.click(screen.getByRole('button', { name: 'Disabled' }));

    expect(enabledClick).toHaveBeenCalledTimes(1);
    expect(disabledClick).not.toHaveBeenCalled();
  });
});
