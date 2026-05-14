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
import ViewEnquiryModal from './ViewEnquiryModal';
import EnquiryModal from './EnquiryModal';
import { deleteEnquiry, getEnquiry } from 'src/features/marketing/EnquirySlice';
import EnquiryEditModal from './EnquiryEditModal';

interface PurchaseOrderDataType {
  id: number;
  user_id: number;
  sr_no: string;
  customers?: {
    id: number;
    company_name: string;
  };
  interested_products?: any;
  note: string;
  status: string;
  follow_up_date: string;
  users?: {
    id: number;
    username: string;
  };
}

const columnHelper = createColumnHelper<PurchaseOrderDataType>();

const EnquiryTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const logindata = useSelector((state: RootState) => state.authentication?.logindata) as any;

  const enquiries = useSelector((state: RootState) => state.enquiry.enquiries) as any;

  const [data, setData] = useState<PurchaseOrderDataType[]>([]);
  const [searchText, setSearchText] = useState('');
  const [modals, setModals] = useState({ add: false, edit: false, view: false, delete: false });
  const [selectedRow, setSelectedRow] = useState<PurchaseOrderDataType | null>(null);

  const { selectedIconId } = useContext(CustomizerContext) || {};
  const permissions = useMemo(() => {
    return getPermissions(logindata, selectedIconId, 2);
  }, [logindata, selectedIconId]);

  useEffect(() => {
    setData(Array.isArray(enquiries) ? enquiries : []);
  }, [enquiries]);

  useEffect(() => {
    dispatch(getEnquiry());
  }, [dispatch]);

  const handleModal = (type: keyof typeof modals, value: boolean, row?: PurchaseOrderDataType) => {
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

      await dispatch(deleteEnquiry(id)).unwrap();
      toast.success('Enquiry Entry deleted!');
      dispatch(getEnquiry());
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
      columnHelper.accessor('sr_no', {
        header: 'S. No.',
        cell: (info) => (
          <div className="truncate max-w-56">
            <h6 className="text-base">{info.row.original.sr_no}</h6>
          </div>
        ),
      }),
      // columnHelper.accessor('sr_no', { header: 'Serial No.' }),

      columnHelper.accessor('customers', {
        header: 'Company Name',
        cell: (info) => (
          <div className="max-w-[350px] whitespace-normal break-words text-sm">
            <p>{info.row.original.customers?.company_name}</p>
          </div>
        ),
      }),

      columnHelper.accessor('interested_products', {
        header: 'Interested Products',
        cell: (info) => {
          const products = info.row.original.interested_products || [];

          return (
            <div className="max-w-[350px] whitespace-normal text-sm space-y-1">
              {products.length > 0 ? (
                products.map((item: any, index: number) => (
                  <div key={index} className="border-b pb-1">
                    <p>
                      <strong>Product:</strong> {item.product?.product_name}
                    </p>

                    <p>
                      <strong>Grade:</strong> {item.grade}
                    </p>

                    <p>
                      <strong>Person:</strong> {item.sales_name?.username}
                    </p>
                  </div>
                ))
              ) : (
                <span>-</span>
              )}
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
            Create Enquiry
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
            title="Are you sure you want to Delete this Enquiry ?"
            handleConfirmDelete={handleConfirmDelete}
          />
        </Portal>
      )}
      {modals.view && (
        <Portal>
          <ViewEnquiryModal
            placeModal={modals.view}
            setPlaceModal={() => handleModal('view', false)}
            selectedRow={selectedRow}
            modalPlacement="center"
          />
        </Portal>
      )}
      {modals.add && (
        <Portal>
          <EnquiryModal openModal={modals.add} setOpenModal={() => handleModal('add', false)} />
        </Portal>
      )}
      {modals.edit && (
        <Portal>
          <EnquiryEditModal
            openModal={modals.edit}
            setOpenModal={() => handleModal('edit', false)}
            selectedRow={selectedRow}
          />
        </Portal>
      )}
    </div>
  );
};

export default EnquiryTable;
