import { useEffect, useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  createColumnHelper,
} from "@tanstack/react-table";
import { Button, Tooltip } from "flowbite-react";
import { Icon } from "@iconify/react";
import TableComponent from "src/utils/TableComponent";
import PaginationComponent from "src/utils/PaginationComponent";
import VehicleDispatchModal from "./VehicleDispatchModal";
import VehicleDispatchEditModal from "./VehicleDispatchEditModal";
import ComonDeletemodal from '../../../utils/deletemodal/ComonDeletemodal'
import { triggerGoogleTranslateRescan } from "src/utils/triggerTranslateRescan";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "src/store";
import { deleteDispatch, GetFetchDispatch, updateDispatch } from "src/features/Inventorymodule/dispatchmodule/DispatchSlice";
import ViewDispatchModal from "./ViewDispatchModal";
import { GetStoremodule } from "src/features/Inventorymodule/storemodule/StoreInventorySlice";
import Portal from "src/utils/Portal"; // Make sure this path is correct and Portal is robust
import { GetAllQcbatch } from "src/features/Inventorymodule/Qcinventorymodule/QcinventorySlice";
import { GetFetchProduction } from "src/features/Inventorymodule/productionmodule/ProdutionSlice";

interface DispatchDataType {
  id: number;
  vehicle_number: string;
  driver_details: string;
  product_name: string;
  quantity: string;
  unit: string;
  delivery_location: string;
  batch_numbers: any;
  delivered_by: string;
  invoice_number: string;
  remarks: string;
}

const columnHelper = createColumnHelper<DispatchDataType>();

