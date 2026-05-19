import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Table, type TableColumn } from '@/shared/ui/table/table';

type Person = {
  id: number;
  name: string;
  age: number;
};

const data: Person[] = [
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 20 },
];

const columns: TableColumn<Person>[] = [
  { key: 'name', title: 'Name', render: (person) => person.name, getSortValue: (person) => person.name },
  { key: 'age', title: 'Age', render: (person) => person.age, getSortValue: (person) => person.age },
  { key: 'actions', title: 'Actions', render: () => 'View' },
];

const getFirstDataRowText = () => within(screen.getAllByRole('row')[1]).getAllByRole('cell').map((cell) => cell.textContent);

describe('Table', () => {
  it('renders column headers and rows', () => {
    render(<Table columns={columns} data={data} getRowKey={(person) => person.id} />);

    expect(screen.getByRole('columnheader', { name: /Name/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Age/i })).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('sorts sortable column on repeated clicks', async () => {
    const user = userEvent.setup();
    render(<Table columns={columns} data={data} getRowKey={(person) => person.id} />);

    await user.click(screen.getByRole('button', { name: /Age/i }));
    expect(getFirstDataRowText()).toEqual(['Alice', '30', 'View']);

    await user.click(screen.getByRole('button', { name: /Age/i }));
    expect(getFirstDataRowText()).toEqual(['Bob', '20', 'View']);
  });

  it('disables sort button for columns without getSortValue', () => {
    render(<Table columns={columns} data={data} getRowKey={(person) => person.id} />);

    expect(screen.getByRole('button', { name: 'Actions' })).toBeDisabled();
  });
});
