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
import TableComponent from 'src/utils/TableComponent';
import { useDispatch, useSelector } from 'react-redux';
import PaginationComponent from 'src/utils/PaginationComponent';
import { useContext, useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { triggerGoogleTranslateRescan } from 'src/utils/triggerTranslateRescan';
import { AppDispatch } from 'src/store';
import Addproductionmodal from './Addproductionmodal';

import {
  GetFetchProduction,
  GetFetchQcProduction,
} from 'src/features/Inventorymodule/productionmodule/ProdutionSlice';

import { CustomizerContext } from 'src/context/CustomizerContext';
import { getPermissions } from 'src/utils/getPermissions';
import { GetRmCode } from 'src/features/master/RmCode/RmCodeSlice';
import { GetPmCode } from 'src/features/master/PmCode/PmCodeSlice';
import { GetEquipment } from 'src/features/master/Equipment/EquipmentSlice';

export interface PaginationTableType {
  id: number;
  qc_batch_number: string;
  rm_code: string;
  pm_code: string;
  equipment: string;
  quantity: string;
  status: any;
  grn_number: any;
  tested_by: any;
  productionExists: any;
  actions: any;
  qa_qc_status: any;
  production_results: any;
}

const columnHelper = createColumnHelper<PaginationTableType>();
// const Statuses = ["PENDING", "APPROVED", "REJECT", "HOLD"];

function ProductionInventoryTable() {
  const [selectedRow, setSelectedRow] = useState<PaginationTableType | null>(null);

  const [addmodal, setaddmodal] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  // const logindata = JSON.parse(localStorage.getItem('logincheck') || '{}');
  const logindata = useSelector((state: any) => state.authentication?.logindata);

  const qcproductiondata = useSelector((state: any) => state.productionData.qcproduction);

  const rm_codes = useSelector((state: any) => state.rmcodes.rmcodedata);
  const pm_codes = useSelector((state: any) => state.pmcodes.pmcodedata);
  const equipments = useSelector((state: any) => state.equipment.Equipmentdata);

  const [searchText, setSearchText] = useState('');

  const { selectedIconId } = useContext(CustomizerContext) || {};
  const permissions = useMemo(() => {
    return getPermissions(logindata, selectedIconId, 5);
  }, [logindata, selectedIconId]);

  useEffect(() => {
    dispatch(GetRmCode());
    dispatch(GetPmCode());
    dispatch(GetEquipment());
    const fetchSqcData = async () => {
      try {
        const result = await dispatch(GetFetchQcProduction());
        if (GetFetchProduction.rejected.match(result))
          return console.error('Store Module Error:', result.payload || result.error.message);
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    };
    fetchSqcData();
  }, [dispatch]);

  const handleApprove = (row: PaginationTableType) => {
    triggerGoogleTranslateRescan();
    setSelectedRow(row);
  };
  const handleReject = (row: PaginationTableType) => {
    triggerGoogleTranslateRescan();
    setSelectedRow(row);
  };

  const filteredData = useMemo(() => {
    if (!searchText) return qcproductiondata;

    const keyword = searchText.toLowerCase();

    return qcproductiondata?.filter((item) => {
      const batch = item?.qc_batch_number?.toString().toLowerCase();
      const prod = item?.production_results?.[0] || {};

      // Parse RM codes
      let rmCodes = [];
      try {
        const raw = prod?.rm_code;
        rmCodes = Array.isArray(raw) ? raw : JSON.parse(raw || '[]');
      } catch {}

      // Split quantity and unit
      const qtyList = prod?.quantity?.toString().split(',') || [];
      const unitList = prod?.unit?.toString().split(',') || [];

      // Match any
      return (
        batch?.includes(keyword) ||
        rmCodes.some((code) => code.toLowerCase().includes(keyword)) ||
        qtyList.some((q) => q.toLowerCase().includes(keyword)) ||
        unitList.some((u) => u.toLowerCase().includes(keyword))
      );
    });
  }, [qcproductiondata, searchText]);

  const columns = [
    columnHelper.accessor('id', {
      header: 'S. No.',
      cell: (info) => {
        const rowIndex = info.row.index + 1; // `+1` for 1-based indexing
        return (
          <div className="truncate max-w-56">
            <h6 className="text-base">#{rowIndex}</h6>
          </div>
        );
      },
    }),

    columnHelper.accessor('qc_batch_number', {
      cell: (info) => <p>{info.getValue() || 'N0 Code'}</p>,
      header: () => <span>Batch Number</span>,
    }),

    columnHelper.accessor('rm_code', {
      cell: (info) => {
        const rowIndata = info.row.original;
        let values = [];

        try {
          const raw = rowIndata?.production_results;
          values = Array.isArray(raw) ? raw : JSON.parse(raw || '[]');
        } catch (err) {
          console.error('Failed to parse production_results:', err);
        }

        return values.length ? (
          <div className="flex flex-col gap-1">
            {values.map((v, i) => (
              <div key={i} className="flex items-center gap-2  px-2 py-1 rounded">
                {/* RM CODE */}
                <span className="bg-pink-100 text-pink-800 text-xs px-2 py-0.5 rounded">
                  {v?.rmcodes?.rm_code || 'N/A'}
                </span>

                {/* QUANTITY */}
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                  {v?.rm_quantity} {v?.rm_unit || ''}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <span className="text-xs text-gray-400">No RM Code</span>
        );
      },
      header: () => <span>RM Code / Quantity</span>,
    }),

    columnHelper.accessor('pm_code', {
      cell: (info) => {
        const rowIndata = info.row.original;
        let values = [];

        try {
          const raw = rowIndata?.production_results;
          values = Array.isArray(raw) ? raw : JSON.parse(raw || '[]');
        } catch (err) {
          console.error('Failed to parse production_results:', err);
        }

        return values.length ? (
          <div className="flex flex-col gap-1">
            {values.map((v, i) => (
              <div key={i} className="flex items-center gap-2  px-2 py-1 rounded">
                {/* RM CODE */}
                <span className="bg-pink-100 text-pink-800 text-xs px-2 py-0.5 rounded">
                  {v?.pmcodes?.name || ' '}
                </span>

                {/* QUANTITY */}
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                  {v?.pm_quantity} {v?.pm_unit || ''}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <span className="text-xs text-gray-400">No PM Code</span>
        );
      },
      header: () => <span>PM Code / Quantity</span>,
    }),
    columnHelper.accessor('equipment', {
      cell: (info) => {
        const rowIndata = info.row.original;
        let values = [];

        try {
          const raw = rowIndata?.production_results;
          values = Array.isArray(raw) ? raw : JSON.parse(raw || '[]');
        } catch (err) {
          console.error('Failed to parse production_results:', err);
        }

        return values.length ? (
          <div className="flex flex-col gap-1">
            {values.map((v, i) => (
              <div key={i} className="flex items-center gap-2  px-2 py-1 rounded">
                {/* RM CODE */}
                <span className="bg-pink-100 text-pink-800 text-xs px-2 py-0.5 rounded">
                  {v?.equipment?.name || ' '}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <span className="text-xs text-gray-400">No Equipment</span>
        );
      },
      header: () => <span>Equipment</span>,
    }),

    columnHelper.accessor('status', {
      cell: (info) => {
        const rowIndata = info.row.original;
        const raw = rowIndata?.production_results?.[0]?.rm_code ? 'COMPLETE' : 'PENDING';

        const color = raw === 'PENDING' ? 'warning' : 'secondary';
        return (
          <Badge color={color} className="capitalize">
            {raw}
          </Badge>
        );
      },
      header: () => <span>Status</span>,
    }),
    columnHelper.accessor('actions', {
      cell: (info) => {
        const rowData = info.row.original;
        const raw = rowData?.production_results?.[0]?.rm_code;
        return (
          <div className="flex gap-2">
            {raw ? (
              // <Link to={`/view-report/${idStr}`}>
              <Button
                color="secondary"
                outline
                size="xs"
                className="border border-primary text-primary   hover:bg-primary hover:text-white rounded-md"
              >
                <Icon icon="solar:eye-outline" height={18} />
              </Button>
            ) : (
              // </Link>

              permissions?.add && (
                <Button
                  onClick={() => {
                    setaddmodal(true), setSelectedRow(rowData);
                  }}
                  color="secondary"
                  outline
                  size="xs"
                  className="border border-primary text-primary hover:bg-primary hover:text-white rounded-md"
                >
                  <Icon icon="material-symbols:add-rounded" height={18} />
                </Button>
              )
            )}

            {rowData.qa_qc_status === 'PENDING' && (
              <>
                <Button
                  onClick={() => handleApprove(rowData)}
                  color="secondary"
                  outline
                  size="xs"
                  className="border border-primary text-primary hover:bg-primary hover:text-white rounded-md"
                >
                  APPROVE
                </Button>
                <Button
                  onClick={() => {
                    setSelectedRow(rowData);
                  }}
                  color="secondary"
                  outline
                  size="xs"
                  className="border border-secondary text-secondary hover:bg-secondary hover:text-white rounded-md"
                >
                  HOLD
                </Button>
                <Button
                  onClick={() => handleReject(rowData)}
                  color="error"
                  outline
                  size="xs"
                  className="border border-error text-error hover:bg-error hover:text-white rounded-md"
                >
                  REJECT
                </Button>
              </>
            )}
          </div>
        );
      },
      header: () => <span>Actions</span>,
    }),
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      {permissions?.view ? (
        <>
          <div className="p-4">
            <div className="flex justify-end">
              <input
                type="text"
                placeholder="Search..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="me-2 p-2 border rounded-md border-gray-300"
              />
            </div>
          </div>
          <div className="w-full overflow-x-auto">
            <TableComponent table={table} flexRender={flexRender} columns={columns} />
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
            Please contact your administrator if you believe this is an error.
          </p>
        </div>
      )}
      <Addproductionmodal
        openModal={addmodal}
        setOpenModal={setaddmodal}
        rmcodes={rm_codes}
        pmcodes={pm_codes}
        equipments={equipments}
        selectedRow={selectedRow}
        logindata={logindata}
      />
    </>
  );
}

export default ProductionInventoryTable;
