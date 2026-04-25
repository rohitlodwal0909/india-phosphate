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

import CurrentStocks from './CurrentStocks';
import FmIssuedAdd from './FmIssuedAdd';
import FmIssuedEdit from './FmIssuedEdit';
import {
  getIssuedFM,
  deleteIssuedFM,
} from 'src/features/Inventorymodule/InventoryIssued/FMIssuedSlice';

/* =======================
   BMR DATA TYPE
======================= */
interface BmrDataType {
  id: number;
  qc_batch_number: string;
  product_name: string;
  grade: string;
  mfg_date: string;
  exp_date: string;
  total_finish_qty: string;
  total_issued_qty: string;
  remaining_qty: string;
  remark: string;
}

const columnHelper = createColumnHelper<BmrDataType>();

const FmIssuedTable = () => {
  const dispatch = useDispatch<AppDispatch>();

  const storeRawMaterial = useSelector(
    (state: RootState) => state.rmissue.storerm,
  ) as BmrDataType[];

  const logindata = useSelector((state: RootState) => state.authentication?.logindata) as any;

  const { issuedFMList } = useSelector((state: RootState) => state.issuedFM) as any;

  const [searchText, setSearchText] = useState('');

  const [modals, setModals] = useState({
    add: false,
    edit: false,
    view: false,
    delete: false,
  });

  const [selectedRow, setSelectedRow] = useState(null);

  const { selectedIconId } = useContext(CustomizerContext) || {};

  const permissions = useMemo(() => {
    return getPermissions(logindata, selectedIconId, 11);
  }, [logindata, selectedIconId]);

  /* =======================
     FETCH BMR RECORDS
  ======================= */
  useEffect(() => {
    dispatch(getIssuedFM());
  }, [dispatch]);

  /* =======================
     SET DATA (FIXED)
  ======================= */

  const handleModal = (type: keyof typeof modals, value: boolean, row?: BmrDataType) => {
    setSelectedRow(row || null);
    setModals((prev) => ({ ...prev, [type]: value }));
    setTimeout(triggerGoogleTranslateRescan, 200);
  };

  /* =======================
     DELETE
  ======================= */
  const handleConfirmDelete = async () => {
    const id = selectedRow?.finishing?.id;

    try {
      await dispatch(deleteIssuedFM(id)).unwrap();
      toast.success('Finished Material deleted successfully');
      dispatch(getIssuedFM());
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
    return issuedFMList.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [issuedFMList, searchText]);

  /* =======================
     TABLE COLUMNS
  ======================= */
  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'S. No.',
        cell: (info) => <span>#{info.row.index + 1}</span>,
      }),

      columnHelper.accessor((row) => row.qc_batch_number, {
        id: 'qc_batch_number',
        header: 'Batch No.',
        cell: (info) => info.getValue() || '-',
      }),

      columnHelper.accessor('product_name', {
        header: 'Product Name',
      }),

      columnHelper.accessor('grade', {
        header: 'Grade',
      }),
      columnHelper.accessor('mfg_date', {
        header: 'Mfg Date',
      }),
      columnHelper.accessor('exp_date', {
        header: 'Exp Date',
      }),
      columnHelper.accessor('total_finish_qty', {
        header: 'Quantity',
      }),
      columnHelper.accessor('total_issued_qty', {
        header: 'Issued Material',
      }),
      columnHelper.accessor('remaining_qty', {
        header: 'Balance',
      }),
      columnHelper.accessor('remark', {
        header: 'Remark',
      }),

      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="flex gap-2 notranslate" translate="no">
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
            FM Issued
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
            title="Are you sure you want to delete this Finish Material Issued?"
            handleConfirmDelete={handleConfirmDelete}
          />
        </Portal>
      )}

      {modals.add && (
        <Portal>
          <FmIssuedAdd openModal={modals.add} setOpenModal={() => handleModal('add', false)} />
        </Portal>
      )}
      {modals.edit && selectedRow && (
        <Portal>
          <FmIssuedEdit
            openModal={modals.edit}
            data={selectedRow} // ✅ SINGLE ROW
            setOpenModal={() => handleModal('edit', false)}
            storeRawMaterial={storeRawMaterial}
            logindata={logindata}
          />
        </Portal>
      )}

      {modals.view && (
        <Portal>
          <CurrentStocks openModal={modals.view} setOpenModal={() => handleModal('view', false)} />
        </Portal>
      )}
    </div>
  );
};

export default FmIssuedTable;
