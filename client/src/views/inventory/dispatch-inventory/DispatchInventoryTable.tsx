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
import VehicleDispatchModal from './VehicleDispatchModal';
import VehicleDispatchEditModal from './VehicleDispatchEditModal';
import ViewDispatchModal from './ViewDispatchModal';
import Portal from 'src/utils/Portal';
import { triggerGoogleTranslateRescan } from 'src/utils/triggerTranslateRescan';
import { AppDispatch, RootState } from 'src/store';
import {
  deleteDispatch,
  GetFetchDispatch,
  updateDispatch,
} from 'src/features/Inventorymodule/dispatchmodule/DispatchSlice';
import { GetStoremodule } from 'src/features/Inventorymodule/storemodule/StoreInventorySlice';
import { GetAllQcbatch } from 'src/features/Inventorymodule/Qcinventorymodule/QcinventorySlice';
import { GetFetchProduction } from 'src/features/Inventorymodule/productionmodule/ProdutionSlice';
import { CustomizerContext } from 'src/context/CustomizerContext';
import { getPermissions } from 'src/utils/getPermissions';

interface DispatchDataType {
  id: number;
  vehicle_number: string;
  driver_details: string;
  product_name: string;
  quantity: string;
  unit: string;
  delivery_location: string;
  batch_numbers: string | { label: string }[];
  delivered_by: string;
  invoice_number: string;
  remarks: string;
}

const columnHelper = createColumnHelper<DispatchDataType>();

const DispatchInventoryTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const logindata = useSelector((state: RootState) => state.authentication?.logindata) as any;
  const vehicledata = useSelector((state: RootState) => state.dispatchData.dispatchdata) as any;
  const qcAlldata = useSelector((state: RootState) => state.qcinventory.qcbatchdata) as any;
  const ProductionAlldata = useSelector(
    (state: RootState) => state.productionData.productiondata,
  ) as any;

  const [data, setData] = useState<DispatchDataType[]>([]);
  const [filteredProductionData, setFilteredProductionData] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [modals, setModals] = useState({ add: false, edit: false, view: false, delete: false });
  const [selectedRow, setSelectedRow] = useState<DispatchDataType | null>(null);

  const { selectedIconId } = useContext(CustomizerContext) || {};
  const permissions = useMemo(() => {
    return getPermissions(logindata, selectedIconId, 7);
  }, [logindata, selectedIconId]);

  useEffect(() => {
    setData(Array.isArray(vehicledata?.data) ? vehicledata.data : []);
  }, [vehicledata?.data]);

  useEffect(() => {
    if (!Array.isArray(ProductionAlldata?.data) || !Array.isArray(qcAlldata?.data)) {
      setFilteredProductionData([]);
      return;
    }

    const batchIds = ProductionAlldata.data
      .filter((i) => i.rm_code && i.quantity)
      .map((i) => String(i.batch_id));

    const filtered = qcAlldata.data.filter((i) => batchIds.includes(String(i.id)));

    setFilteredProductionData(filtered || []);
  }, [qcAlldata, ProductionAlldata]);

  useEffect(() => {
    dispatch(GetStoremodule());
    dispatch(GetAllQcbatch());
    dispatch(GetFetchProduction());
    dispatch(GetFetchDispatch());
  }, [dispatch]);

  const handleModal = (type: keyof typeof modals, value: boolean, row?: DispatchDataType) => {
    setSelectedRow(row || null);
    setModals((prev) => ({ ...prev, [type]: value }));
    setTimeout(triggerGoogleTranslateRescan, 200);
  };

  const handleConfirmDelete = async () => {
    if (!selectedRow?.id) return toast.error('No entry selected.');
    try {
      await dispatch(deleteDispatch(selectedRow.id)).unwrap();
      toast.success('Dispatch Entry deleted!');
      dispatch(GetStoremodule());
      setData((prev) => prev.filter((item) => item.id !== selectedRow.id));
    } catch (err: any) {
      toast.error(err.message || 'Delete failed');
    } finally {
      handleModal('delete', false);
    }
  };

  const handleUpdate = async (rowdata: DispatchDataType) => {
    try {
      await dispatch(updateDispatch(rowdata)).unwrap();
      toast.success('Update Dispatch Entry Successfully');
      dispatch(GetFetchDispatch());
      dispatch(GetStoremodule());
    } catch (err: any) {
      toast.error(err.message || 'Failed to update entry');
    } finally {
      handleModal('edit', false);
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
      columnHelper.accessor('vehicle_number', { header: 'Vehicle Number' }),
      columnHelper.accessor('driver_details', { header: 'Driver' }),
      columnHelper.accessor('product_name', { header: 'Product' }),
      columnHelper.accessor('quantity', {
        header: 'Quantity',
        cell: (info) => (
          <span>
            {info.getValue()} {info.row.original.unit || ''}
          </span>
        ),
      }),
      columnHelper.accessor('batch_numbers', {
        header: 'Batch Numbers',
        cell: (info) => {
          const val =
            typeof info.row.original.batch_numbers === 'string'
              ? JSON.parse(info.row.original.batch_numbers || '[]')
              : info.row.original.batch_numbers;
          return Array.isArray(val) ? val.map((v) => v.label).join(', ') : '';
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="flex gap-2 notranslate" translate="no">
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
      <div className="flex justify-end mb-2">
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
            Add Dispatch Entry
          </Button>
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
            title="Are you sure you want to Delete this Dispatch Entry ?"
            handleConfirmDelete={handleConfirmDelete}
          />
        </Portal>
      )}
      {modals.view && (
        <Portal>
          <ViewDispatchModal
            placeModal={modals.view}
            setPlaceModal={() => handleModal('view', false)}
            selectedRow={selectedRow}
            modalPlacement="center"
          />
        </Portal>
      )}
      {modals.add && (
        <Portal>
          <VehicleDispatchModal
            openModal={modals.add}
            setOpenModal={() => handleModal('add', false)}
            StoreData={filteredProductionData}
            logindata={logindata}
          />
        </Portal>
      )}
      {modals.edit && (
        <Portal>
          <VehicleDispatchEditModal
            openModal={modals.edit}
            setOpenModal={() => handleModal('edit', false)}
            selectedRow={selectedRow}
            StoreDatas={filteredProductionData}
            handleupdated={handleUpdate}
            logindata={logindata}
          />
        </Portal>
      )}
    </div>
  );
};

export default DispatchInventoryTable;
