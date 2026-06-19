import React, { useMemo, useState, useEffect } from 'react';
import { Modal, Pagination } from 'flowbite-react';

interface DormantCustomerListProps {
  open: boolean;
  onClose: () => void;
  tasks: any[];
}

const ITEMS_PER_PAGE = 10;

const DormantCustomerList: React.FC<DormantCustomerListProps> = ({ open, onClose, tasks = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (open) {
      setCurrentPage(1);
    }
  }, [open]);

  const totalPages = Math.ceil(tasks.length / ITEMS_PER_PAGE);

  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return tasks?.slice(start, start + ITEMS_PER_PAGE);
  }, [tasks, currentPage]);

  return (
    <Modal show={open} onClose={onClose} size="4xl">
      <Modal.Header>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dormant Customers</h2>

          <p className="text-sm text-gray-500 mt-1">Total Customers: {tasks.length}</p>
        </div>
      </Modal.Header>

      <Modal.Body>
        {tasks.length > 0 ? (
          <>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-4 text-left font-semibold text-gray-700 w-20">Sr.</th>

                    <th className="px-4 py-4 text-left font-semibold text-gray-700">
                      Company Name
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedCustomers.map((customer: any, index: number) => (
                    <tr
                      key={customer.id || index}
                      className="border-t hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4 font-medium text-gray-700">
                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                      </td>

                      <td className="px-4 py-4 text-gray-800 font-medium">
                        {customer.company_name || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-5">
                <div className="text-sm text-gray-500">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
                  {Math.min(currentPage * ITEMS_PER_PAGE, tasks.length)} of {tasks.length} records
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  showIcons
                />
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-5xl mb-4">📭</div>

            <h3 className="text-xl font-semibold text-gray-700">No Dormant Customers Found</h3>

            <p className="text-sm text-gray-500 mt-2">
              There are currently no dormant customers available.
            </p>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default DormantCustomerList;
