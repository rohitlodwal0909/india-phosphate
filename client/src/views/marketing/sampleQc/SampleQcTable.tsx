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
// import PurchaseOrderEditModal from './PurchaseOrderEditModal';
// import ViewPurchaseOrderModal from './ViewPurchaseOrderModal';
import {
  deletePurchaseOrder,
  getPurchaseOrders,
  // updatePurchaseOrder,
} from 'src/features/marketing/PurchaseOrderSlice';
import { getSampleRequest } from 'src/features/marketing/SampleRequestSlice';
import ViewSampleModal from './ViewSampleRequestModal';
import { ImageUrl } from 'src/constants/contant';
import SampleQcModal from './SampleQcModal';

interface PurchaseOrderDataType {
  id: number;
  user_id: number;
  sr_no: string;
  qc_status: string;
  interested_products?: any;
  type: string;
  sample_status: string;
}

const columnHelper = createColumnHelper<PurchaseOrderDataType>();

const SampleQcTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const logindata = useSelector((state: RootState) => state.authentication?.logindata) as any;

  const samplerequests = useSelector(
    (state: RootState) => state.samplerequest.samplerequests,
  ) as any;

  const [data, setData] = useState<PurchaseOrderDataType[]>([]);
  const [searchText, setSearchText] = useState('');
  const [modals, setModals] = useState({ add: false, edit: false, view: false, delete: false });
  const [selectedRow, setSelectedRow] = useState<PurchaseOrderDataType | null>(null);

  const { selectedIconId } = useContext(CustomizerContext) || {};
  const permissions = useMemo(() => {
    return getPermissions(logindata, selectedIconId, 7);
  }, [logindata, selectedIconId]);

  useEffect(() => {
    setData(Array.isArray(samplerequests) ? samplerequests : []);
  }, [samplerequests]);

  useEffect(() => {
    dispatch(getSampleRequest());
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

      await dispatch(deletePurchaseOrder(id)).unwrap();
      toast.success('Purchase Order Entry deleted!');
      dispatch(getPurchaseOrders());
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      toast.error(err || 'Delete failed');
    } finally {
      handleModal('delete', false);
    }
  };

  // const handleUpdate = async (rowdata: PurchaseOrderDataType) => {
  //   try {
  //     await dispatch(updatePurchaseOrder(rowdata)).unwrap();
  //     toast.success('Update Purchase Order Successfully');
  //     dispatch(getPurchaseOrders());
  //   } catch (err: any) {
  //     toast.error(err.message || 'Failed to update entry');
  //   } finally {
  //     handleModal('edit', false);
  //   }
  // };

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
      columnHelper.accessor('sr_no', {
        header: 'S. No.',
        cell: (info) => (
          <div className="truncate max-w-56">
            <h6 className="text-base">#{info.row.original.sr_no}</h6>
          </div>
        ),
      }),

      columnHelper.accessor('interested_products', {
        header: 'Products',
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
                      <strong>Qty:</strong> {item.qty}
                    </p>
                    <p>
                      <strong>Uploaded File:</strong>{' '}
                      {item.file && (
                        <a
                          href={ImageUrl + 'uploads/sample-request/' + item.file} // file url from backend
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-600 cursor-pointer"
                        >
                          {/* Dynamic Icon */}
                          {item.file.toLowerCase().endsWith('.pdf') ? (
                            <Icon icon="mdi:file-pdf-box" width={24} />
                          ) : (
                            <Icon icon="mdi:file-image" width={24} />
                          )}
                          View File
                        </a>
                      )}
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

      columnHelper.accessor('type', {
        header: 'Domestic/Export',
        cell: (info) => (
          <div className="max-w-[350px] whitespace-normal break-words text-sm">
            <p>{info.row.original.type}</p>
          </div>
        ),
      }),

      columnHelper.accessor('qc_status', {
        header: 'Sample Status',
        cell: (info) => (
          <div className="max-w-[350px] whitespace-normal break-words text-sm">
            <p>{info.row.original.qc_status || '-'}</p>
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
              {permissions.add && (
                <Tooltip content="Add">
                  <Button
                    onClick={() => handleModal('add', true, row)}
                    color="primary"
                    outline
                    size="xs"
                    className="text-primary bg-lightprimary hover:text-white"
                  >
                    <Icon icon="material-symbols:add-rounded" height={18} />
                  </Button>
                </Tooltip>
              )}
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
        {/* {permissions.add && (
          <Button
            onClick={() => handleModal('add', true)}
            color="primary"
            outline
            size="sm"
            className="border border-primary bg-primary text-white rounded-md"
          >
            Create Sample Qc
          </Button>
        )} */}
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
            title="Are you sure you want to Delete this Purchase Order ?"
            handleConfirmDelete={handleConfirmDelete}
          />
        </Portal>
      )}
      {modals.view && (
        <Portal>
          <ViewSampleModal
            placeModal={modals.view}
            setPlaceModal={() => handleModal('view', false)}
            selectedRow={selectedRow}
            modalPlacement="center"
          />
        </Portal>
      )}
      {modals.add && (
        <Portal>
          <SampleQcModal
            openModal={modals.add}
            row={selectedRow}
            setOpenModal={() => handleModal('add', false)}
          />
        </Portal>
      )}
      {/* {modals.edit && (
        <Portal>
          <PurchaseOrderEditModal
            openModal={modals.edit}
            setOpenModal={() => handleModal('edit', false)}
            selectedRow={selectedRow}
            handleupdated={handleUpdate}
          />
        </Portal>
      )} */}
    </div>
  );
};

export default SampleQcTable;
