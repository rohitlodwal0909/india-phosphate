import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  createColumnHelper,
} from '@tanstack/react-table';
import { Badge, Button } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { GetCheckinmodule } from 'src/features/Inventorymodule/guardmodule/GuardSlice';
import {
  deleteStore,
  GetStoremodule,
  ShowStore,
} from 'src/features/Inventorymodule/storemodule/StoreInventorySlice';
import { triggerGoogleTranslateRescan } from 'src/utils/triggerTranslateRescan';
import ComonDeletemodal from 'src/utils/deletemodal/ComonDeletemodal';
import PaginationComponent from 'src/utils/PaginationComponent';
import TableComponent from 'src/utils/TableComponent';
import StoreInventoryAddmodal from './StoreInventoryAddmodal';
import ViewStoremodel from './ViewStoremodel';
import { AppDispatch, RootState } from 'src/store';
import Portal from 'src/utils/Portal';
import { GetSupplier } from 'src/features/master/Supplier/SupplierSlice';
import { GetExistingCustomer } from 'src/features/master/Customer/CustomerSlice';
import { CustomizerContext } from 'src/context/CustomizerContext';
import { getPermissions } from 'src/utils/getPermissions';
import { GetPmCode } from 'src/features/master/PmCode/PmCodeSlice';
import { GetEquipment } from 'src/features/master/Equipment/EquipmentSlice';
import { formatDate, formatTime } from 'src/utils/Datetimeformate';
import RMStockTrackingModal from '../inventory-issued/rm-issued/RMStockTrackingModal';

const columnHelper = createColumnHelper<any>();

