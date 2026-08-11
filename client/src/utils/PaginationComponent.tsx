// components/PaginationComponent.tsx

import { Table } from '@tanstack/react-table';
import {
  IconChevronsLeft,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsRight,
} from '@tabler/icons-react';
import { Button } from 'flowbite-react';

interface PaginationComponentProps<T> {
  table: Table<T>;
}

function PaginationComponent<T>({ table }: PaginationComponentProps<T>) {
  return (
    <div className="sm:flex py-3 items-center justify-center">
      <div className="sm:flex items-center gap-2 sm:mt-0 mt-3">
        <div className="flex">
          <h2 className="text-gray-700 pe-1">Page</h2>
          <h2 className="font-semibold text-gray-900">
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          | Go to page:
          <input
            type="number"
            min="1"
            max={table.getPageCount()}
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="w-16 form-control-input"
          />
        </div>
        <div className="select-md sm:mt-0 mt-3">
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="border w-20"
          >
            {[10, 15, 20, 25, 50, 100, 200, 500].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 sm:mt-0 mt-3">
          <Button
            size="small"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="bg-lightgray
  text-gray-700
  hover:bg-lightprimary
  dark:bg-dark
  dark:text-gray-300
  dark:hover:bg-lightprimary
  disabled:bg-gray-200
  disabled:text-gray-400
  disabled:opacity-100"
          >
            <IconChevronsLeft size={20} />
          </Button>
          <Button
            size="small"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="
  bg-lightgray
  text-gray-700
  hover:bg-lightprimary
  dark:bg-dark
  dark:text-gray-300
  dark:hover:bg-lightprimary
  disabled:bg-gray-200
  disabled:text-gray-400
  disabled:opacity-100"
          >
            <IconChevronLeft size={20} />
          </Button>
          <Button
            size="small"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="bg-lightgray
  text-gray-700
  hover:bg-lightprimary
  dark:bg-dark
  dark:text-gray-300
  dark:hover:bg-lightprimary
  disabled:bg-gray-200
  disabled:text-gray-400
  disabled:opacity-100"
          >
            <IconChevronRight size={20} />
          </Button>
          <Button
            size="small"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="bg-lightgray
  text-gray-700
  hover:bg-lightprimary
  dark:bg-dark
  dark:text-gray-300
  dark:hover:bg-lightprimary
  disabled:bg-gray-200
  disabled:text-gray-400
  disabled:opacity-100"
          >
            <IconChevronsRight size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PaginationComponent;
