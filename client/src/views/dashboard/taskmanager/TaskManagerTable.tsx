import { useContext, useEffect, useMemo, useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  createColumnHelper,
} from '@tanstack/react-table';

import { Button, Tooltip } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import TableComponent from 'src/utils/TableComponent';
import PaginationComponent from 'src/utils/PaginationComponent';
import ComonDeletemodal from 'src/utils/deletemodal/ComonDeletemodal';
import Portal from 'src/utils/Portal';
import { triggerGoogleTranslateRescan } from 'src/utils/triggerTranslateRescan';

import { AppDispatch, RootState } from 'src/store';
import { CustomizerContext } from 'src/context/CustomizerContext';
import { getPermissions } from 'src/utils/getPermissions';

import TaskManagerModal from './TaskManagerModal';
import TaskManagerEditModal from './TaskManagerEditModal';

import { deleteTask, getTask, statusChange } from 'src/features/dashboard/TaskManagerSlice';

interface TaskDataType {
  id: number;
  task_title: string;
  priority: string;
  due_date: string;
  status: string;
  task_description: string;

  users?: {
    id: number;
    username: string;
  };

  assign_task?: {
    id: number;
    username: string;
  };
}

const columnHelper = createColumnHelper<TaskDataType>();

const TaskManagerTable = () => {
  const dispatch = useDispatch<AppDispatch>();

  const logindata = useSelector((state: RootState) => state.authentication?.logindata) as any;

  const { tasks } = useSelector((state: RootState) => state.tasks) as any;

  const [data, setData] = useState<TaskDataType[]>([]);
  const [searchText, setSearchText] = useState('');

  const [modals, setModals] = useState({
    add: false,
    edit: false,
    delete: false,
  });

  const [selectedRow, setSelectedRow] = useState<TaskDataType | null>(null);

  const { selectedIconId } = useContext(CustomizerContext) || {};

  const permissions = useMemo(() => {
    return getPermissions(logindata, selectedIconId, 2);
  }, [logindata, selectedIconId]);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    dispatch(getTask());
  }, [dispatch]);

  useEffect(() => {
    setData(Array.isArray(tasks) ? tasks : []);
  }, [tasks]);

  /* ================= MODAL ================= */

  const handleModal = (type: keyof typeof modals, value: boolean, row?: TaskDataType) => {
    setSelectedRow(row || null);

    setModals((prev) => ({
      ...prev,
      [type]: value,
    }));

    setTimeout(triggerGoogleTranslateRescan, 200);
  };

  /* ================= DELETE ================= */

  const handleConfirmDelete = async () => {
    if (!selectedRow?.id) {
      toast.error('No task selected');
      return;
    }

    try {
      await dispatch(deleteTask(selectedRow.id)).unwrap();

      toast.success('Task deleted successfully ✅');

      dispatch(getTask());

      setData((prev) => prev.filter((item) => item.id !== selectedRow.id));
    } catch (err: any) {
      toast.error(err || 'Delete failed');
    } finally {
      handleModal('delete', false);
    }
  };

  /* ================= PRIORITY BADGE ================= */

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Low':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
            🟢 Low
          </span>
        );

      case 'Medium':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
            🟡 Medium
          </span>
        );

      case 'High':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
            🟠 High
          </span>
        );

      case 'Urgent':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
            🔴 Urgent
          </span>
        );

      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            N/A
          </span>
        );
    }
  };

  /* ================= FILTER ================= */

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      Object.values(item).some((v) =>
        String(v || '')
          .toLowerCase()
          .includes(searchText.toLowerCase()),
      ),
    );
  }, [data, searchText]);

  /* ================= COLUMNS ================= */

  const columns = useMemo(
    () => [
      /* SERIAL */

      columnHelper.accessor('id', {
        header: 'S. No.',

        cell: (info) => <div className="truncate">#{info.row.index + 1}</div>,
      }),

      /* TASK TITLE */

      columnHelper.accessor('task_title', {
        header: 'Task Title',
      }),

      /* ASSIGN TO */

      columnHelper.accessor('assign_task', {
        header: 'Assigned To',

        cell: (info) => <div>{info.row.original.assign_task?.username || '-'}</div>,
      }),

      /* PRIORITY */

      columnHelper.accessor('priority', {
        header: 'Priority',

        cell: (info) => <div>{getPriorityBadge(info.getValue())}</div>,
      }),

      /* DUE DATE */

      columnHelper.accessor('due_date', {
        header: 'Due Date',
      }),

      /* DESCRIPTION */

      columnHelper.accessor('task_description', {
        header: 'Description',

        cell: (info) => (
          <div className="max-w-[300px] whitespace-normal break-words text-sm">
            {info.getValue() || '-'}
          </div>
        ),
      }),

      /* CREATED BY */

      columnHelper.accessor('users', {
        header: 'Created By',

        cell: (info) => <div>{info.row.original.users?.username || '-'}</div>,
      }),

      /* STATUS */

      columnHelper.display({
        id: 'status',

        header: 'Status',

        cell: (info) => {
          const row = info.row.original;

          const handleStatusChange = async (value: string) => {
            try {
              const res = await dispatch(
                statusChange({
                  id: row.id,
                  status: value,
                }),
              ).unwrap();

              toast.success(res?.message || 'Task status updated successfully ✅');

              dispatch(getTask());
            } catch (error: any) {
              toast.error(error || error?.message || 'Failed to update task status');
            }
          };

          return (
            <div className="min-w-[170px]">
              <select
                value={row.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className={`w-full rounded-lg border text-sm font-medium px-3 py-2 focus:outline-none
                  ${
                    row.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                      : row.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-700 border-blue-300'
                        : row.status === 'Completed'
                          ? 'bg-green-100 text-green-700 border-green-300'
                          : row.status === 'Hold'
                            ? 'bg-orange-100 text-orange-700 border-orange-300'
                            : 'bg-red-100 text-red-700 border-red-300'
                  }
                `}
              >
                <option value="Pending">🟡 Pending</option>

                <option value="In Progress">🔵 In Progress</option>

                <option value="Completed">🟢 Completed</option>

                <option value="Hold">🟠 Hold</option>

                <option value="Cancelled">🔴 Cancelled</option>
              </select>
            </div>
          );
        },
      }),

      /* ACTIONS */

      columnHelper.display({
        id: 'actions',

        header: 'Actions',

        cell: (info) => {
          const row = info.row.original;

          return (
            <div className="flex flex-wrap gap-2 justify-center notranslate" translate="no">
              {permissions.edit && (
                <Tooltip content="Edit">
                  <Button
                    size="sm"
                    className="p-0 bg-lightsuccess text-success hover:bg-success hover:text-white"
                    onClick={() => handleModal('edit', true, row)}
                  >
                    <Icon icon="solar:pen-outline" height={18} />
                  </Button>
                </Tooltip>
              )}

              {permissions.del && (
                <Tooltip content="Delete">
                  <Button
                    size="sm"
                    color="failure"
                    className="p-0"
                    onClick={() => handleModal('delete', true, row)}
                  >
                    <Icon icon="solar:trash-bin-minimalistic-outline" height={18} />
                  </Button>
                </Tooltip>
              )}
            </div>
          );
        },
      }),
    ],
    [permissions, dispatch],
  );

  /* ================= TABLE ================= */

  const table = useReactTable({
    data: filteredData,
    columns,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  /* ================= UI ================= */

  return (
    <div className="p-1">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
        {permissions.view && (
          <input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="me-2 p-2 border rounded-md border-gray-300"
          />
        )}

        {permissions.add && (
          <Button
            onClick={() => handleModal('add', true)}
            color="primary"
            outline
            size="sm"
            className="border border-primary bg-primary text-white rounded-md"
          >
            Create New Task
          </Button>
        )}
      </div>

      {permissions.view ? (
        <>
          <div className="w-full overflow-x-auto">
            <div className="min-w-full">
              <TableComponent table={table} flexRender={flexRender} columns={columns} />
            </div>
          </div>

          <PaginationComponent table={table} />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center my-20 space-y-4">
          <Icon
            icon="fluent:person-prohibited-20-filled"
            className="text-red-500"
            width="60"
            height="60"
          />

          <div className="text-red-600 text-xl font-bold text-center px-4">
            You do not have permission to view this table.
          </div>

          <p className="text-sm text-gray-500 text-center px-6">
            Please contact your administrator.
          </p>
        </div>
      )}

      {/* DELETE MODAL */}

      {modals.delete && (
        <Portal>
          <ComonDeletemodal
            isOpen={modals.delete}
            setIsOpen={() => handleModal('delete', false)}
            selectedUser={selectedRow}
            title="Are you sure you want to delete this task?"
            handleConfirmDelete={handleConfirmDelete}
          />
        </Portal>
      )}

      {/* ADD MODAL */}

      {modals.add && (
        <Portal>
          <TaskManagerModal openModal={modals.add} setOpenModal={() => handleModal('add', false)} />
        </Portal>
      )}

      {/* EDIT MODAL */}

      {modals.edit && (
        <Portal>
          <TaskManagerEditModal
            openModal={modals.edit}
            setOpenModal={() => handleModal('edit', false)}
            selectedRow={selectedRow}
          />
        </Portal>
      )}
    </div>
  );
};

export default TaskManagerTable;
