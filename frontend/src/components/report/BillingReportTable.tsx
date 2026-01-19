import type { KeyboardEvent, MouseEvent } from 'react';
import type { UsageItem } from '../../model/types';
import { useUsageTable } from './hooks/useUsageTable';
import { flexRender, type SortDirection } from '@tanstack/react-table';

import './BillingReportTable.css';

const SORTING_INDICATORS: Record<SortDirection, string> = {
  asc: ' 🔼',
  desc: ' 🔽',
};

function getSortingIndicator(dir: false | SortDirection): string | null {
  return typeof dir === 'boolean' ? null : SORTING_INDICATORS[dir];
}

function getAriaSortValues(
  dir: false | SortDirection,
): 'ascending' | 'descending' | 'none' {
  if (dir === 'asc') {
    return 'ascending';
  }
  if (dir === 'desc') {
    return 'descending';
  }
  return 'none';
}

const ENTERY_KEY = 'Enter';
const SPACE_KEY = ' ';

type Props = {
  data: UsageItem[];
};

const BillingReportTable = ({ data }: Props) => {
  const table = useUsageTable(data);

  return (
    <div className="table-container">
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort();

                const handleClick = canSort
                  ? (event: MouseEvent<HTMLTableCellElement>) =>
                      header.column.toggleSorting(undefined, event.shiftKey)
                  : undefined;

                const handleKeyDown = canSort
                  ? (event: KeyboardEvent<HTMLTableCellElement>) => {
                      if (event.key === ENTERY_KEY || event.key === SPACE_KEY) {
                        event.preventDefault();
                        event.stopPropagation();

                        header.column.toggleSorting(undefined, event.shiftKey);
                      }
                    }
                  : undefined;

                return (
                  <th
                    key={header.id}
                    scope="col"
                    role={canSort ? 'button' : undefined}
                    onClick={handleClick}
                    onKeyDown={handleKeyDown}
                    tabIndex={canSort ? 0 : undefined}
                    aria-sort={
                      canSort
                        ? getAriaSortValues(header.column.getIsSorted())
                        : undefined
                    }
                    style={{ cursor: canSort ? 'pointer' : 'default' }}>
                    {/* Column name */}
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}

                    {/* Sorting indicator */}
                    {canSort &&
                      getSortingIndicator(header.column.getIsSorted())}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BillingReportTable;
