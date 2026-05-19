import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Accordion } from '@/shared/ui/accordion/accordion';

const items = [
  { id: 'first', title: 'First question', content: 'First answer' },
  { id: 'second', title: 'Second question', content: 'Second answer' },
];

describe('Accordion', () => {
  it('renders all headers and keeps panels closed by default', () => {
    render(<Accordion items={items} />);

    expect(screen.getByRole('button', { name: 'First question' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('First answer')).not.toBeVisible();
    expect(screen.getByText('Second answer')).not.toBeVisible();
  });

  it('opens selected panel after header click', async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);

    await user.click(screen.getByRole('button', { name: 'First question' }));

    expect(screen.getByRole('button', { name: 'First question' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('First answer')).toBeVisible();
  });

  it('opens only one panel at a time and closes an opened panel on repeated click', async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);

    await user.click(screen.getByRole('button', { name: 'First question' }));
    await user.click(screen.getByRole('button', { name: 'Second question' }));

    expect(screen.getByText('First answer')).not.toBeVisible();
    expect(screen.getByText('Second answer')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Second question' }));
    expect(screen.getByText('Second answer')).not.toBeVisible();
  });
});
