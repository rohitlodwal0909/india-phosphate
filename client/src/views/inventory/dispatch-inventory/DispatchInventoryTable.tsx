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


const logindata = JSON.parse(localStorage.getItem("logincheck") || "{}");
  const [searchText, setSearchText] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [EditModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [ViewModal, setViewModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<DispatchDataType | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const StoreData = useSelector((state: any) => state.storeinventory.storedata);
  const vehicledata = useSelector((state: any) => state.dispatchData.dispatchdata);
   const [data, setData] = useState<any[]>(vehicledata?.data || []);
 
  const getPermissions = (logindata: any, submoduleId: number) =>
  logindata?.permission?.filter((p: any) => p.submodule_id === submoduleId && p.status === true) || [];

 const hasViewPermission = getPermissions(logindata, 5).some(p => p.permission_id === 1);
 const hasAddPermission = logindata?.permission?.some(
  (p: any) =>
     p.submodule_id === 5 &&
    p.permission_id === 2 &&
    p.status === true
);
useEffect(()=>{
setData(vehicledata?.data || [])
},[vehicledata?.data])
 useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const result = await dispatch(GetStoremodule());
        if (GetStoremodule.rejected.match(result)) return console.error("Store Module Error:", result.payload || result.error.message);
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };
     const fetchdispatch = async () => {
      try {
        const result = await dispatch(GetFetchDispatch());
        if (GetFetchDispatch.rejected.match(result)) return console.error("Store Module Error:", result.payload || result.error.message);
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };
    fetchStoreData()
    fetchdispatch()
  }, [])
  const handleAdd = () => {
  
    setOpenModal(true);
  };

   const handleEdit = (row: DispatchDataType) => {
    setSelectedRow(row);
    setEditModal(true);
  };

 const handleupdated=async(rowdata)=>{
 if (!rowdata?.id) return toast.error("No entry selected.");
  try {
       const res = await dispatch(updateDispatch(rowdata)).unwrap();
       if (res) {
         toast.success("Update Dispatch Entry  Successfully");
            dispatch(GetFetchDispatch())
            dispatch(GetStoremodule())
       }
     } catch (err: any) {
       toast.error(err.message || "Failed to update entry");
     }
 
 
 }
 const handleConfirmDelete = async () => {
    if (!selectedRow?.id) return toast.error("No entry selected.");
    
        try {
          const res = await   dispatch(deleteDispatch(selectedRow?.id)).unwrap();
          if (res) {
            toast.success("Dispatch Entry deleted!");
            dispatch(GetStoremodule())
            setData(prev => prev.filter(item => item.id !== selectedRow.id));
          }
        } catch (err: any) {
          toast.error(err.message || "Delete failed");
        } finally {
          setDeleteModal(false);
        }
  
   
 }
  const filteredData = useMemo(() => {
    return data?.filter(item => {
      return Object.values(item).some(v => v.toString().toLowerCase().includes(searchText.toLowerCase()));
    });
  }, [data, searchText]);

  const columns = [
   columnHelper.accessor('id', { header: 'Dispatch ID' ,  cell: info => <h6 className="text-base">#{info.row.original?.id}</h6>}),
  columnHelper.accessor('vehicle_number', { header: 'Vehicle Number' }),
  columnHelper.accessor('driver_details', { header: 'Driver' }),
  columnHelper.accessor('product_name', { header: 'Product' }),
  columnHelper.accessor('quantity', {
     header: 'Quantity',
      cell: info => {
        const rowData = info.row.original.quantity;
        const unit = info.row.original.unit;
          return ( <span> {rowData}.{unit}</span>)
      }

     }),
  // columnHelper.accessor('deliveryLocation', { header: 'Delivery Location' }),
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
           const perms = getPermissions(logindata, 5);
        return (<div className="flex gap-2">

          <Tooltip content="View">
           <Button onClick={() => {setViewModal(true),setSelectedRow(rowData)}} color="primary" outline size="xs" className="  text-primary bg-lightprimary hover:text-white">
            <Icon icon="solar:eye-outline"height={18} />
          </Button>
          </Tooltip>
       {  perms.some(p => p.permission_id === 3) &&
           <Tooltip content="Edit"><Button size="sm" className="p-0 bg-lightsuccess text-success hover:bg-success hover:text-white" onClick={() => handleEdit(rowData)}><Icon icon="solar:pen-outline" height={18} /></Button></Tooltip>
}
 {  perms.some(p => p.permission_id === 4) &&
                       <Tooltip content="Delete"><Button size="sm" color="lighterror" className="p-0" onClick={() =>  { triggerGoogleTranslateRescan(), setSelectedRow(rowData), setDeleteModal(true); }}><Icon icon="solar:trash-bin-minimalistic-outline" height={18} /></Button></Tooltip>
 }
        </div>
        );
      }
    })
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

          <Button onClick={() => handleAdd()} color="primary" outline size="sm" className="border border-primary  bg-primary text-white rounded-md">
            {/* <Icon icon="material-symbols:add-rounded" height={18} /> */}
            Add Dispatch Entry
          </Button>
}
      </div>
      {hasViewPermission ? (  <>
       <div className="w-full overflow-x-auto">
        <TableComponent table={table} flexRender={flexRender} columns={columns} />
      </div>
        <PaginationComponent table={table} />
        </>
      ):(<div className="flex flex-col items-center justify-center my-20 space-y-4">
          <Icon icon="fluent:person-prohibited-20-filled" className="text-red-500" width="60" height="60" />
          <div className="text-red-600 text-xl font-bold text-center px-4">
            You do not have permission to view this table.
          </div>
          <p className="text-sm text-gray-500 text-center px-6">Please contact your administrator.</p>
        </div>
        )
      }
         <ComonDeletemodal
        isOpen={deleteModal}
        setIsOpen={setDeleteModal}
        selectedUser={selectedRow}
        title="Are you sure you want to Delete this Dispatch Entry ?"
        handleConfirmDelete={handleConfirmDelete}
         />
              {ViewModal && (
            <ViewDispatchModal
              placeModal={ViewModal}
              setPlaceModal={setViewModal}
              selectedRow={selectedRow}
              modalPlacement="center"
            />)}
      <VehicleDispatchModal openModal={openModal} setOpenModal={setOpenModal} StoreData={StoreData} />
      <VehicleDispatchEditModal openModal={EditModal} setOpenModal={setEditModal} selectedRow={selectedRow} handleupdated={handleupdated} />
    </div>
  );
};

export default DispatchInventoryTable;
