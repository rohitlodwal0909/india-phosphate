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
import { Button } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import TableComponent from 'src/utils/TableComponent';
import PaginationComponent from 'src/utils/PaginationComponent';
import { triggerGoogleTranslateRescan } from 'src/utils/triggerTranslateRescan';
import { AppDispatch, RootState } from 'src/store';
import { CustomizerContext } from 'src/context/CustomizerContext';
import { getPermissions } from 'src/utils/getPermissions';
import { paymentPaid } from 'src/features/purchase/po/PurchasePoSlice';
import ViewModal from 'src/views/purchase/po-purchase/PoPurchaseComponent/ViewPoPurchase';
import AddLedgerModel from './AddLedger';

const formatDate = (date: string) => {
  if (!date) return '-';

  return new Date(date).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

interface LedgerDataType {
  id: number;

  transaction_date?: string;

  voucher_no?: string;
  voucher_type?: string;

  reference_no?: string;

  ledger_name?: string;
  ledger_group?: string;

  particulars?: string;

  debit_amount?: number;
  credit_amount?: number;
  balance?: number;

  payment_status?: string;
}

const columnHelper = createColumnHelper<LedgerDataType>();

const LedgerTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const logindata = useSelector((state: RootState) => state.authentication?.logindata) as any;

  // const { purchasepos } = useSelector((state: RootState) => state.purchasepo) as any;

  const [data, setData] = useState<LedgerDataType[]>([]);
  const [searchText, setSearchText] = useState('');
  const [modals, setModals] = useState({ add: false, edit: false, view: false, delete: false });
  const [selectedRow, setSelectedRow] = useState<LedgerDataType | null>(null);

  const { selectedIconId } = useContext(CustomizerContext) || {};
  const permissions = useMemo(() => {
    return getPermissions(logindata, selectedIconId, 5);
  }, [logindata, selectedIconId]);

  // useEffect(() => {
  //   setData(Array.isArray(purchasepos) ? purchasepos : []);
  // }, [purchasepos]);

  useEffect(() => {
    setData([
      {
        id: 1,
        transaction_date: '2026-05-01',
        voucher_no: 'PUR-001',
        voucher_type: 'Purchase',
        reference_no: 'PO-2026-001',
        ledger_name: 'ABC Chemicals Pvt Ltd',
        ledger_group: 'Sundry Creditors',
        particulars: 'Raw Material Purchase',
        debit_amount: 50000,
        credit_amount: 0,
        balance: 50000,
        payment_status: 'Paid',
      },
      {
        id: 2,
        transaction_date: '2026-05-05',
        voucher_no: 'PAY-001',
        voucher_type: 'Payment',
        reference_no: 'BANK-TRN-1001',
        ledger_name: 'HDFC Bank',
        ledger_group: 'Bank Accounts',
        particulars: 'Vendor Payment',
        debit_amount: 0,
        credit_amount: 20000,
        balance: 30000,
        payment_status: 'Paid',
      },
      {
        id: 3,
        transaction_date: '2026-05-10',
        voucher_no: 'SAL-001',
        voucher_type: 'Sales',
        reference_no: 'INV-2026-001',
        ledger_name: 'Sunrise Exports',
        ledger_group: 'Sundry Debtors',
        particulars: 'Export Chemical Invoice',
        debit_amount: 120000,
        credit_amount: 0,
        balance: 150000,
        payment_status: 'Notpaid',
      },
    ]);
  }, []);

  const handleModal = (type: keyof typeof modals, value: boolean, row?: LedgerDataType) => {
    setSelectedRow(row || null);
    setModals((prev) => ({ ...prev, [type]: value }));
    setTimeout(triggerGoogleTranslateRescan, 200);
  };

  const handlePayment = async (id: number, status: string) => {
    try {
      const res = await dispatch(paymentPaid({ id, status })).unwrap();

      toast.success(res?.message || `Payment ${status}`);

      // ✅ UI instant update
      setData((prev) =>
        prev.map((item) => (item.id === id ? { ...item, payment_status: status } : item)),
      );
    } catch (err: any) {
      toast.error(err?.message || 'Payment update failed');
    }
  };

  const filteredData = useMemo(
    () =>
      data.filter((item) =>
        Object.values(item).some((v) =>
          String(v || '')
            .toLowerCase()
            .includes(searchText.toLowerCase()),
        ),
      ),
    [data, searchText],
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'S.No',
        cell: (info) => info.row.index + 1,
      }),

      columnHelper.accessor('transaction_date', {
        header: 'Date',
        cell: (info) => (info.getValue() ? formatDate(info.getValue() as string) : '-'),
      }),

      columnHelper.accessor('voucher_no', {
        header: 'Voucher No',
      }),

      columnHelper.accessor('voucher_type', {
        header: 'Voucher Type',
      }),

      columnHelper.accessor('reference_no', {
        header: 'Reference No',
      }),

      columnHelper.accessor('ledger_name', {
        header: 'Ledger Name',
      }),

      columnHelper.accessor('ledger_group', {
        header: 'Ledger Group',
      }),

      columnHelper.accessor('particulars', {
        header: 'Particulars',
        cell: (info) => (
          <div className="max-w-[250px] whitespace-normal break-words">{info.getValue()}</div>
        ),
      }),

      columnHelper.accessor('debit_amount', {
        header: 'Debit',
        cell: (info) => `₹${Number(info.getValue() || 0).toLocaleString('en-IN')}`,
      }),

      columnHelper.accessor('credit_amount', {
        header: 'Credit',
        cell: (info) => `₹${Number(info.getValue() || 0).toLocaleString('en-IN')}`,
      }),

      columnHelper.accessor('balance', {
        header: 'Balance',
        cell: (info) => `₹${Number(info.getValue() || 0).toLocaleString('en-IN')}`,
      }),

      columnHelper.accessor('payment_status', {
        header: 'Payment Status',
        cell: (info) => {
          const status = info.getValue();

          return status === 'Paid' ? (
            <span className="px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
              Paid
            </span>
          ) : (
            <span className="px-3 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">
              Not Paid
            </span>
          );
        },
      }),

      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => {
          const row = info.row.original;

          return (
            <div className="flex gap-2">
              {/* <Button size="xs" color="primary" onClick={() => handleModal('view', true, row)}>
                View
              </Button> */}

              <Button size="xs" color="success" onClick={() => handlePayment(row.id, 'Paid')}>
                Paid
              </Button>

              <Button size="xs" color="failure" onClick={() => handlePayment(row.id, 'Notpaid')}>
                Not Paid
              </Button>
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

  return (
    <div className="p-1">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
        {' '}
        {permissions.view && (
          <input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="me-2 p-2 border rounded-md border-gray-300"
          />
        )}
        {permissions?.add && (
          <Button color="primary" onClick={() => handleModal('add', true)}>
            Create Ledger
          </Button>
        )}
      </div>

      {permissions.view ? (
        <>
          <div className="w-full overflow-x-auto">
            <div className="min-w-full">
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

      {modals.view && (
        <ViewModal
          placeModal={modals.view}
          setPlaceModal={() => handleModal('view', false)}
          selectedRow={selectedRow}
        />
      )}
      {modals.add && (
        <AddLedgerModel placeModal={modals.add} setPlaceModal={() => handleModal('add', false)} />
      )}
    </div>
  );
};

export default LedgerTable;
