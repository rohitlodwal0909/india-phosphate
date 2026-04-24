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
import { useDispatch, useSelector } from 'react-redux';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';

import TableComponent from 'src/utils/TableComponent';
import PaginationComponent from 'src/utils/PaginationComponent';

import Approvemodal from './Approvemodal';
import Rejectmodal from './Rejectmodal';
import Holdmodal from './Holdmodal';
import Remarkmodal from './Remarkmodal';

import {
  Approvemodule,
  clearTestReport,
  Holdmodule,
  Rejectmodule,
} from 'src/features/Inventorymodule/Qcinventorymodule/QcinventorySlice';

import {
  getQcInspection,
  GetStoremodule,
} from 'src/features/Inventorymodule/storemodule/StoreInventorySlice';

import { triggerGoogleTranslateRescan } from 'src/utils/triggerTranslateRescan';
import { formatDate, formatTime } from 'src/utils/Datetimeformate';
import { getPermissions } from 'src/utils/getPermissions';
import { CustomizerContext } from 'src/context/CustomizerContext';
import { AppDispatch } from 'src/store';

// --------------------
// TYPES
// --------------------

export interface PaginationTableType {
  id: number;
  guard_entry: any;
  type: string;
  rmcode: any;
  pm_code: any;
  grn_date: string;
  grn_time: string;
  grn_number: string;
  qa_qc_status: string;
  qc_result: any[];
  pmresult: any[];
  pmapproveBy: any;
}

const columnHelper = createColumnHelper<PaginationTableType>();

const Statuses = ['PENDING', 'APPROVED', 'REJECT', 'HOLD'];

// ========================
// COMPONENT
// ========================

