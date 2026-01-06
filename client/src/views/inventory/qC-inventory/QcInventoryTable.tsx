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
import Approvemodal from './Approvemodal';
import Rejectmodal from './Rejectmodal';
import Holdmodal from './Holdmodal';
import TableComponent from 'src/utils/TableComponent';
import { useDispatch, useSelector } from 'react-redux';
import {
  Approvemodule,
  Holdmodule,
  Rejectmodule,
} from 'src/features/Inventorymodule/Qcinventorymodule/QcinventorySlice';
import { GetStoremodule } from 'src/features/Inventorymodule/storemodule/StoreInventorySlice';
import { GetCheckinmodule } from 'src/features/Inventorymodule/guardmodule/GuardSlice';
import { toast } from 'react-toastify';
import PaginationComponent from 'src/utils/PaginationComponent';
import { useContext, useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { triggerGoogleTranslateRescan } from 'src/utils/triggerTranslateRescan';
import { Link, useNavigate } from 'react-router';
import { AppDispatch } from 'src/store';
import { CustomizerContext } from 'src/context/CustomizerContext';
import { getPermissions } from 'src/utils/getPermissions';
import { formatDate, formatTime } from 'src/utils/Datetimeformate';

export interface PaginationTableType {
  id: number;
  supplier_name: string;
  grn_date: string;
  grn_time: string;
  grn_number: string;
  manufacturer_name: string;
  invoice_number: string;
  guard_entry_id: number;
  batch_number: string;
  store_rm_code: string;
  container_count: number;
  quantity: string;
  unit: string;
  qa_qc_status: string;
  remarks: string | null;
  store_location: string | null;
  mfg_date: string | null;
  exp_date: string | null;
  createdAt: string;
  status: any;
  tested_by: any;
  actions: any;
}

const columnHelper = createColumnHelper<PaginationTableType>();
const Statuses = ['PENDING', 'APPROVED', 'REJECT', 'HOLD'];

function QcInventoryTable() {
  const [holdOpen, setholdOpen] = useState(false);
  const [rejectmodal, setRejectmodal] = useState(false);
  const [approvemodal, setApprovemodal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<PaginationTableType | null>(null);

  const [filters, setFilters] = useState<{ [key: string]: string }>({ status: '' });

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const StoreData = useSelector((state: any) => state.storeinventory.storedata);
  // const guardData = useSelector((state: any) => state.checkininventory.checkindata);
  // const logindata = JSON.parse(localStorage.getItem('logincheck') || '{}');
  const logindata = useSelector((state: any) => state.authentication?.logindata);

  const [data, setData] = useState<PaginationTableType[]>(StoreData?.data || []);
  const [searchText, setSearchText] = useState('');

  const { selectedIconId } = useContext(CustomizerContext) || {};
  const permissions = useMemo(() => {
    return getPermissions(logindata, selectedIconId, 3);
  }, [logindata, selectedIconId]);

  useEffect(() => {
    if (StoreData?.data) {
      const materialData = StoreData.data.filter((item) => item.type == 'material');
      setData(materialData);
    }
  }, [StoreData]);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const result = await dispatch(GetStoremodule());
        if (GetStoremodule.rejected.match(result))
          return console.error('Store Module Error:', result.payload || result.error.message);
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    };

    const fetchData = async () => {
      try {
        const checkinResult = await dispatch(GetCheckinmodule(logindata?.admin?.id));
        if (GetCheckinmodule.rejected.match(checkinResult))
          console.error('Checkin Error', checkinResult);
      } catch (error) {
        console.error('Unexpected Error:', error);
      }
    };

    fetchData();
    fetchStoreData();
  }, [dispatch]);

  const handleApprove = (row: PaginationTableType) => {
    triggerGoogleTranslateRescan();
    setSelectedRow(row);
    setApprovemodal(true);
  };

  const handleConfirmApprove = async (data) => {
    try {
      const result = await dispatch(
        Approvemodule({
          ...data,
          userid: logindata?.admin?.id, // make sure this is the correct path
        }),
      ).unwrap();
      dispatch(GetStoremodule());
      toast.success(result?.message);
    } catch (error) {
      toast.error('Error occurred while dispatching approve module:', error);
    }
  };

  const handleConfirmReject = async (data, remark) => {
    try {
      if (remark && data) {
        const result = await dispatch(
          Rejectmodule({ id: data, remark, user_id: logindata?.admin?.id }),
        ).unwrap();
        dispatch(GetStoremodule());
        toast.success(result?.message);
      }
    } catch (error) {
      toast.error('Error occurred while dispatching reject module:', error);
    }
  };

  const handleConfirmHold = async (data, remark) => {
    try {
      if (remark && data) {
        const result = await dispatch(
          Holdmodule({ id: data, remark, user_id: logindata?.admin?.id }),
        ).unwrap();
        dispatch(GetStoremodule());
        toast.success(result?.message);
      }
    } catch (error) {
      toast.error('Error occurred while dispatching hold module:', error);
    }
  };

  const handleReject = (row: PaginationTableType) => {
    triggerGoogleTranslateRescan();
    setSelectedRow(row);
    setRejectmodal(true);
  };

  const handlereportsubmit = (data) => {
    navigate(`/inventory/report/${data?.store_rm_code}`, { state: data });
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const status = item.qa_qc_status || 'New';
      const byType = !filters.status || status.includes(filters.status);
      const bySearch =
        !searchText ||
        Object.values(item).some((v) => String(v).toLowerCase().includes(searchText.toLowerCase()));
      return byType && bySearch;
    });
  }, [data, filters, searchText]);

  const columns = [
    columnHelper.accessor('guard_entry_id', {
      cell: (info: any) => {
        const rowData = info.row.original?.guard_entry;
        // const storeItem = guardData?.data?.find(item => item.id === rowData.guard_entry_id);
        return (
          <div className="truncate max-w-56">
            <h6 className="text-base">{rowData?.inward_number}</h6>
          </div>
        );
      },
      header: () => <span className="text-base">Inward Number</span>,
    }),
    columnHelper.accessor('store_rm_code', {
      cell: (info) => <p>{info.getValue() || 'N0 Code'}</p>,
      header: () => <span>RM Code</span>,
    }),
    columnHelper.accessor('grn_number', {
      cell: (info) => <p>{info.getValue() || 'N0 Nmber'}</p>,
      header: () => <span>GRN_Number</span>,
    }),

    columnHelper.display({
      id: 'entry_date_time',
      header: 'Entry Date Time',
      cell: (info) => {
        const data = info?.row?.original;
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

    columnHelper.accessor('qa_qc_status', {
      cell: (info) => {
        const status = info.getValue() || 'New';
        const color =
          status === 'PENDING'
            ? 'warning'
            : status === 'APPROVED'
            ? 'primary'
            : status === 'HOLD'
            ? 'secondary'
            : 'error';
        return (
          <Badge color={color} className="capitalize">
            {status}
          </Badge>
        );
      },
      header: () => <span>Status</span>,
    }),
    columnHelper.accessor('tested_by', {
      cell: (info) => {
        const row = info.row.original as { qc_result?: { testedBy?: { username?: string } }[] };

        return <p>{row.qc_result?.[0]?.testedBy?.username || 'Unknown'}</p>;
      },
      header: () => <span>Tested By</span>,
    }),
    columnHelper.accessor('actions', {
      cell: (info) => {
        const rowData = info.row.original;
        const row = info.row.original as { qc_result?: { testedBy?: { username?: string } }[] };
        const idStr = String(rowData.id);

        return (
          <div className="flex gap-2">
            {rowData.qa_qc_status === 'REJECTED' && (
              <Link to={`/view-report/${idStr}`}>
                <Button
                  color="error"
                  outline
                  size="xs"
                  className="border border-error text-error hover:bg-error hover:text-white rounded-md"
                >
                  <Icon icon="solar:eye-outline" height={18} />
                </Button>
              </Link>
            )}
            {rowData.qa_qc_status === 'HOLD' && (
              <Button
                color="error"
                outline
                size="xs"
                className="border border-secondary text-secondary hover:bg-secondary hover:text-white rounded-md"
              >
                <Icon icon="mdi:gesture-tap-hold" height={20} />
              </Button>
            )}
            {rowData.qa_qc_status === 'APPROVED' && (
              <Link to={`/view-report/${idStr}`}>
                <Button
                  color="secondary"
                  outline
                  size="xs"
                  className="border border-primary text-primary hover:bg-primary hover:text-white rounded-md"
                >
                  <Icon icon="solar:eye-outline" height={18} />
                </Button>
              </Link>
            )}
            {row?.qc_result?.[0]?.testedBy?.username &&
              !['APPROVED', 'HOLD', 'REJECTED'].includes(rowData.qa_qc_status) && (
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
                      triggerGoogleTranslateRescan();
                      setholdOpen(true);
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
                    onClick={() => {
                      triggerGoogleTranslateRescan();
                      handleReject(rowData);
                    }}
                    color="error"
                    outline
                    size="xs"
                    className="border border-error text-error hover:bg-error hover:text-white rounded-md"
                  >
                    REJECT
                  </Button>
                </>
              )}
            {rowData.qa_qc_status === 'PENDING' && !row?.qc_result?.[0]?.testedBy?.username && (
              <>
                <Button
                  color="secondary"
                  onClick={() => handlereportsubmit(rowData)}
                  outline
                  size="xs"
                  className="border border-primary text-primary hover:bg-primary hover:text-white rounded-md"
                >
                  <Icon icon="tabler:report" height={18} />
                </Button>
                {/* <Button onClick={() => handleApprove(rowData)} color="secondary" outline size="xs" className="border border-primary text-primary hover:bg-primary hover:text-white rounded-md">APPROVE</Button>
              <Button onClick={() => {    triggerGoogleTranslateRescan(); setholdOpen(true); setSelectedRow(rowData); }} color="secondary" outline size="xs" className="border border-secondary text-secondary hover:bg-secondary hover:text-white rounded-md">HOLD</Button>
              <Button onClick={() =>{    triggerGoogleTranslateRescan(); handleReject(rowData)}} color="error" outline size="xs" className="border border-error text-error hover:bg-error hover:text-white rounded-md">REJECT</Button> */}
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
              <select
                id="status"
                value={filters.status}
                className=" border border-pink-200 focus:border-gray-300 focus:ring-0 rounded-md"
                onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
              >
                <option value="">Filter Status</option>
                {Statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
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
      <Approvemodal
        handleConfirmDelete={handleConfirmApprove}
        isOpen={approvemodal}
        setIsOpen={setApprovemodal}
        selectedUser={selectedRow}
      />
      <Rejectmodal
        handleConfirmDelete={handleConfirmReject}
        isOpen={rejectmodal}
        setIsOpen={setRejectmodal}
        selectedUser={selectedRow}
      />
      <Holdmodal
        handleConfirmDelete={handleConfirmHold}
        isOpen={holdOpen}
        setIsOpen={setholdOpen}
        selectedUser={selectedRow}
      />
    </>
  );
}

export default QcInventoryTable;
