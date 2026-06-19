import React, { useMemo, useState } from 'react';
import { Modal, Badge, Pagination } from 'flowbite-react';

interface DisputeAlertListProps {
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

const DisputeAlertList: React.FC<DisputeAlertListProps> = ({ open, onClose, data = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const openDisputes = data.filter((item) => {
    const followups = JSON.parse(item.followups || '[]');

    if (!followups.length) return true;

    return followups[followups.length - 1]?.status?.toLowerCase() !== 'closed';
  });

  const totalPages = Math.ceil(openDisputes.length / ITEMS_PER_PAGE);

  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return openDisputes.slice(start, start + ITEMS_PER_PAGE);
  }, [openDisputes, currentPage]);

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
          <h2 className="text-2xl font-bold text-gray-800">Disputes</h2>

          <p className="text-sm text-gray-500 mt-1">Total Disputes: {openDisputes.length}</p>
        </div>
      </Modal.Header>

      <Modal.Body>
        {data.length > 0 ? (
          <>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="px-4 py-4 text-left font-semibold text-gray-700">PO / Sample</th>

                    <th className="px-4 py-4 text-left font-semibold text-gray-700">
                      Dispute Reason
                    </th>

                    <th className="px-4 py-4 text-left font-semibold text-gray-700">Priority</th>

                    <th className="px-4 py-4 text-left font-semibold text-gray-700">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedTasks.map((task: any) => (
                    <tr key={task.id} className="border-t hover:bg-gray-50 text-gray-900">
                      <td className="px-4 py-4">
                        {task.dispute_type === 'po'
                          ? task.purchase_order?.po_no
                          : task.sample_request?.sr_no}
                      </td>

                      <td className="px-4 py-4">{task.dispute_reason || '-'}</td>

                      <td className="px-4 py-4">
                        <Badge color={getPriorityColor(task.priority)}>{task.priority}</Badge>
                      </td>

                      <td className="px-4 py-4">{formatDate(task.created_at)}</td>
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
            <div className="text-6xl mb-4">✅</div>

            <h3 className="text-xl font-semibold text-gray-700">No Pending Tasks Found</h3>

            <p className="text-sm text-gray-500 mt-2">All data are completed successfully.</p>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default DisputeAlertList;
