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
import TableComponent from 'src/utils/TableComponent';
import PaginationComponent from 'src/utils/PaginationComponent';
import Portal from 'src/utils/Portal';
import { triggerGoogleTranslateRescan } from 'src/utils/triggerTranslateRescan';
import { AppDispatch, RootState } from 'src/store';
import { CustomizerContext } from 'src/context/CustomizerContext';
import { getPermissions } from 'src/utils/getPermissions';
import ViewWorkOrderModal from './ViewWorkOrderModal';
import {
  getPurchaseOrders,
  updateWorkOrderStatus,
} from 'src/features/marketing/PurchaseOrderSlice';
import AddWorkOrder from './AddWorkOrder';
import Remark from './Remark';
import { toast } from 'react-toastify';
import { Badge } from 'flowbite-react';
import PasswordVerifyModal from './PasswordVerifyModal';

interface PurchaseOrderDataType {
  id: number;
  user_id: number;
  po_no: string;
  workNo?: {
    id: number;
    work_order_no: string;
    remark: string;
    status: string;
  };
  customers?: {
    company_name: string;
  };
  product_name: string;
}

const columnHelper = createColumnHelper<PurchaseOrderDataType>();

const ViewWorkOrderTable = () => {
  const dispatch = useDispatch<AppDispatch>();

  const logindata = useSelector((state: RootState) => state.authentication?.logindata) as any;

  const purchaseOrders = useSelector(
    (state: RootState) => state.purchaseOrder.purchaseOrders,
  ) as any;

  const remarkPermission = logindata?.admin?.id === 5;

  const [data, setData] = useState<PurchaseOrderDataType[]>([]);
  const [searchText, setSearchText] = useState('');

  const [modals, setModals] = useState({
    add: false,
    view: false,
    remark: false,
  });

  const [passwordModal, setPasswordModal] = useState(false);

  const [selectedRow, setSelectedRow] = useState<PurchaseOrderDataType | null>(null);

  const { selectedIconId } = useContext(CustomizerContext) || {};

  const permissions = useMemo(() => {
    return getPermissions(logindata, selectedIconId, 10);
  }, [logindata, selectedIconId]);

  useEffect(() => {
    setData(Array.isArray(purchaseOrders) ? purchaseOrders : []);
  }, [purchaseOrders]);

  useEffect(() => {
    dispatch(getPurchaseOrders());
  }, [dispatch]);

  const handleModal = (type: keyof typeof modals, value: boolean, row?: PurchaseOrderDataType) => {
    setSelectedRow(row || null);
    setModals((prev) => ({ ...prev, [type]: value }));
    setTimeout(triggerGoogleTranslateRescan, 200);
  };

  const filteredData = useMemo(() => {
    if (!searchText) return data;

    const search = searchText.toLowerCase();

    return data.filter((item) => {
      return (
        item.po_no?.toLowerCase().includes(search) ||
        item.product_name?.toLowerCase().includes(search) ||
        item.customers?.company_name?.toLowerCase().includes(search) ||
        item.workNo?.work_order_no?.toLowerCase().includes(search) ||
        item.workNo?.remark?.toLowerCase().includes(search)
      );
    });
  }, [data, searchText]);

  const handleApprove = async (row: PurchaseOrderDataType, status: string) => {
    try {
      const payload = {
        id: row.workNo?.id,
        status: status,
      };

      await dispatch(updateWorkOrderStatus(payload)).unwrap();

      toast.success(`Work Order ${status}`);

      dispatch(getPurchaseOrders());
    } catch (err) {
      toast.error('Status update failed');
    }
  };

  const handlePasswordSuccess = () => {
    handleModal('view', true, selectedRow || undefined);
  };

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'serial',
        header: 'S. No.',
        cell: (info) => <span>#{info.row.index + 1}</span>,
      }),

      columnHelper.accessor('po_no', {
        header: 'PO No.',
      }),

      columnHelper.display({
        id: 'work_order_no',
        header: 'Work Order No.',
        cell: (info) => info.row.original.workNo?.work_order_no || '-',
      }),

      columnHelper.display({
        id: 'remark',
        header: 'Remark',
        cell: (info) => info.row.original.workNo?.remark || '-',
      }),

      columnHelper.display({
        id: 'status',
        header: 'Status',
        cell: (info) => {
          const status = info.row.original.workNo?.status;

          if (!status) return '-';

          const colors: Record<string, string> = {
            NEW: 'secondary',
            PENDING: 'warning',
            APPROVED: 'success',
            REJECTED: 'failure',
            HOLD: 'secondary',
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
          const row = info.row.original;

          return (
            <div className="flex gap-2 notranslate" translate="no">
              {remarkPermission && (
                <>
                  <Tooltip content="Approve">
                    <Button
                      size="xs"
                      color="success"
                      onClick={() => handleApprove(row, 'Approved')}
                    >
                      <Icon icon="mdi:check-circle-outline" height={18} />
                    </Button>
                  </Tooltip>

                  <Tooltip content="Not Approve">
                    <Button size="xs" color="error" onClick={() => handleApprove(row, 'Rejected')}>
                      <Icon icon="mdi:close-circle-outline" height={18} />
                    </Button>
                  </Tooltip>
                </>
              )}
              {permissions.view && (
                <Tooltip content="View">
                  <Button
                    size="xs"
                    color="primary"
                    outline
                    onClick={() => {
                      setSelectedRow(row);
                      setPasswordModal(true);
                    }}
                  >
                    <Icon icon="solar:eye-outline" height={18} />
                  </Button>
                </Tooltip>
              )}

              {/* {permissions.add && (
                <Tooltip content="Add Work Order">
                  <Button size="xs" color="success" onClick={() => handleModal('add', true, row)}>
                    <Icon icon="material-symbols:add-rounded" height={18} />
                  </Button>
                </Tooltip>
              )} */}

              {remarkPermission && (
                <Tooltip content="Add Remark">
                  <Button
                    size="xs"
                    color="warning"
                    onClick={() => handleModal('remark', true, row)}
                  >
                    <Icon icon="mdi:comment-plus-outline" height={18} />
                  </Button>
                </Tooltip>
              )}
            </div>
          );
        },
      }),
    ],
    [permissions, remarkPermission],
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
    },
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
            className="p-2 border rounded-md border-gray-300"
          />
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
        <div className="flex flex-col items-center justify-center my-20 space-y-4">
          <Icon icon="fluent:person-prohibited-20-filled" className="text-red-500" width="60" />
          <div className="text-red-600 text-xl font-bold text-center">
            You do not have permission to view this table.
          </div>
        </div>
      )}

      {modals.view && (
        <Portal>
          <ViewWorkOrderModal
            placeModal={modals.view}
            setPlaceModal={() => handleModal('view', false)}
            selectedRow={selectedRow}
            modalPlacement="center"
          />
        </Portal>
      )}

      {modals.add && (
        <Portal>
          <AddWorkOrder
            placeModal={modals.add}
            setPlaceModal={() => handleModal('add', false)}
            selectedRow={selectedRow}
          />
        </Portal>
      )}

      {modals.remark && (
        <Portal>
          <Remark
            placeModal={modals.remark}
            setPlaceModal={() => handleModal('remark', false)}
            selectedRow={selectedRow}
          />
        </Portal>
      )}

      <PasswordVerifyModal
        open={passwordModal}
        setOpen={setPasswordModal}
        onSuccess={handlePasswordSuccess}
      />
    </div>
  );
};

export default ViewWorkOrderTable;
