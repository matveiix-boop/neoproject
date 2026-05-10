import { ReactNode, useMemo, useState } from 'react';

import './table.scss';

export type SortDirection = 'asc' | 'desc';

export type TableColumn<T> = {
  key: string;
  title: string;
  render: (item: T) => ReactNode;
  getSortValue?: (item: T) => string | number | Date;
};

type TableProps<T> = {
  columns: TableColumn<T>[];
  data: T[];
  getRowKey: (item: T) => string | number;
  className?: string;
};

const compareValues = (firstValue: string | number | Date, secondValue: string | number | Date) => {
  const first = firstValue instanceof Date ? firstValue.getTime() : firstValue;
  const second = secondValue instanceof Date ? secondValue.getTime() : secondValue;

  if (typeof first === 'number' && typeof second === 'number') {
    return first - second;
  }

  return String(first).localeCompare(String(second));
};

export const Table = <T,>({ columns, data, getRowKey, className = '' }: TableProps<T>) => {
  const [sortDirections, setSortDirections] = useState<Record<string, SortDirection>>(() =>
    Object.fromEntries(columns.map((column) => [column.key, 'asc'])),
  );
  const [activeSortKey, setActiveSortKey] = useState<string | null>(null);
  const classes = ['table-wrap', className].filter(Boolean).join(' ');

  const sortedData = useMemo(() => {
    if (!activeSortKey) {
      return data;
    }

    const activeColumn = columns.find((column) => column.key === activeSortKey);

    if (!activeColumn?.getSortValue) {
      return data;
    }

    const direction = sortDirections[activeSortKey] || 'asc';

    return [...data].sort((firstItem, secondItem) => {
      const result = compareValues(
        activeColumn.getSortValue!(firstItem),
        activeColumn.getSortValue!(secondItem),
      );

      return direction === 'asc' ? result : -result;
    });
  }, [activeSortKey, columns, data, sortDirections]);

  const handleSort = (column: TableColumn<T>) => {
    if (!column.getSortValue) {
      return;
    }

    setSortDirections((currentDirections) => ({
      ...currentDirections,
      [column.key]: currentDirections[column.key] === 'asc' ? 'desc' : 'asc',
    }));
    setActiveSortKey(column.key);
  };

  return (
    <div className={classes}>
      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => {
              const direction = sortDirections[column.key] || 'asc';

              return (
                <th className="table__head-cell" key={column.key} scope="col">
                  <button
                    className="table__sort"
                    type="button"
                    disabled={!column.getSortValue}
                    onClick={() => handleSort(column)}
                  >
                    <span>{column.title}</span>
                    {column.getSortValue && (
                      <span
                        className={`table__arrow table__arrow--${direction}`}
                        aria-label={direction === 'asc' ? 'ascending' : 'descending'}
                      />
                    )}
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item) => (
            <tr className="table__row" key={getRowKey(item)}>
              {columns.map((column) => (
                <td className="table__cell" key={column.key}>
                  {column.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