const DispatchInventoryTable = () => {

  const logindata = useMemo(() => {
    try {
      const storedData = localStorage.getItem("logincheck");
      return storedData ? JSON.parse(storedData) : {};
    } catch (e) {
      console.error("Error parsing logincheck from localStorage:", e);
      return {};
    }
  }, []);

  const [searchText, setSearchText] = useState('');
  const [openModal, setOpenModal] = useState(false); // Add modal
  const [EditModal, setEditModal] = useState(false); // Edit modal
  const [deleteModal, setDeleteModal] = useState(false); // Delete confirmation modal
  const [ViewModal, setViewModal] = useState(false); // View modal
  const [selectedRow, setSelectedRow] = useState<DispatchDataType | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  // const StoreData = useSelector((state: any) => state.storeinventory.storedata);
  const vehicledata = useSelector((state: any) => state.dispatchData.dispatchdata);
  const [data, setData] = useState<any[]>(vehicledata?.data || []);
  const qcAlldata = useSelector((state: any) => state.qcinventory.qcbatchdata);
  const ProductionAlldata = useSelector((state: any) => state.productionData.productiondata);
const [filteredProductionData, setFilteredProductionData] = useState<any>([]);

 useEffect(() => {
  if (!Array.isArray(qcAlldata?.data) || !Array.isArray(ProductionAlldata?.data)) {
    setFilteredProductionData([]);
    return;
  }
 const batchIds = ProductionAlldata?.data?.filter((item: any) => item.rm_code  && item.quantity )
  .map((item: any) => String(item.batch_id));

  
  const filtered = qcAlldata?.data?.filter((item: any) =>
    batchIds.includes(String(item.id)) 
  );

  setFilteredProductionData(filtered);
}, [qcAlldata, ProductionAlldata]);
  const getPermissions = (loginDataObj: any, submoduleId: number) =>
    loginDataObj?.permission?.filter((p: any) => p.submodule_id === submoduleId && p.status === true) || [];

  const hasViewPermission = getPermissions(logindata, 7).some(p => p.permission_id === 1);
  const hasAddPermission = getPermissions(logindata, 7).some(p => p.permission_id === 2);
  const hasEditPermission = getPermissions(logindata, 7).some(p => p.permission_id === 3);
  const hasDeletePermission = getPermissions(logindata, 7).some(p => p.permission_id === 4);


  useEffect(() => {
    setData(vehicledata?.data || [])
  }, [vehicledata?.data])

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(GetStoremodule()).unwrap();
      } catch (error) {
        console.error("Store Module Error:", error);
      }
       try {
        await dispatch(GetAllQcbatch()).unwrap();
      } catch (error) {
        console.error("Store Module Error:", error);
      }
       try {
        await dispatch(GetFetchProduction()).unwrap();
      } catch (error) {
        console.error("Store Module Error:", error);
      }
      
      try {
        await dispatch(GetFetchDispatch()).unwrap();
      } catch (error) {
        console.error("Dispatch Module Error:", error);
      }
    };
    fetchData();
  }, [dispatch]);

  // Centralized function to close modals and trigger rescan
  const closeModalAndRescan = (setModalState: React.Dispatch<React.SetStateAction<boolean>>, delay = 200) => {
    // This timeout delays the actual state change, giving Flowbite-React's modal
    // time to start its close animation/cleanup before React fully unmounts.
    setTimeout(() => {
      setModalState(false);
      // This timeout triggers rescan *after* the modal state is false
      // and hopefully after the modal is visually gone from the DOM.
      setTimeout(triggerGoogleTranslateRescan, delay);
    }, 50); // Small initial delay before setting state to false
  };

  const handleAdd = () => {
    setOpenModal(true);
    // Trigger rescan *after* the modal state is set to true
    setTimeout(triggerGoogleTranslateRescan, 200);
  };

  const handleEdit = (row: DispatchDataType) => {
    setSelectedRow(row);
    setEditModal(true);
    // Trigger rescan *after* the modal state is set to true
    setTimeout(triggerGoogleTranslateRescan, 200);
  };

  const handleupdated = async (rowdata: DispatchDataType) => {
    if (!rowdata?.id) {
      toast.error("No entry selected.");
      return;
    }
    try {
      const res = await dispatch(updateDispatch(rowdata)).unwrap();
      if (res) {
        toast.success("Update Dispatch Entry Successfully");
        dispatch(GetFetchDispatch());
        dispatch(GetStoremodule());
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update entry");
    } finally {
      // Use the centralized close and rescan function
      closeModalAndRescan(setEditModal);
    }
  }

  const handleDeleteClick = (row: DispatchDataType) => {
    setSelectedRow(row);
    setDeleteModal(true);
    // Trigger rescan *after* the modal state is set to true
    setTimeout(triggerGoogleTranslateRescan, 200);
  };

  const handleConfirmDelete = async () => {
    if (!selectedRow?.id) {
      toast.error("No entry selected.");
      return;
    }
    try {
      const res = await dispatch(deleteDispatch(selectedRow.id)).unwrap();
      if (res) {
        toast.success("Dispatch Entry deleted!");
        dispatch(GetStoremodule());
        setData(prev => prev.filter(item => item.id !== selectedRow.id));
      }
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    } finally {
      // Use the centralized close and rescan function
      closeModalAndRescan(setDeleteModal);
    }
  }

  const handleViewClick = (row: DispatchDataType) => {
    setSelectedRow(row);
    setViewModal(true);
    // Trigger rescan *after* the modal state is set to true
    setTimeout(triggerGoogleTranslateRescan, 400); // Longer delay for view modals
  };

  const filteredData = useMemo(() => {
    return data?.filter(item => {
      return Object.values(item).some(v => String(v || '').toLowerCase().includes(searchText.toLowerCase()));
    });
  }, [data, searchText]);

  const columns = useMemo(() => [
 columnHelper.accessor("id", {
      header: "S. No.",
  cell: (info) => {
    const rowIndex = info.row.index + 1; // `+1` for 1-based indexing
    return (
      <div className="truncate max-w-56">
        <h6 className="text-base">#{rowIndex}</h6>
      </div>
    );
  },
    }),
    columnHelper.accessor('vehicle_number', { header: 'Vehicle Number' }),
    columnHelper.accessor('driver_details', { header: 'Driver' }),
    columnHelper.accessor('product_name', { header: 'Product' }),
    columnHelper.accessor('quantity', {
      header: 'Quantity',
      cell: info => {
        const rowData = info.row.original.quantity;
        const unit = info.row.original.unit;
        return (<span> {rowData}{unit ? ` ${unit}` : ''}</span>)
      }
    }),
    columnHelper.accessor('batch_numbers', {
      header: 'Batch Numbers',
      cell: info => {
        let value = info.row.original.batch_numbers;
        if (typeof value === 'string') {
          try {
            value = JSON.parse(value);
          } catch (e) {
            return '';
          }
        }
        if (Array.isArray(value)) {
          return value.map((v: any) => v.label).join(', ');
        }
        return '';
      }
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: info => {
        const rowData = info.row.original;
        return (
          <div className="flex gap-2 notranslate" translate="no">
            {hasViewPermission && (
              <Tooltip content="View">
                <Button onClick={() => handleViewClick(rowData)} color="primary" outline size="xs" className="text-primary bg-lightprimary hover:text-white">
                  <Icon icon="solar:eye-outline" height={18} />
                </Button>
              </Tooltip>
            )}
            {hasEditPermission && (
              <Tooltip content="Edit">
                <Button size="sm" className="p-0 bg-lightsuccess text-success hover:bg-success hover:text-white" onClick={() => handleEdit(rowData)}>
                  <Icon icon="solar:pen-outline" height={18} />
                </Button>
              </Tooltip>
            )}
            {hasDeletePermission && (
              <Tooltip content="Delete">
                <Button size="sm" color="lighterror" className="p-0" onClick={() => handleDeleteClick(rowData)}>
                  <Icon icon="solar:trash-bin-minimalistic-outline" height={18} />
                </Button>
              </Tooltip>
            )}
          </div>
        );
      }
    })
  ], [hasViewPermission, hasEditPermission, hasDeletePermission, handleEdit, handleDeleteClick, handleViewClick]);

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
        {hasViewPermission &&
          <input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="me-2 p-2 border rounded-md border-gray-300"
          />
        }
        {hasAddPermission &&
          <Button onClick={handleAdd} color="primary" outline size="sm" className="border border-primary bg-primary text-white rounded-md">
            Add Dispatch Entry
          </Button>
        }
      </div>
      {hasViewPermission ? (
        <>
          <div className="w-full overflow-x-auto">
            <TableComponent table={table} flexRender={flexRender} columns={columns} />
          </div>
          <PaginationComponent table={table} />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center my-20 space-y-4">
          <Icon icon="fluent:person-prohibited-20-filled" className="text-red-500" width="60" height="60" />
          <div className="text-red-600 text-xl font-bold text-center px-4">
            You do not have permission to view this table.
          </div>
          <p className="text-sm text-gray-500 text-center px-6">Please contact your administrator.</p>
        </div>
      )}

      {/* Modals - ALL WRAPPED WITH PORTAL */}
      {/* Ensure onClose uses the centralized function */}

      {deleteModal && (
        <Portal>
          <ComonDeletemodal
            isOpen={deleteModal}
            setIsOpen={() => closeModalAndRescan(setDeleteModal)} // Use centralized close
            selectedUser={selectedRow}
            title="Are you sure you want to Delete this Dispatch Entry ?"
            handleConfirmDelete={handleConfirmDelete}
          />
        </Portal>
      )}

      {ViewModal && (
        <Portal>
          <ViewDispatchModal
            placeModal={ViewModal}
            setPlaceModal={() => closeModalAndRescan(setViewModal, 400)} // Use centralized close, longer delay for view
            selectedRow={selectedRow}
            modalPlacement="center"
          />
        </Portal>
      )}

      {openModal && (
        <Portal>
          <VehicleDispatchModal
            openModal={openModal}
            setOpenModal={() => closeModalAndRescan(setOpenModal)} // Use centralized close
            StoreData={filteredProductionData}
          />
        </Portal>
      )}

      {EditModal && (
        <Portal>
          <VehicleDispatchEditModal
            openModal={EditModal}
            setOpenModal={() => closeModalAndRescan(setEditModal)} // Use centralized close
            selectedRow={selectedRow}
            handleupdated={handleupdated}
          />
        </Portal>
      )}
    </div>
  );
};

export default DispatchInventoryTable;