import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Tabs } from '@/shared/ui/tabs/tabs';

const tabs = [
  { id: 'about', label: 'About card' },
  { id: 'faq', label: 'FAQ' },
  { id: 'rates', label: 'Rates' },
];

describe('Tabs', () => {
  it('renders accessible tablist with all tabs', () => {
    render(<Tabs tabs={tabs} activeTab="about" onTabChange={vi.fn()} />);

    expect(screen.getByRole('tablist', { name: 'Credit card information' })).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(3);
  });

  it('marks active tab with aria-selected and active class', () => {
    render(<Tabs tabs={tabs} activeTab="faq" onTabChange={vi.fn()} />);

    expect(screen.getByRole('tab', { name: 'FAQ' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'FAQ' })).toHaveClass('tabs__button--active');
    expect(screen.getByRole('tab', { name: 'About card' })).toHaveAttribute('aria-selected', 'false');
  });

  it('calls onTabChange with clicked tab id', async () => {
    const onTabChange = vi.fn();
    const user = userEvent.setup();
    render(<Tabs tabs={tabs} activeTab="about" onTabChange={onTabChange} />);

    await user.click(screen.getByRole('tab', { name: 'Rates' }));

    expect(onTabChange).toHaveBeenCalledWith('rates');
  });
});
