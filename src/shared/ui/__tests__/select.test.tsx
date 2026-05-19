import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Select } from '@/shared/ui/select/select';

const options = [
  { value: '', label: 'Select one option' },
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
];

describe('Select', () => {
  it('renders all provided options', () => {
    render(<Select aria-label="Gender" options={options} />);

    expect(screen.getByRole('option', { name: 'Select one option' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Male' })).toHaveValue('MALE');
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('changes selected value and calls onChange', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Select aria-label="Gender" options={options} onChange={onChange} />);

    await user.selectOptions(screen.getByLabelText('Gender'), 'FEMALE');

    expect(screen.getByLabelText('Gender')).toHaveValue('FEMALE');
    expect(onChange).toHaveBeenCalled();
  });

  it('shows invalid state and error message', () => {
    render(<Select aria-label="Gender" options={options} isInvalid error="Select one of the options" />);

    expect(screen.getByLabelText('Gender')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Select one of the options')).toBeInTheDocument();
  });
});
