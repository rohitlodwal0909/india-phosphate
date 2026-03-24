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
import { deleteDispatch } from 'src/features/Inventorymodule/dispatchmodule/DispatchSlice';
import { CustomizerContext } from 'src/context/CustomizerContext';
import { getPermissions } from 'src/utils/getPermissions';
import ReplacementModal from './ReplacementModal';
import { getReplacement } from 'src/features/Inventorymodule/replacement/ReplacementSlice';

interface DispatchDataType {
  id: number;
  invoices?: {
    invoice_no?: string;
  };
  replacement_type: string;
  quantity: string;
  replacement_choice: string;
  credit_note: string;
  created_at: string;
}

const columnHelper = createColumnHelper<DispatchDataType>();

const ReplacementTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const logindata = useSelector((state: RootState) => state.authentication?.logindata) as any;
  const replacements = useSelector((state: any) => state.replacements.replacement);

  const [searchText, setSearchText] = useState('');
  const [modals, setModals] = useState({ add: false, edit: false, view: false, delete: false });
  const [selectedRow, setSelectedRow] = useState<DispatchDataType | null>(null);

  const { selectedIconId } = useContext(CustomizerContext) || {};
  const permissions = useMemo(() => {
    return getPermissions(logindata, selectedIconId, 12);
  }, [logindata, selectedIconId]);

  useEffect(() => {
    dispatch(getReplacement());
  }, [dispatch]);

  const handleModal = (type: keyof typeof modals, value: boolean, row?: DispatchDataType) => {
    setSelectedRow(row || null);
    setModals((prev) => ({ ...prev, [type]: value }));
    setTimeout(triggerGoogleTranslateRescan, 200);
  };

  const handleConfirmDelete = async () => {
    if (!selectedRow?.id) return toast.error('No entry selected.');
    try {
      await dispatch(deleteDispatch(selectedRow.id)).unwrap();
      toast.success('Dispatch entry deleted successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Delete failed');
    } finally {
      handleModal('delete', false);
    }
  };

  // const handleUpdate = async (rowdata: DispatchDataType) => {
  //   try {
  //     await dispatch(updateDispatch(rowdata)).unwrap();
  //     toast.success('Dispatch entry updated successfully.');
  //     dispatch(GetFetchDispatch());
  //   } catch (err: any) {
  //     toast.error(err.message || 'Failed to update entry');
  //   } finally {
  //     handleModal('edit', false);
  //   }
  // };

  const filteredData = useMemo(() => {
    return replacements.filter((item: any) => {
      const search = searchText.toLowerCase();

      return (
        String(item.id || '')
          .toLowerCase()
          .includes(search) ||
        String(item.replacement_type || '')
          .toLowerCase()
          .includes(search) ||
        String(item.quantity || '')
          .toLowerCase()
          .includes(search) ||
        String(item.replacement_choice || '')
          .toLowerCase()
          .includes(search) ||
        String(item.credit_note || '')
          .toLowerCase()
          .includes(search) ||
        String(item.created_at || '')
          .toLowerCase()
          .includes(search) ||
        // ✅ FIX: nested invoice search
        String(item.invoices?.invoice_no || '')
          .toLowerCase()
          .includes(search)
      );
    });
  }, [replacements, searchText]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'S. No.',
        cell: (info) => (
          <div className="truncate max-w-56">
            <h6 className="text-base">#{info.row.index + 1}</h6>
          </div>
        ),
      }),
      columnHelper.display({
        id: 'invoice_no',
        header: 'Invoice No.',
        cell: (info) => (
          <div className="">
            <p className="text-base">{info.row.original.invoices?.invoice_no || '-'}</p>
          </div>
        ),
      }),
      columnHelper.accessor('replacement_type', { header: 'Replacement type' }),
      columnHelper.accessor('quantity', { header: 'Quantity (Unit)' }),
      columnHelper.accessor('replacement_choice', { header: 'Replacement Choice' }),
      columnHelper.accessor('credit_note', { header: 'Note' }),
      columnHelper.accessor('created_at', {
        header: 'Date',
        cell: (info) => (
          <div className="whitespace-nowrap">{new Date(info.getValue()).toLocaleDateString()}</div>
        ),
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
                    color="lighterror"
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
    [permissions, replacements],
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

  return (
    <div className="p-1">
      <div className="flex justify-end mb-2">
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
            Replacement Entry
          </Button>
        )}
      </div>
      {permissions.view ? (
        <>
          <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
            <div className="min-w-[900px]">
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

      {modals.delete && (
        <Portal>
          <ComonDeletemodal
            isOpen={modals.delete}
            setIsOpen={() => handleModal('delete', false)}
            selectedUser={selectedRow}
            title="Are you sure you want to Delete this Dispatch Entry ?"
            handleConfirmDelete={handleConfirmDelete}
          />
        </Portal>
      )}

      {modals.add && (
        <Portal>
          <ReplacementModal openModal={modals.add} setOpenModal={() => handleModal('add', false)} />
        </Portal>
      )}
    </div>
  );
};

export default ReplacementTable;
