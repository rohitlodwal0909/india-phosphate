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
// import ViewDisputeModal from './ViewDisputeModal';
import DisputeModal from './DisputeModal';
import DisputeEditModal from './DisputeEditModal';
import { deleteDispute, getDispute } from 'src/features/marketing/DisputeSlice';
import ViewDisputeModal from './ViewDisputeModel';

interface FollowupType {
  followup_date: string;
  note: string;
  status: string;
}

interface DisputeDataType {
  id: number;

  dispute_type: string;

  dispute_type_id: any[];

  dispute_reason: string;

  purchase_order?: {
    id: number;
    po_no: string;
  };

  sample_request?: {
    id: number;
    sr_no: string;
  };

  assign_to?: {
    id: number;
    username: string;
  };

  priority: string;

  followups: FollowupType[];

  date: string;

  users?: {
    id: number;
    username: string;
  };
}

const columnHelper = createColumnHelper<DisputeDataType>();

const DisputeTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const logindata = useSelector((state: RootState) => state.authentication?.logindata) as any;

  const disputes = useSelector((state: RootState) => state.disputes.disputes) as any;

  const [data, setData] = useState<DisputeDataType[]>([]);
  const [searchText, setSearchText] = useState('');
  const [modals, setModals] = useState({ add: false, edit: false, view: false, delete: false });
  const [selectedRow, setSelectedRow] = useState<DisputeDataType | null>(null);

  const { selectedIconId } = useContext(CustomizerContext) || {};

  const permissions = useMemo(() => {
    return getPermissions(logindata, selectedIconId, 9);
  }, [logindata, selectedIconId]);

  useEffect(() => {
    setData(Array.isArray(disputes) ? disputes : []);
  }, [disputes]);

  useEffect(() => {
    dispatch(getDispute());
  }, [dispatch]);

  const handleModal = (type: keyof typeof modals, value: boolean, row?: DisputeDataType) => {
    setSelectedRow(row || null);
    setModals((prev) => ({ ...prev, [type]: value }));
    setTimeout(triggerGoogleTranslateRescan, 200);
  };

  const handleConfirmDelete = async () => {
    if (!selectedRow?.id) {
      return toast.error('No entry selected.');
    }
    try {
      const id = selectedRow.id;
      await dispatch(deleteDispute(id)).unwrap();
      toast.success('Dispute entry deleted!');
      dispatch(getDispute());
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      toast.error(err || 'Delete failed');
    } finally {
      handleModal('delete', false);
    }
  };

  const searchInObject = (obj: any, search: string): boolean => {
    if (!obj) return false;

    // string / number / boolean
    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
      return String(obj).toLowerCase().includes(search);
    }

    // array
    if (Array.isArray(obj)) {
      return obj.some((item) => searchInObject(item, search));
    }

    // object
    if (typeof obj === 'object') {
      return Object.values(obj).some((value) => searchInObject(value, search));
    }

    return false;
  };

  const filteredData = useMemo(() => {
    if (!searchText) return data;

    const search = searchText.toLowerCase();

    return data.filter((item) => searchInObject(item, search));
  }, [data, searchText]);

  const priorityOptions = [
    {
      value: 'high',
      label: 'High',
      color: '#dc2626',
    },
    {
      value: 'medium',
      label: 'Medium',
      color: '#f59e0b',
    },
    {
      value: 'low',
      label: 'Low',
      color: '#16a34a',
    },
  ];

  const getPriority = (priority: string) => priorityOptions.find((p) => p.value === priority);

  const PriorityBadge = ({ priority }: any) => {
    const option = getPriority(priority);

    if (!option) return <span>-</span>;

    return (
      <span
        className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 w-fit"
        style={{
          backgroundColor: `${option.color}20`,
          color: option.color,
        }}
      >
        <span
          style={{
            background: option.color,
            width: 8,
            height: 8,
            borderRadius: '50%',
          }}
        />
        {option.label}
      </span>
    );
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
        cell: (info) => (
          <div className="max-w-[350px] whitespace-normal break-words text-sm">
            <p>#{info.row.index + 1}</p>
          </div>
        ),
      }),

      columnHelper.accessor('dispute_type', {
        header: 'PO / Sample',
        cell: (info) => (
          <div className="max-w-[350px] whitespace-normal break-words text-sm">
            <p>{info.row.original.dispute_type == 'po' ? 'PO' : 'Sample No.'}</p>
          </div>
        ),
      }),

      columnHelper.accessor('dispute_type_id', {
        header: 'Dispute No.',
        cell: (info) => {
          const row = info.row.original;

          return (
            <div className="max-w-[350px] whitespace-normal break-words text-sm">
              <p>
                {row.dispute_type === 'po' ? row.purchase_order?.po_no : row.sample_request?.sr_no}
              </p>
            </div>
          );
        },
      }),

      columnHelper.accessor('dispute_reason', {
        header: 'Dispute reason',
        cell: (info) => (
          <div className="max-w-[350px] whitespace-normal break-words text-sm">
            <p>{info.row.original.dispute_reason}</p>
          </div>
        ),
      }),
      columnHelper.accessor('assign_to', {
        header: 'Assigned To',
        cell: (info) => (
          <div className="max-w-[350px] whitespace-normal break-words text-sm">
            <p>{info.row.original.assign_to?.username}</p>
          </div>
        ),
      }),
      columnHelper.accessor('priority', {
        header: 'Priority',
        cell: (info) => (
          <div className="max-w-[350px] whitespace-normal break-words text-sm">
            <PriorityBadge priority={info.row.original.priority} />

            {/* <p>{info.row.original.priority}</p> */}
          </div>
        ),
      }),
      columnHelper.accessor('date', {
        header: 'Date',
        cell: (info) => (
          <div className="max-w-[350px] whitespace-normal break-words text-sm">
            <p>{info.row.original.date}</p>
          </div>
        ),
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
        {permissions.add && (
          <Button
            onClick={() => handleModal('add', true)}
            color="primary"
            outline
            size="sm"
            className="border border-primary bg-primary text-white rounded-md"
          >
            Create Dispute
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

      {modals.delete && (
        <Portal>
          <ComonDeletemodal
            isOpen={modals.delete}
            setIsOpen={() => handleModal('delete', false)}
            selectedUser={selectedRow}
            title="Are you sure you want to Delete this Dispute ?"
            handleConfirmDelete={handleConfirmDelete}
          />
        </Portal>
      )}
      {modals.view && (
        <Portal>
          <ViewDisputeModal
            placeModal={modals.view}
            setPlaceModal={() => handleModal('view', false)}
            selectedRow={selectedRow}
            modalPlacement="center"
          />
        </Portal>
      )}
      {modals.add && (
        <Portal>
          <DisputeModal openModal={modals.add} setOpenModal={() => handleModal('add', false)} />
        </Portal>
      )}
      {modals.edit && (
        <Portal>
          <DisputeEditModal
            openModal={modals.edit}
            setOpenModal={() => handleModal('edit', false)}
            selectedRow={selectedRow}
          />
        </Portal>
      )}
    </div>
  );
};

export default DisputeTable;
