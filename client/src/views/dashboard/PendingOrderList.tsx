import React, { useMemo, useState } from 'react';
import { Modal, Badge, Pagination } from 'flowbite-react';

interface PendingOrderListProps {
  open: boolean;
  onClose: () => void;
  data: any[];
}

const ITEMS_PER_PAGE = 10;

const getPriorityColor = (priority: string) => {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'failure';
    case 'medium':
      return 'warning';
    case 'low':
      return 'success';
    default:
      return 'gray';
  }
};

const PendingOrderList: React.FC<PendingOrderListProps> = ({ open, onClose, data = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data?.length / ITEMS_PER_PAGE);

  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return data?.slice(start, start + ITEMS_PER_PAGE);
  }, [data, currentPage]);

  const formatDate = (date: string) => {
    if (!date) return '-';

    const d = new Date(date);

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    return `${String(d.getDate()).padStart(2, '0')}-${months[d.getMonth()]}-${d.getFullYear()}`;
  };

  return (
    <Modal show={open} onClose={onClose} size="7xl">
      <Modal.Header>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Pending Orders</h2>

          <p className="text-sm text-gray-500 mt-1">Total Pending Orders: {data?.length}</p>
        </div>
      </Modal.Header>

      <Modal.Body>
        {data?.length > 0 ? (
          <>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="px-4 py-4 text-left font-semibold text-gray-700">PO No</th>

                    <th className="px-4 py-4 text-left font-semibold text-gray-700">
                      Company Name
                    </th>

                    <th className="px-4 py-4 text-left font-semibold text-gray-700">Priority</th>

                    <th className="px-4 py-4 text-left font-semibold text-gray-700">
                      Delivery Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedTasks.map((order: any) => (
                    <tr key={order.id} className="border-t hover:bg-gray-50 text-gray-900">
                      <td className="px-4 py-4">{order.po_no || '-'}</td>

                      <td className="px-4 py-4">{order.customers.company_name || '-'}</td>

                      <td className="px-4 py-4">
                        <Badge color={getPriorityColor(order.priority)}>
                          {order.priority || '-'}
                        </Badge>
                      </td>

                      <td className="px-4 py-4">{formatDate(order.expected_delivery_date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-5">
                <div className="text-sm text-gray-500">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
                  {Math.min(currentPage * ITEMS_PER_PAGE, data.length)} of {data.length} records
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
          <div className="flex flex-col items-center justify-center py-20">
            <h3 className="text-xl font-semibold text-gray-700">No Pending Orders Found</h3>

            <p className="text-sm text-gray-500 mt-2">All purchase orders have been dispatched.</p>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default PendingOrderList;
