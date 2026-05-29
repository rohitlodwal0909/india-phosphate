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
// import ViewVisitPlanner from './ViewVisitPlanner';
// import { deleteDispute, getDispute } from 'src/features/marketing/DisputeSlice';
import VisitPlannerEditModal from './VisitPlannerEditModal';
import VisitPlannerModal from './VisitPlannerModal';
import { deleteVisitPlanner, getVisitPlanner } from 'src/features/marketing/VisitPlannerSlice';
import VisitPlannerView from './VisitPlannerView';

interface DisputeDataType {
  id: number;
  total_visits: string;
  date: string;
  users?: {
    id: number;
    username: string;
  };
}

const columnHelper = createColumnHelper<DisputeDataType>();

const VisitPlannerTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const logindata = useSelector((state: RootState) => state.authentication?.logindata) as any;

  const visitplanner = useSelector((state: RootState) => state.visitplanner.visitplanner) as any;
  const [data, setData] = useState<DisputeDataType[]>([]);
  const [searchText, setSearchText] = useState('');
  const [modals, setModals] = useState({ add: false, edit: false, view: false, delete: false });
  const [selectedRow, setSelectedRow] = useState<DisputeDataType | null>(null);

  const { selectedIconId } = useContext(CustomizerContext) || {};

  const permissions = useMemo(() => {
    return getPermissions(logindata, selectedIconId, 10);
  }, [logindata, selectedIconId]);

  useEffect(() => {
    setData(Array.isArray(visitplanner) ? visitplanner : []);
  }, [visitplanner]);

  useEffect(() => {
    dispatch(getVisitPlanner());
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
      await dispatch(deleteVisitPlanner(id)).unwrap();
      toast.success('Visit Planner Entry deleted!');
      dispatch(getVisitPlanner());
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

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
      }),

      columnHelper.accessor('total_visits', {
        header: 'Total Visit',
        cell: (info) => (
          <div className="max-w-[350px] whitespace-normal break-words text-sm">
            <p>{info.row.original.total_visits}</p>
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

      columnHelper.accessor('users', {
        header: 'Submitted By',
        cell: (info) => (
          <div className="max-w-[350px] whitespace-normal break-words text-sm">
            <p>{info.row.original.users?.username}</p>
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
            Create Visit Planner
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
            title="Are you sure you want to Delete this Visit Planner ?"
            handleConfirmDelete={handleConfirmDelete}
          />
        </Portal>
      )}
      {modals.view && (
        <Portal>
          <VisitPlannerView
            placeModal={modals.view}
            setPlaceModal={() => handleModal('view', false)}
            selectedRow={selectedRow}
            modalPlacement="center"
          />
        </Portal>
      )}
      {modals.add && (
        <Portal>
          <VisitPlannerModal
            openModal={modals.add}
            setOpenModal={() => handleModal('add', false)}
          />
        </Portal>
      )}
      {modals.edit && (
        <Portal>
          <VisitPlannerEditModal
            openModal={modals.edit}
            setOpenModal={() => handleModal('edit', false)}
            selectedRow={selectedRow}
          />
        </Portal>
      )}
    </div>
  );
};

export default VisitPlannerTable;
