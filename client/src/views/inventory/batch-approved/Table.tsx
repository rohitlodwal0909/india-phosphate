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

import { triggerGoogleTranslateRescan } from 'src/utils/triggerTranslateRescan';
import { toast } from 'react-toastify';

import PaginationComponent from 'src/utils/PaginationComponent';
import TableComponent from 'src/utils/TableComponent';
import { AppDispatch } from 'src/store';
import Portal from 'src/utils/Portal';
import { getPermissions } from 'src/utils/getPermissions';
import { CustomizerContext } from 'src/context/CustomizerContext';
import Addmodal from './Addmodal';
import {
  GetAllQcbatch,
  batchStatusChange,
} from 'src/features/Inventorymodule/Qcinventorymodule/QcinventorySlice';

const columnHelper = createColumnHelper<any>();

function Table() {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedIconId } = useContext(CustomizerContext) || {};
  const logindata = useSelector((state: any) => state.authentication?.logindata);
  const batchrecord = useSelector((state: any) => state.qcinventory.qcbatchdata);

  const [data, setData] = useState<any[]>([]);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [searchText, setSearchText] = useState('');
  const [addModal, setAddmodal] = useState(false);
  const [onreload, setOnreload] = useState(false);

  // ✅ Status change handler
  const onhandleStatusChange = async (row: any) => {
    const id = row?.id;
    if (!id) return;

    try {
      const updated = await dispatch(batchStatusChange(id)).unwrap();
      if (updated) {
        toast.success('Status updated successfully!');
        setOnreload(true);
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update status');
    }
  };

  // ✅ Fetch QC batches (refetch on reload)
  useEffect(() => {
    dispatch(GetAllQcbatch())
      .unwrap()
      .catch((error) => {
        console.error('Error fetching QC batches:', error);
      });
    setOnreload(false);
  }, [dispatch, onreload]);

  // ✅ Sync redux state → local data
  useEffect(() => {
    setData(Array.isArray(batchrecord?.data) ? batchrecord.data : []);
  }, [batchrecord]);

  const permissions = useMemo(() => {
    return getPermissions(logindata, selectedIconId, 7);
  }, [logindata, selectedIconId]);

  // ✅ Search + filter
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const searchMatch =
        !searchText ||
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchText.toLowerCase()),
        );
      return searchMatch;
    });
  }, [data, searchText]);

  // ✅ Columns
  const getColumns = (handlers: any) => [
    columnHelper.accessor('qc_batch_number', {
      header: 'Batch Number',
      cell: (info) => (
        <div className="truncate max-w-56">
          <h6 className="text-base">{info.getValue() || '-'}</h6>
        </div>
      ),
    }),
    columnHelper.accessor('product_name', {
      header: 'Product Name',
      cell: (info) => info.getValue() || '-',
    }),
    columnHelper.accessor('mfg_date', {
      header: 'Mfg Date',
      cell: (info) => info.getValue() || '-',
    }),
    columnHelper.accessor('exp_date', {
      header: 'Exp Date',
      cell: (info) => info.getValue() || '-',
    }),
    columnHelper.accessor('grade', {
      header: 'Grade',
      cell: (info) => info.getValue() || '-',
    }),
    columnHelper.accessor('size', {
      header: 'Size',
      cell: (info) => info.getValue() || '-',
    }),

    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => {
        const rowData = info.row.original;
        const isApproved = rowData.status === 'Approved';

        return (
          <div className="flex gap-2 notranslate" translate="no">
            <Button
              outline
              size="xs"
              className={`rounded-md font-medium
            ${
              isApproved
                ? 'border border-green-600 text-green-600 hover:bg-green-600 hover:text-white'
                : 'border border-red-600 text-red-600 hover:bg-red-600 hover:text-white'
            }
          `}
              onClick={() => {
                onhandleStatusChange(rowData);
                setTimeout(triggerGoogleTranslateRescan, 50);
              }}
            >
              {isApproved ? 'Approved' : 'Not Approved'}
            </Button>
          </div>
        );
      },
    }),

    // ✅ Actions
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => {
        const row = info.row.original;

        return (
          <div className="flex gap-2 notranslate" translate="no">
            {permissions?.edit && (
              <Tooltip content="Add">
                <Button
                  size="sm"
                  className="p-0 bg-lightsuccess text-success hover:bg-success hover:text-white"
                  onClick={() => handlers.onAdd(row)}
                >
                  <div className="flex items-center gap-1">
                    <Icon icon="solar:pen-outline" height={18} />
                    <Icon icon="solar:plus-outline" height={16} />
                  </div>
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

  // ✅ Table
  const table = useReactTable({
    data: filteredData,
    columns: useMemo(
      () =>
        getColumns({
          onAdd: (row: any) => {
            setSelectedRow(row);
            setAddmodal(true);
          },
        }),
      [permissions],
    ),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <>
      {/* 🔍 Search */}
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
      </div>

      {/* Table */}
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

      {/* Add modal */}
      {addModal && (
        <Portal>
          <Addmodal
            setPlaceModal={setAddmodal}
            modalPlacement="center"
            placeModal={addModal}
            logindata={logindata}
            rowData={selectedRow}
            setOnreload={setOnreload}
          />
        </Portal>
      )}
    </>
  );
}

export default Table;
