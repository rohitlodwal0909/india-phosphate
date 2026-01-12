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
import EquipementIssuedAdd from './EquipementIssuedAdd';
import EquipementIssuedEdit from './EquipementIssuedEdit';

import {
  getIssuedEquipment,
  getStoreEquipment,
  deleteIssuedEquipment,
} from 'src/features/Inventorymodule/InventoryIssued/IssueEquipmentSlice';
import CurrentStocks from './CurrentStocks';

/* =======================
   BMR DATA TYPE
======================= */
interface EquipementIssuedType {
  id: number;
  quantity: string;
  person_name: string;
  type: string;
  note: string;
  date: string;
  issueequipment?: {
    id: number;
    name: string;
  };
}

const columnHelper = createColumnHelper<EquipementIssuedType>();

const EquipementIssuedTable = () => {
  const dispatch = useDispatch<AppDispatch>();

  const storeequipments = useSelector(
    (state: RootState) => state.issueEquipment?.storeequipment,
  ) as any;

  const issueequipments = useSelector(
    (state: RootState) => state.issueEquipment.issueequipment ?? [],
  );

  const logindata = useSelector((state: RootState) => state.authentication?.logindata) as any;

  const [searchText, setSearchText] = useState('');

  const [modals, setModals] = useState({
    add: false,
    edit: false,
    view: false,
    delete: false,
  });

  const [selectedRow, setSelectedRow] = useState<EquipementIssuedType | null>(null);

  const { selectedIconId } = useContext(CustomizerContext) || {};

  const permissions = useMemo(() => {
    return getPermissions(logindata, selectedIconId, 11);
  }, [logindata, selectedIconId]);

  /* =======================
     FETCH BMR RECORDS
  ======================= */
  useEffect(() => {
    dispatch(getStoreEquipment());
    dispatch(getIssuedEquipment());
  }, [dispatch]);

  /* =======================
     MODAL HANDLER
  ======================= */
  const handleModal = (type: keyof typeof modals, value: boolean, row?: EquipementIssuedType) => {
    setSelectedRow(row || null);
    setModals((prev) => ({ ...prev, [type]: value }));
    setTimeout(triggerGoogleTranslateRescan, 200);
  };

  /* =======================
     DELETE
  ======================= */
  const handleConfirmDelete = async () => {
    if (!selectedRow?.id) return toast.error('No entry selected');
    const id = selectedRow?.id;
    try {
      dispatch(deleteIssuedEquipment(id));
      toast.success('Issued equipment deleted successfully');
      dispatch(getIssuedEquipment());
      dispatch(getStoreEquipment());
    } catch (err: any) {
      toast.error(err.message || 'Delete failed');
    } finally {
      handleModal('delete', false);
    }
  };

  /* =======================
     SEARCH FILTER
  ======================= */

  const filteredData = useMemo(() => {
    return issueequipments?.filter((item: any) =>
      JSON.stringify(item).toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [issueequipments, searchText]); // ✅ correct dependency

  /* =======================
     TABLE COLUMNS
  ======================= */
  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'S. No.',
        cell: (info) => <span>#{info.row.index + 1}</span>,
      }),

      columnHelper.accessor((row) => row.issueequipment?.name, {
        id: 'name',
        header: 'Name of Equipment',
        cell: (info) => info.getValue() || '-',
      }),

      columnHelper.accessor('quantity', {
        header: 'Quantity',
      }),

      columnHelper.accessor('person_name', {
        header: 'Name of person',
      }),
      columnHelper.accessor('type', {
        header: 'Type',
      }),
      columnHelper.accessor('note', {
        header: 'Note',
      }),
      columnHelper.accessor('date', {
        header: 'Date',
      }),

      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="flex gap-2 notranslate" translate="no">
              {permissions.edit && (
                <Tooltip content="Edit">
                  <Button
                    size="xs"
                    color="success"
                    outline
                    onClick={() => handleModal('edit', true, row)}
                  >
                    <Icon icon="solar:pen-outline" height={18} />
                  </Button>
                </Tooltip>
              )}

              {permissions.del && (
                <Tooltip content="Delete">
                  <Button
                    size="xs"
                    color="failure"
                    outline
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
    [permissions],
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  /* =======================
     JSX
  ======================= */
  return (
    <div className="p-2">
      <div className="flex justify-end mb-2 gap-2">
        {permissions.view && (
          <input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="p-2 border rounded-md"
          />
        )}
        {permissions.view && (
          <Button size="sm" color="success" onClick={() => handleModal('view', true)}>
            Current Stocks
          </Button>
        )}

        {permissions.add && (
          <Button size="sm" color="primary" onClick={() => handleModal('add', true)}>
            Equipment Issued
          </Button>
        )}
      </div>

      {permissions.view ? (
        <>
          <div className="w-full overflow-x-auto">
            <TableComponent table={table} flexRender={flexRender} columns={columns} />
          </div>
          <PaginationComponent table={table} />
        </>
      ) : (
        <div className="text-center text-red-500 mt-20">
          You do not have permission to view this table
        </div>
      )}

      {modals.delete && (
        <Portal>
          <ComonDeletemodal
            isOpen={modals.delete}
            setIsOpen={() => handleModal('delete', false)}
            selectedUser={selectedRow}
            title="Are you sure you want to delete this equipment issued?"
            handleConfirmDelete={handleConfirmDelete}
          />
        </Portal>
      )}

      {modals.add && (
        <Portal>
          <EquipementIssuedAdd
            openModal={modals.add}
            setOpenModal={() => handleModal('add', false)}
            storeequipments={storeequipments?.data}
            logindata={logindata}
          />
        </Portal>
      )}
      {modals.edit && selectedRow && (
        <Portal>
          <EquipementIssuedEdit
            openModal={modals.edit}
            data={selectedRow} // ✅ SINGLE ROW
            setOpenModal={() => handleModal('edit', false)}
            StoreData={storeequipments?.data}
            logindata={logindata}
          />
        </Portal>
      )}
      {modals.view && (
        <Portal>
          <CurrentStocks
            openModal={modals.view}
            setOpenModal={() => handleModal('view', false)}
            storeequipments={storeequipments?.data}
          />
        </Portal>
      )}
    </div>
  );
};

export default EquipementIssuedTable;