function QcInventoryTable() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { qcinsepection } = useSelector((state: any) => state.storeinventory);

  const logindata = useSelector((state: any) => state.authentication?.logindata);

  const { selectedIconId } = useContext(CustomizerContext) || {};

  const permissions = useMemo(
    () => getPermissions(logindata, selectedIconId, 3),
    [logindata, selectedIconId],
  );

  // ---------------- STATES ----------------

  const [data, setData] = useState<PaginationTableType[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({ status: '' });

  const [selectedRow, setSelectedRow] = useState<PaginationTableType | null>(null);

  const [approvemodal, setApprovemodal] = useState(false);
  const [rejectmodal, setRejectmodal] = useState(false);
  const [holdOpen, setholdOpen] = useState(false);
  const [remarkModal, setremarkModal] = useState(false);

  // ---------------- FETCH DATA ----------------

  useEffect(() => {
    dispatch(getQcInspection());
  }, [dispatch]);

  useEffect(() => {
    if (!qcinsepection) return;

    const materialData = qcinsepection.filter(
      (item: any) => item.type === 'material' || item.type === 'pm',
    );

    setData(materialData);
  }, [qcinsepection]);

  // ---------------- ACTION HANDLERS ----------------

  const handleApprove = (row: PaginationTableType) => {
    triggerGoogleTranslateRescan();
    setSelectedRow(row);
    setApprovemodal(true);
  };

  const handleReject = (row: PaginationTableType) => {
    triggerGoogleTranslateRescan();
    setSelectedRow(row);
    setRejectmodal(true);
  };

  const handlereportsubmit = (data: any, status: string) => {
    const id = data.id;
    dispatch(clearTestReport());
    status === 'pending' ? navigate(`/inventory/report/${id}`) : navigate(`/view-report/${id}`);
  };

  // ---------------- CONFIRM ACTIONS ----------------

  const handleConfirmApprove = async (data: any) => {
    try {
      const res = await dispatch(
        Approvemodule({
          ...data,
          userid: logindata?.admin?.id,
        }),
      ).unwrap();

      dispatch(GetStoremodule());
      toast.success(res?.message);
    } catch {
      toast.error('Approve failed');
    }
  };

  const handleConfirmReject = async (id: number, remark: string) => {
    const res = await dispatch(
      Rejectmodule({
        id,
        remark,
      }),
    ).unwrap();

    dispatch(GetStoremodule());
    toast.success(res?.message);
  };

  const handleConfirmHold = async (id: number, remark: string) => {
    const res = await dispatch(
      Holdmodule({
        id,
        remark,
      }),
    ).unwrap();

    dispatch(GetStoremodule());

    toast.success(res?.message);
  };

  // ---------------- FILTER ----------------

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const status = item.qa_qc_status || 'New';

      const byStatus = !filters.status || status.includes(filters.status);

      const bySearch =
        !searchText ||
        Object.values(item).join(' ').toLowerCase().includes(searchText.toLowerCase());

      return byStatus && bySearch;
    });
  }, [data, filters, searchText]);

  // ---------------- TABLE COLUMNS ----------------

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'inward',
        header: 'Inward Number',
        cell: (info) => info.row.original.guard_entry?.inward_number || '-',
      }),

      columnHelper.display({
        id: 'rm_pm',
        header: 'RM / PM Code',
        cell: (info) => {
          const row = info.row.original;
          return row.type === 'material' ? row.rmcode?.rm_code : row.pm_code?.name;
        },
      }),

      columnHelper.accessor('grn_number', {
        header: 'GRN Number',
        cell: (info) => info.getValue() || '-',
      }),

      columnHelper.display({
        id: 'date_time',
        header: 'Entry Date Time',
        cell: (info) => {
          const row = info.row.original;

          return (
            <>
              <p>{formatDate(row.grn_date)}</p>
              <span>{formatTime(row.grn_time)}</span>
            </>
          );
        },
      }),

      columnHelper.accessor('qa_qc_status', {
        header: 'Status',
        cell: (info) => {
          const status = info.getValue();

          const color =
            status === 'PENDING'
              ? 'warning'
              : status === 'APPROVED'
                ? 'primary'
                : status === 'HOLD'
                  ? 'secondary'
                  : 'error';

          return <Badge color={color}>{status}</Badge>;
        },
      }),

      columnHelper.display({
        id: 'tested_by',
        header: 'Tested By',
        cell: (info) => {
          const row = info.row.original;

          return row.type === 'pm'
            ? row.pmapproveBy?.username || '-'
            : row.qc_result?.[0]?.testedBy?.username || '-';
        },
      }),

      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => {
          const row = info.row.original;

          const hasResult = row.type === 'pm' ? !!row.pmresult?.length : !!row.qc_result?.length;

          const status = row.qa_qc_status;

          const isFinal = ['APPROVED', 'HOLD', 'REJECTED'].includes(status);

          return (
            <div className="flex gap-2">
              {status === 'APPROVED' && (
                <Button size="xs" outline onClick={() => handlereportsubmit(row, 'view')}>
                  <Icon icon="solar:eye-outline" height={18} />
                </Button>
              )}
              {status === 'PENDING' && !hasResult && (
                <Button size="xs" outline onClick={() => handlereportsubmit(row, 'pending')}>
                  <Icon icon="tabler:report" height={18} />{' '}
                </Button>
              )}

              {hasResult && !isFinal && (
                <>
                  <Button size="xs" onClick={() => handleApprove(row)}>
                    APPROVE
                  </Button>

                  <Button
                    size="xs"
                    onClick={() => {
                      setSelectedRow(row);
                      setholdOpen(true);
                    }}
                  >
                    HOLD
                  </Button>

                  <Button size="xs" color="error" onClick={() => handleReject(row)}>
                    REJECT
                  </Button>
                </>
              )}
            </div>
          );
        },
      }),
    ],
    [data],
  );

  // ---------------- TABLE ----------------

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // ======================== UI ========================

  if (!permissions?.view) {
    return <div className="text-center text-red-500 my-20">No Permission</div>;
  }

  return (
    <>
      {/* SEARCH + FILTER */}
      <div className="p-4 flex justify-end gap-2">
        <input
          placeholder="Search..."
          className="p-2 border rounded"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <select
          value={filters.status}
          onChange={(e) => setFilters({ status: e.target.value })}
          className="border rounded p-2"
        >
          <option value="">Filter Status</option>
          {Statuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <TableComponent table={table} flexRender={flexRender} columns={columns} />

      <PaginationComponent table={table} />

      {/* MODALS */}
      <Approvemodal
        isOpen={approvemodal}
        setIsOpen={setApprovemodal}
        selectedUser={selectedRow}
        handleConfirmDelete={handleConfirmApprove}
      />

      <Rejectmodal
        isOpen={rejectmodal}
        setIsOpen={setRejectmodal}
        selectedUser={selectedRow}
        handleConfirmDelete={handleConfirmReject}
      />

      <Holdmodal
        isOpen={holdOpen}
        setIsOpen={setholdOpen}
        selectedUser={selectedRow}
        handleConfirmDelete={handleConfirmHold}
      />

      <Remarkmodal
        isOpen={remarkModal}
        setIsOpen={setremarkModal}
        selectedRow={selectedRow}
        onSubmit={handleConfirmReject}
      />
    </>
  );
}

export default QcInventoryTable;
