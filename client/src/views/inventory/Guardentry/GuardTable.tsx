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
import { useEffect, useState, useMemo, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteCheckin,
  GetCheckinmodule,
  updateCheckin,
} from 'src/features/Inventorymodule/guardmodule/GuardSlice';

import { triggerGoogleTranslateRescan } from 'src/utils/triggerTranslateRescan';
import { formatDate, formatTime } from 'src/utils/Datetimeformate';
import { toast } from 'react-toastify';
import GuardEditmodal from './GuardEditmodal ';
import ComonDeletemodal from '../../../utils/deletemodal/ComonDeletemodal';
import PaginationComponent from 'src/utils/PaginationComponent';
import ViewGuardModal from './ViewGuardModal';
import TableComponent from 'src/utils/TableComponent';
import GuardAddmodal from './GuardAddmodal';
import { AppDispatch } from 'src/store';
import Portal from 'src/utils/Portal'; // Assuming this is your custom Portal
import { getPermissions } from 'src/utils/getPermissions';
import { CustomizerContext } from 'src/context/CustomizerContext';

const columnHelper = createColumnHelper<any>();

function GuardTable() {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedIconId } = useContext(CustomizerContext) || {};
  const logindata = useSelector((state: any) => state.authentication?.logindata);
  const guardData = useSelector((state: any) => state.checkininventory.checkindata);
  const [data, setData] = useState<any[]>([]);
  const [filters, setFilters] = useState({ guard_type: '' });
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [searchText, setSearchText] = useState(''); // Initialize with empty string
  const [isOpen, setIsOpen] = useState(false);
  const [addModal, setAddmodal] = useState(false);

  useEffect(() => {
    if (logindata?.admin?.id) dispatch(GetCheckinmodule(logindata.admin.id));
  }, [dispatch, logindata?.admin?.id]);

  useEffect(() => {
    setData(Array.isArray(guardData?.data) ? guardData.data : []);
  }, [guardData]);

  const permissions = useMemo(() => {
    return getPermissions(logindata, selectedIconId, 1);
  }, [logindata, selectedIconId]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesGuardType =
        !filters.guard_type ||
        item.guard_type?.toLowerCase().includes(filters.guard_type.toLowerCase());
      const searchMatch =
        !searchText ||
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchText.toLowerCase()),
        );
      return matchesGuardType && searchMatch;
    });
  }, [data, filters, searchText]);

  const handleUpdate = async (updated: any) => {
    try {
      const res = await dispatch(updateCheckin(updated)).unwrap();
      if (res) {
        toast.success(res.message);
        dispatch(GetCheckinmodule(logindata?.admin?.id));
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update entry');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedRow?.id) return toast.error('No entry selected.');
    try {
      const res = await dispatch(
        deleteCheckin({ id: selectedRow.id, user_id: logindata?.admin?.id }),
      ).unwrap();
      if (res) {
        toast.success('Guard entry deleted!');
        setData((prev) => prev.filter((item) => item.id !== selectedRow.id));
      }
    } catch (err: any) {
      toast.error(err.message || 'Delete failed');
    } finally {
      setIsOpen(false);
    }
  };

  const getColumns = (handlers: any) => [
    columnHelper.accessor('inward_number', {
      header: 'Inward Number',
      cell: (info) => (
        <div className="truncate max-w-56">
          <h6 className="text-base">{info.getValue() || '-'}</h6>
        </div>
      ),
    }),
    columnHelper.accessor('name', { header: 'Name', cell: (info) => info.getValue() || '-' }),
    columnHelper.accessor('guard_type', {
      header: 'Guard Type',
      cell: (info) => info.getValue() || '-',
    }),
    columnHelper.accessor('vehicle_number', {
      header: 'Vehicle',
      cell: (info) => info.getValue() || '-',
    }),
    columnHelper.accessor('quantity_net', {
      header: 'Net Quantity',
      cell: (info) => {
        const { quantity_net, quantity_unit } = info.row.original;
        return quantity_net !== null && quantity_net !== undefined
          ? `${quantity_net} ${quantity_unit || ''}`
          : '-';
      },
    }),
    columnHelper.display({
      id: 'entry_date_time',
      header: 'Entry Date Time',
      cell: (info) => {
        const { entry_date, entry_time } = info.row.original;
        const formattedDate = entry_date ? formatDate(entry_date) : '-';
        const formattedTime = entry_time ? formatTime(entry_time) : '-';
        return (
          <div>
            <p>{formattedDate}</p>
            <span>{formattedTime}</span>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => {
        const row = info.row.original;

        return (
          <div className="flex gap-2 notranslate" translate="no">
            {permissions?.edit && (
              <Tooltip content="Edit">
                <Button
                  size="sm"
                  className="p-0 bg-lightsuccess text-success hover:bg-success hover:text-white"
                  onClick={() => handlers.onEdit(row)}
                >
                  <Icon icon="solar:pen-outline" height={18} />
                </Button>
              </Tooltip>
            )}
            <Button
              size="sm"
              title="View"
              color="lightprimary"
              className="p-0"
              onClick={() => handlers.onView(row)}
            >
              <Icon icon="solar:eye-outline" height={18} />
            </Button>
            {permissions?.del && (
              <Tooltip content="Delete">
                <Button
                  size="sm"
                  color="lighterror"
                  className="p-0"
                  onClick={() => handlers.onDelete(row)}
                >
                  <Icon icon="solar:trash-bin-minimalistic-outline" height={18} />
                </Button>
              </Tooltip>
            )}
          </div>
        );
      },
      enableSorting: false,
      enableColumnFilter: false,
    }),
  ];

  const table = useReactTable({
    data: filteredData,
    columns: useMemo(
      () =>
        getColumns({
          onEdit: (row: any) => {
            setSelectedRow(row);
            setEditModal(true);
            setTimeout(triggerGoogleTranslateRescan, 50);
          },
          onView: (row: any) => {
            setSelectedRow(row);
            setViewModal(true);

            setTimeout(() => {
              triggerGoogleTranslateRescan();
            }, 300);
          },
          onDelete: (row: any) => {
            setSelectedRow(row);
            setIsOpen(true);
            setTimeout(triggerGoogleTranslateRescan, 50);
          },
        }),
      [],
    ),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <>
      <div className="search-input flex justify-end mb-3">
        {permissions?.view && (
          <input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="me-2 p-2 border rounded-md border-gray-300"
          />
        )}
        {permissions?.view && (
          <select
            value={filters.guard_type}
            onChange={(e) => setFilters((f) => ({ ...f, guard_type: e.target.value }))}
            className="p-2 border rounded-md border-gray-300 me-2"
          >
            <option value="">Select Guard Type</option>
            <option value="Vehicle">Vehicle</option>
            <option value="Courier">Courier</option>
            <option value="Other">Other</option>
          </select>
        )}
        {permissions?.add && (
          <Button
            color="primary"
            className="border rounded-md"
            onClick={() => {
              setAddmodal(true);
              // --- IMPORTANT CHANGE: Delay triggerGoogleTranslateRescan for Add Modal ---
              setTimeout(triggerGoogleTranslateRescan, 50);
            }}
          >
            <span className="font-medium"> New Entry </span>
          </Button>
        )}
      </div>
      {permissions?.view ? (
        <>
          <div className="overflow-x-auto">
            <TableComponent table={table} flexRender={flexRender} columns={table.getAllColumns()} />
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

      <ComonDeletemodal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        selectedUser={selectedRow}
        title="Are you sure you want to Delete this Guard Entry?"
        handleConfirmDelete={handleConfirmDelete}
      />

      {viewModal && (
        <Portal>
          <ViewGuardModal
            placeModal={viewModal}
            setPlaceModal={setViewModal}
            selectedRow={selectedRow}
            modalPlacement="center"
          />
        </Portal>
      )}

      {editModal && (
        <Portal>
          <GuardEditmodal
            editModal={editModal}
            setEditModal={setEditModal}
            selectedUser={selectedRow}
            modalPlacement="center"
            onUpdateUser={handleUpdate}
            logindata={logindata}
          />
        </Portal>
      )}

      {addModal && (
        <Portal>
          <GuardAddmodal
            setPlaceModal={setAddmodal}
            modalPlacement={'center'}
            placeModal={addModal}
            logindata={logindata}
          />
        </Portal>
      )}
    </>
  );
}

export default GuardTable;
