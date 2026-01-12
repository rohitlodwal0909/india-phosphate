import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  createColumnHelper,
} from '@tanstack/react-table';
import { Badge, Button, Tooltip } from 'flowbite-react';

import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import s1 from '../../../src/assets/images/profile/user-1.jpg';
import Deleteusermodal from './Deleteusermodal';
import Editusermodal from './Editusermodal';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteUser,
  GetUsermodule,
  updateUser,
} from 'src/features/usermanagment/UsermanagmentSlice';
import { triggerGoogleTranslateRescan } from 'src/utils/triggerTranslateRescan';
import { toast } from 'react-toastify';
import PaginationComponent from 'src/utils/PaginationComponent';
import noData from '../../../src/assets/images/svgs/no-data.webp';
import { AppDispatch } from 'src/store';
export interface PaginationTableType {
  id?: string;
  avatar?: string | any;
  username?: string;
  email?: string;
  status?: any;
  password?: string;
  role_id?: any;
}

const columnHelper = createColumnHelper<PaginationTableType>();

function PaginationTable({ roleData }) {
  const [columnFilters, setColumnFilters] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const users = useSelector((state: any) => state.usermanagement.userdata);
  const [data, setData] = useState<PaginationTableType[]>(users);
  const [selectedRow, setSelectedRow] = useState<PaginationTableType | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const [editModal, setEditModal] = useState(false);
  let modalPlacement = 'center';

  const handleEdit = (row: PaginationTableType) => {
    triggerGoogleTranslateRescan();
    setSelectedRow(row);
    setEditModal(true);
  };
  useEffect(() => {
    setData(users);
  }, [users]);

  useEffect(() => {
    dispatch(GetUsermodule());
  }, []);

  const handleupdateuser = async (formPayload) => {
    try {
      const res = await dispatch(updateUser(formPayload)).unwrap();
      toast.success(res.message || 'User updated successfully');
      dispatch(GetUsermodule());
      setEditModal(false);
    } catch (err) {
      toast.error(err.message);
    }
  };
  const handleDelete = (row: PaginationTableType) => {
    triggerGoogleTranslateRescan();
    setSelectedRow(row);
    setIsOpen(true);
  };
  const handleConfirmDelete = async (userToDelete: PaginationTableType | null) => {
    if (!userToDelete) return;

    try {
      await dispatch(deleteUser(userToDelete?.id)).unwrap(); // unwrap to catch errors

      // On success
      const updatedData = data.filter((user) => user.id !== userToDelete.id);
      setData(updatedData);
      toast.success('User deleted successfully');
    } catch (error: any) {
      console.error('Delete failed:', error);

      if (error?.response?.status === 404) {
        toast.error('User not found.');
      } else if (error?.response?.status === 500) {
        toast.error('Server error. Try again later.');
      } else {
        toast.error('Failed to delete user.');
      }
    }
  };

  const columns = [
    columnHelper.accessor('username', {
      cell: (info) => (
        <div className="flex gap-3 items-center">
          <img src={s1} width={50} height={50} alt="icon" className="h-10 w-10 rounded-md" />
          <div className="truncate line-clamp-2 max-w-56">
            <h6 className="text-base">{info.row.original.username}</h6>
            <p className="text-sm text-darklink dark:text-bodytext">{info.row.original.email}</p>
          </div>
        </div>
      ),
      header: () => <span>User </span>,
    }),
    columnHelper.accessor('status', {
      cell: (info) => (
        <div className="flex gap-2">
          <Badge
            color={info.row.original.status === 'active' ? `lightprimary` : 'lightwarning'}
            className="capitalize"
          >
            {info.row.original.status}
          </Badge>
        </div>
      ),
      header: () => <span>Status</span>,
    }),
    columnHelper.accessor('role_id', {
      cell: (info) => {
        const roleId = info.getValue();

        // Find matching role name from Redux state
        const roleName =
          roleData?.roles?.find((role: any) => role.id === roleId)?.name || 'Unknown';

        return <p className="text-darklink dark:text-bodytext text-sm">{roleName}</p>;
      },
      header: () => <span>Role</span>,
    }),
    columnHelper.accessor('actions', {
      cell: (info) => {
        const rowData = info.row.original;

        return (
          <div className="flex justify-start  item-center gap-2">
            {' '}
            {/* Reduced gap for more compact buttons */}
            <Tooltip content="Edit " placement="bottom">
              <Button
                size="sm"
                className="p-0 bg-lightsuccess text-success hover:bg-success hover:text-white"
                onClick={() => handleEdit(rowData)}
              >
                <Icon icon="solar:pen-outline" height={18} />
              </Button>
            </Tooltip>
            {rowData?.role_id !== 1 && (
              <Tooltip content="Delete " placement="bottom">
                <Button
                  size="sm"
                  color={'lighterror'}
                  className="p-0"
                  onClick={() => handleDelete(rowData)}
                >
                  <Icon icon="solar:trash-bin-minimalistic-outline" height={18} />
                </Button>
              </Tooltip>
            )}
          </div>
        );
      },
      header: () => <span> Action</span>,
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    filterFns: {},
    state: { columnFilters },
    onColumnFiltersChange: (filters: any) => setColumnFilters(filters),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <div className="border rounded-md border-ld overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full  divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="text-base font-semibold py-3 text-left border-b px-4 text-gray-700 dark:text-gray-200"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="bg-white dark:bg-gray-900">
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center py-8 px-4">
                    <div className="flex flex-col items-center">
                      <img src={noData} alt="No data" height={100} width={100} className="mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">No data available</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <PaginationComponent table={table} />
      </div>
      {/* Delete Modal */}
      <Deleteusermodal
        handleConfirmDelete={handleConfirmDelete}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        selectedUser={selectedRow}
      />
      <Editusermodal
        setEditModal={setEditModal}
        editModal={editModal}
        selectedUser={selectedRow}
        modalPlacement={modalPlacement}
        onUpdateUser={handleupdateuser}
      />
    </>
  );
}

export default PaginationTable;
