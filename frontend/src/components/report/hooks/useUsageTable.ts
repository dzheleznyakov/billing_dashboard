'use no memo';

import {
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type CellContext,
  type Table,
} from '@tanstack/react-table';
import type { UsageItem } from '../../../model/types';
import { formatTimestamp } from '../../../utils/date';
import { useEffect, useState } from 'react';
import { queryParamToSorting, sortingToQueryParam } from '../utils/sorting';

const columns = [
  {
    accessorKey: 'message_id',
    header: 'Message ID',
    enableSorting: false,
  },
  {
    accessorKey: 'timestamp',
    header: 'Timestamp',
    enableSorting: false,
    cell: (info: CellContext<UsageItem, string>) =>
      formatTimestamp(info.getValue()),
  },
  {
    accessorKey: 'report_name',
    header: 'Report Name',
    enableSorting: true,
  },
  {
    accessorKey: 'credits_used',
    header: 'Credits Used',
    enableSorting: true,
    cell: (info: CellContext<UsageItem, number>) => info.getValue().toFixed(2),
  },
];

function initSortingState(): SortingState {
  const sortableColumns = columns
    .filter(({ enableSorting }) => enableSorting)
    .map(({ accessorKey }) => accessorKey);
  return queryParamToSorting(new Set(sortableColumns));
}

export function useUsageTable(data: UsageItem[]): Table<UsageItem> {
  const [sorting, setSorting] = useState<SortingState>(initSortingState);

  // Syncronise sorting with URL param
  useEffect(() => {
    sortingToQueryParam(sorting);
  }, [sorting]);

  /*
    React Compiler note:
    TanStack Table's 'useReactTable' returns functions that are not safe for React Compiler memoization.
    We opt out for this module via 'use no memo' directive.
  */
  // eslint-disable-next-line react-hooks/incompatible-library
  return useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
}
