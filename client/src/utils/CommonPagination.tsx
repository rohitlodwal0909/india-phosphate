// components/CommonPagination.tsx
import { Button } from "flowbite-react";
import { IconChevronLeft, IconChevronsLeft, IconChevronRight, IconChevronsRight } from "@tabler/icons-react";

const CommonPagination = ({
  currentPage,
  totalPages,
  pageSize,
  setCurrentPage,
  setPageSize,
}) => {
  return (
    <div className="sm:flex py-3 items-center justify-center">
      <div className="sm:flex items-center gap-2 sm:mt-0 mt-3">
        <div className="flex">
          <h2 className="text-gray-700 pe-1">Page</h2>
          <h2 className="font-semibold text-gray-900">
            {currentPage} of {totalPages}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          | Go to page:
          <input
            type="number"
            min={1}
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              const page = Number(e.target.value);
              if (page >= 1 && page <= totalPages) setCurrentPage(page);
            }}
            className="w-16 border border-gray-300 rounded px-2 py-1 text-sm"
          />
        </div>

        <div className="select-md sm:mt-0 mt-3">
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border w-20 px-2 py-1 text-sm rounded"
          >
            {[10, 15, 20, 25].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 sm:mt-0 mt-3">
          <Button
            size="small"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="bg-lightgray dark:bg-dark hover:bg-lightprimary dark:hover:bg-lightprimary disabled:opacity-50"
          >
            <IconChevronsLeft size={20} className="text-gray-900 dark:text-gray-300" />
          </Button>
          <Button
            size="small"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="bg-lightgray dark:bg-dark hover:bg-lightprimary dark:hover:bg-lightprimary disabled:opacity-50"
          >
            <IconChevronLeft size={20} className="text-gray-900 dark:text-gray-300" />
          </Button>
          <Button
            size="small"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="bg-lightgray dark:bg-dark hover:bg-lightprimary dark:hover:bg-lightprimary disabled:opacity-50"
          >
            <IconChevronRight size={20} className="text-gray-900 dark:text-gray-300" />
          </Button>
          <Button
            size="small"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="bg-lightgray dark:bg-dark hover:bg-lightprimary dark:hover:bg-lightprimary disabled:opacity-70"
          >
            <IconChevronsRight size={20} className="text-gray-900 dark:text-gray-300"/>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommonPagination;