const GRNEntryTable: React.FC = () => {
  const [modals, setModals] = useState({ delete: false, addEdit: false, view: false });
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [filters, setFilters] = useState({ guard_type: '' });
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [selectedRM, setSelectedRM] = useState<{ id: number; name: string } | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const guardData = useSelector((state: RootState) => state.checkininventory.checkindata) as any;

  const StoreData = useSelector((state: RootState) => state.storeinventory.storedata) as any;
  const logindata = useSelector((state: RootState) => state.authentication?.logindata) as any;
  const pmCodes = useSelector((state: RootState) => state.pmcodes.pmcodedata) as any;
  const equipments = useSelector((state: RootState) => state.equipment.Equipmentdata) as any;

  const { supplierdata } = useSelector((state: any) => state.supplier);
  const { existscustomer } = useSelector((state: any) => state.customer);
  const { selectedIconId } = useContext(CustomizerContext) || {};

  const permissions = useMemo(() => {
    return getPermissions(logindata, selectedIconId, 2);
  }, [logindata, selectedIconId]);

  useEffect(() => {
    if (logindata?.admin?.id) {
      dispatch(GetCheckinmodule(logindata.admin.id));
      dispatch(GetStoremodule());
      dispatch(GetSupplier());
      dispatch(GetExistingCustomer());
      dispatch(GetPmCode());
      dispatch(GetEquipment());
    }
  }, [dispatch, logindata?.admin?.id]);

  useEffect(() => {
    if (Array.isArray(guardData?.data)) {
      setData(guardData.data);
    } else {
      setData([]);
    }
  }, [guardData]);

  const openModal = (type: keyof typeof modals, row?: any, delay = 200) => {
    setSelectedRow(row || null);
    setModals((prev) => ({ ...prev, [type]: true }));
    setTimeout(triggerGoogleTranslateRescan, delay);
  };

  const closeModal = (type: keyof typeof modals) => {
    setModals((prev) => ({ ...prev, [type]: false }));
    // setTimeout(triggerGoogleTranslateRescan, delay);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRow?.id) return toast.error('No entry selected for deletion.');
    try {
      const matched = StoreData?.data?.find((i) => i.guard_entry_id === selectedRow?.id);

      await dispatch(deleteStore({ id: matched?.id, user_id: logindata?.admin?.id })).unwrap();
      dispatch(GetCheckinmodule(logindata.admin.id));
      dispatch(GetStoremodule());
      toast.success('Store entry deleted');
    } catch (err: any) {
      toast.error(err.message || 'Delete failed');
    } finally {
      closeModal('delete');
    }
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const entry = item?.grn_entries?.[0];
      const storeEntry = StoreData?.data?.find(
        (stored: any) => stored?.guard_entry_id === item?.id,
      );

      const searchFields = [
        item?.inward_number,
        item?.guard_type,
        entry?.rmcode?.rm_code,
        entry?.pm_code?.name,
        storeEntry?.equipments?.name,
        entry?.quantity,
        entry?.unit,
        entry?.qa_qc_status,
        entry?.grn_date,
        entry?.grn_time,
      ]
        .join(' ')
        .toLowerCase();

      const matchSearch = searchFields.includes(searchText.toLowerCase());

      const matchType =
        !filters.guard_type || item.guard_type?.toLowerCase() === filters.guard_type.toLowerCase();

      return matchSearch && matchType;
    });
  }, [data, searchText, filters, StoreData]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('inward_number', {
        header: 'Inward Number',
        cell: (info) => (
          <div className="truncate max-w-56 text-base">
            {' '}
            <h6 className="text-base">{info.getValue() || '-'}</h6>
          </div>
        ),
      }),
      columnHelper.accessor('guard_type', {
        header: 'Vehical Type',
        cell: (info) => info.getValue() || '-',
      }),
      columnHelper.accessor('rmcode', {
        header: 'Category',
        cell: (info) => {
          const row = info?.row?.original?.grn_entries[0];
          if (!row) return '-';

          if (!row?.rmcode?.id) return row?.rmcode?.rm_code || '-';
          return (
            <button type="button" className="text-primary underline" onClick={() => setSelectedRM({ id: row.rmcode.id, name: row.rmcode.name || row.rmcode.rm_code })}>
              {row.rmcode.rm_code || row.rmcode.name || 'Open RM stock'}
            </button>
          );
        },
      }),
      columnHelper.accessor('pmcode', {
        header: 'PM Name',
        cell: (info) => {
          const row = info?.row?.original?.grn_entries[0];
          if (!row) return '-';

          return row?.pm_code?.name || '-';
        },
      }),
      columnHelper.accessor('equipment', {
        header: 'Equipment',
        cell: (info) => {
          const guardEntry = info?.row?.original;
          const storeEntry = StoreData?.data?.find(
            (entry: any) => entry?.guard_entry_id === guardEntry?.id,
          );
          return storeEntry?.equipments?.name || '-';
        },
      }),

      columnHelper.accessor('quantity_net', {
        header: 'Net Quantity',
        cell: (info) => {
          const row = info?.row?.original?.grn_entries[0];
          if (!row) return '-';

          return row ? `${row.quantity || '-'} ${row.unit || ''}` : '-';
        },
      }),
      columnHelper.display({
        id: 'entry_date_time',
        header: 'Entry Date Time',
        cell: (info) => {
          const data = info?.row?.original?.grn_entries[0];
          const formattedDate = data?.grn_date ? formatDate(data?.grn_date) : '-';
          const formattedTime = data?.grn_time ? formatTime(data?.grn_time) : '-';
          return (
            <div>
              <p>{formattedDate}</p>
              <span>{formattedTime}</span>
            </div>
          );
        },
      }),

      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => {
          const row = info?.row?.original?.grn_entries[0];
          if (!row) return '-';
          const status = row?.qa_qc_status || 'NEW';
          const colors: Record<string, string> = {
            NEW: 'secondary',
            PENDING: 'warning',
            APPROVED: 'primary',
            REJECTED: 'error',
            HOLD: 'success',
          };
          return (
            <Badge color={colors[status.toUpperCase()] || 'secondary'} className="capitalize">
              {status}
            </Badge>
          );
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => {
          const row = info?.row?.original;
          if (!row) return null;

          const storeItem = Array.isArray(StoreData?.data)
            ? StoreData.data.find((item) => item?.guard_entry_id === row?.id)
            : null;
          const isCheck = row?.grn_entries.length === 1 ? true : false;

          return (
            <div className="flex gap-2">
              {!storeItem && permissions?.add && (
                <Button
                  size="sm"
                  className="p-0 bg-lightsuccess text-success hover:bg-success hover:text-white"
                  onClick={() => {
                    openModal('addEdit', row);
                  }}
                >
                  <Icon icon="material-symbols:add-rounded" height={18} />
                </Button>
              )}

              {storeItem && permissions?.view && (
                <Button
                  size="sm"
                  color="lightprimary"
                  className="p-0"
                  onClick={() => handleView(row)}
                  title="View Store Entry"
                >
                  <Icon icon="solar:eye-outline" height={18} />
                </Button>
              )}

              {isCheck && permissions?.del && (
                <Button
                  size="sm"
                  color="lighterror"
                  className="p-0"
                  onClick={() => openModal('delete', row)}
                  title="Delete Guard Entry"
                >
                  <Icon icon="solar:trash-bin-minimalistic-outline" height={18} />
                </Button>
              )}
            </div>
          );
        },
        enableSorting: false,
        enableColumnFilter: false,
      }),
    ],
    [StoreData, logindata],
  );

  const handleView = async (row: any) => {
    openModal('view', null, 400);
    try {
      const res = await dispatch(ShowStore(row.id)).unwrap();
      setSelectedRow(res?.data);
      setTimeout(triggerGoogleTranslateRescan, 200);
    } catch {
      toast.error('Failed to fetch store details.');
    }
  };

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return permissions?.view ? (
    <>
      <div className="flex justify-end mb-3">
        <input
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="me-2 p-2 border rounded-md border-gray-300"
        />
        <select
          value={filters.guard_type}
          onChange={(e) => setFilters({ ...filters, guard_type: e.target.value })}
          className="p-2 border rounded-md border-gray-300"
        >
          <option value="">Select Vehical Type</option>
          <option value="Vehicle">Vehicle</option>
          <option value="Courier">Courier</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <TableComponent table={table} flexRender={flexRender} columns={columns} />
      </div>
      <PaginationComponent table={table} />

      {modals.delete && (
        <Portal>
          <ComonDeletemodal
            isOpen
            setIsOpen={() => closeModal('delete')}
            selectedUser={selectedRow}
            title="Are you sure you want to Delete this Store Entry?"
            handleConfirmDelete={handleDeleteConfirm}
          />
        </Portal>
      )}
      {modals.addEdit && (
        <Portal>
          <StoreInventoryAddmodal
            setPlaceModal={() => closeModal('addEdit')}
            modalPlacement="center"
            pmCodes={pmCodes}
            equipments={equipments}
            selectedRow={selectedRow}
            placeModal
            logindata={logindata}
            supplierdata={supplierdata}
            customerdata={existscustomer}
          />
        </Portal>
      )}
      {modals.view && (
        <Portal>
          <ViewStoremodel
            setPlaceModal={() => closeModal('view')}
            modalPlacement="center"
            selectedRow={selectedRow}
            placeModal
            supplierdata={supplierdata}
            customerdata={existscustomer}
          />
        </Portal>
      )}
      <RMStockTrackingModal open={Boolean(selectedRM)} onClose={() => setSelectedRM(null)} rmId={selectedRM?.id || null} rmName={selectedRM?.name || ''} />
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
        Please contact your administrator if you believe this is an error.
      </p>
    </div>
  );
};

export default GRNEntryTable;
