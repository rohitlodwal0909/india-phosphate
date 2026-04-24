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
import { triggerGoogleTranslateRescan } from 'src/utils/triggerTranslateRescan';
import { AppDispatch, RootState } from 'src/store';
import { CustomizerContext } from 'src/context/CustomizerContext';
import { getPermissions } from 'src/utils/getPermissions';
import { paymentApprove } from 'src/features/marketing/PurchaseOrderSlice';
import { getPurchasePo } from 'src/features/purchase/po/PurchasePoSlice';
import ViewModal from 'src/views/purchase/po-purchase/PoPurchaseComponent/ViewPoPurchase';

const formatDate = (date: string) => {
  if (!date) return '-';

  return new Date(date).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

interface PurchaseOrderDataType {
  id: number;
  user_id: number;
  po_no: string;
  payment_status?: string;
  bill_to?: string;
  expected_arrival_date: string;
  users?: {
    id: number;
    username: string;
  };
}

const columnHelper = createColumnHelper<PurchaseOrderDataType>();

const AccountPurchaseTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const logindata = useSelector((state: RootState) => state.authentication?.logindata) as any;

  const { purchasepos } = useSelector((state: RootState) => state.purchasepo) as any;

  const [data, setData] = useState<PurchaseOrderDataType[]>([]);
  const [searchText, setSearchText] = useState('');
  const [modals, setModals] = useState({ add: false, edit: false, view: false, delete: false });
  const [selectedRow, setSelectedRow] = useState<PurchaseOrderDataType | null>(null);

  const { selectedIconId } = useContext(CustomizerContext) || {};
  const permissions = useMemo(() => {
    return getPermissions(logindata, selectedIconId, 4);
  }, [logindata, selectedIconId]);

  useEffect(() => {
    setData(Array.isArray(purchasepos) ? purchasepos : []);
  }, [purchasepos]);

  useEffect(() => {
    dispatch(getPurchasePo());
  }, [dispatch]);

  const handleModal = (type: keyof typeof modals, value: boolean, row?: PurchaseOrderDataType) => {
    setSelectedRow(row || null);
    setModals((prev) => ({ ...prev, [type]: value }));
    setTimeout(triggerGoogleTranslateRescan, 200);
  };

  const handlePayment = async (id: number, status: string) => {
    try {
      const res = await dispatch(paymentApprove({ id, status })).unwrap();

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
        header: 'S. No.',
        cell: (info) => (
          <div className="truncate max-w-56">
            <h6 className="text-base">#{info.row.index + 1}</h6>
          </div>
        ),
      }),
      columnHelper.accessor('po_no', { header: 'PO No.' }),

      columnHelper.accessor('bill_to', {
        header: 'Company Name',
        cell: (info) => (
          <div className="max-w-[350px] whitespace-normal break-words text-sm">
            <p>{info.row.original.bill_to}</p>
          </div>
        ),
      }),

      columnHelper.accessor('expected_arrival_date', {
        header: 'Expected Arrival Date',
        cell: (info) => (
          <div className="max-w-[350px] whitespace-normal break-words text-sm">
            <p>{formatDate(info.row.original.expected_arrival_date)}</p>
          </div>
        ),
      }),

      columnHelper.display({
        id: 'actions',
        header: 'Payment Status',
        cell: (info) => {
          const row = info.row.original;

          // ✅ Approved
          if (row.payment_status === 'Received') {
            return (
              <span className="px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                Received
              </span>
            );
          }

          // ✅ Rejected
          if (row.payment_status === 'Notreceived') {
            return (
              <span className="px-3 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">
                Not received
              </span>
            );
          }

          // ✅ Pending → show buttons
          return (
            <div className="flex flex-wrap gap-2">
              <Button size="xs" color="success" onClick={() => handlePayment(row.id, 'accepted')}>
                Accepted
              </Button>

              <Button size="xs" color="error" onClick={() => handlePayment(row.id, 'Notaccepted')}>
                Not Accepted
              </Button>
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
            <div className="flex flex-wrap gap-2 justify-center notranslate" translate="no">
              {permissions.view && (
                <Tooltip content="View">
                  <Button
                    onClick={() => handleModal('view', true, row)}
                    color="primary"
                    outline
                    size="xs"
                    className="text-primary bg-lightprimary hover:text-white"
                  >
                    <Icon icon="solar:eye-outline" height={18} />
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
    </div>
  );
};

export default AccountPurchaseTable;
