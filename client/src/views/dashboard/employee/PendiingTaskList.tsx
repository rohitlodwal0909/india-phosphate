import React, { useMemo, useState } from 'react';
import { Modal, Badge, Pagination } from 'flowbite-react';

interface PendingTaskListProps {
  open: boolean;
  onClose: () => void;
  tasks: any[];
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

const PendingTaskList: React.FC<PendingTaskListProps> = ({ open, onClose, tasks = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(tasks.length / ITEMS_PER_PAGE);

  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return tasks.slice(start, start + ITEMS_PER_PAGE);
  }, [tasks, currentPage]);

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
          <h2 className="text-2xl font-bold text-gray-800">Pending Errors / Tasks</h2>

          <p className="text-sm text-gray-500 mt-1">Total Pending Tasks: {tasks.length}</p>
        </div>
      </Modal.Header>

      <Modal.Body>
        {tasks.length > 0 ? (
          <>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="px-4 py-4 text-left font-semibold text-gray-700 w-16">Sr.</th>

                    <th className="px-4 py-4 text-left font-semibold text-gray-700">Task Name</th>

                    <th className="px-4 py-4 text-left font-semibold text-gray-700">Priority</th>

                    <th className="px-4 py-4 text-left font-semibold text-gray-700">Due Date</th>

                    <th className="px-4 py-4 text-left font-semibold text-gray-700">Assigned To</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedTasks.map((task: any, index: number) => (
                    <tr key={task.id} className="border-t hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 font-medium text-gray-700">
                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                      </td>

                      <td className="px-4 py-4">
                        <div className="font-semibold text-gray-800">
                          {task.task_title || task.title || '-'}
                        </div>

                        {task.description && (
                          <div className="text-xs text-gray-500 mt-1">{task.description}</div>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <Badge color={getPriorityColor(task.priority)}>
                          {task.priority || 'Medium'}
                        </Badge>
                      </td>

                      <td className="px-4 py-4 text-gray-700">
                        {task.due_date ? formatDate(task.due_date) : '-'}{' '}
                      </td>

                      <td className="px-4 py-4 text-gray-700">
                        {task.assign_task?.username || '-'}
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
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-4">✅</div>

            <h3 className="text-xl font-semibold text-gray-700">No Pending Tasks Found</h3>

            <p className="text-sm text-gray-500 mt-2">All tasks are completed successfully.</p>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default PendingTaskList;
