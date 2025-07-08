import {
  flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel,
  getSortedRowModel, useReactTable, createColumnHelper
} from "@tanstack/react-table";

import { Badge, Button  } from "flowbite-react";
import { Icon } from "@iconify/react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { deleteCheckin, GetCheckinmodule } from "src/features/Inventorymodule/guardmodule/GuardSlice";
import { GetStoremodule, ShowStore } from "src/features/Inventorymodule/storemodule/StoreInventorySlice";
// import { formatDate, formatTime } from "src/utils/Datetimeformate";s
import { triggerGoogleTranslateRescan } from "src/utils/triggerTranslateRescan"; // Make sure path is correct
import ComonDeletemodal from "src/utils/deletemodal/ComonDeletemodal";
import PaginationComponent from "src/utils/PaginationComponent";
import TableComponent from "src/utils/TableComponent";
import StoreInventoryAddmodal from "./StoreInventoryAddmodal";
import ViewStoremodel from "./ViewStoremodel";
import { AppDispatch } from "src/store";
import Portal from "src/utils/Portal"; // Make sure path is correct

const columnHelper = createColumnHelper<any>();
function GRNEntryTable() {
  const [isOpens, setIsOpens] = useState(false); // State for delete modal
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [placeModals, setPlaceModals] = useState(false); // State for Add/Edit StoreInventory modal
  const [viewModals, setViewModals] = useState(false); // State for View StoreInventory modal
  const [filters, setFilters] = useState({ guard_type: '' });
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState<any[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  const guardData = useSelector((state: any) => state.checkininventory.checkindata);
  const StoreData = useSelector((state: any) => state.storeinventory.storedata);

  const logindata = useMemo(() => {
    try {
      const storedData = localStorage.getItem("logincheck");
      return storedData ? JSON.parse(storedData) : {};
    } catch (e) {
      console.error("Error parsing logincheck from localStorage:", e);
      return {};
    }
  }, []);

  const hasAddPermission = logindata?.permission?.some(p => p.submodule_id === 2 && p.permission_id === 2 && p.status === true) || false;
  const hasViewPermission = logindata?.permission?.some(p => p.submodule_id === 2 && p.permission_id === 1 && p.status === true) || false;

  useEffect(() => {
    if (!logindata?.admin?.id) {
      console.warn("Admin ID not found in login data. Cannot fetch module data.");
      return;
    }
    dispatch(GetCheckinmodule(logindata.admin.id));
    dispatch(GetStoremodule());
  }, [dispatch, logindata?.admin?.id]);

  useEffect(() => {
    setData(Array.isArray(guardData?.data) ? guardData.data : []);
  }, [guardData]);

  // Unified handler for opening any modal
  const openModalAndRescan = (setModalState: React.Dispatch<React.SetStateAction<boolean>>, row: any = null, delay = 200) => {
    setSelectedRow(row);
    setModalState(true);
    // Trigger rescan *after* React has had a moment to render the modal DOM
    setTimeout(triggerGoogleTranslateRescan, delay);
  };

  // Unified handler for closing any modal from its own onClose prop
  // This is called by Flowbite's Modal when closed by user (esc, click outside)
  const handleModalOnClose = (setModalState: React.Dispatch<React.SetStateAction<boolean>>, delay = 200) => {
    // Set modal state to false first
    setModalState(false);
    // Then, after a short delay to allow React to unmount the modal, rescan
    setTimeout(triggerGoogleTranslateRescan, delay);
  };


  const handleAddEditStoreInventory = (row: any) => {
    openModalAndRescan(setPlaceModals, row);
  };

  const handleView = async (row: any) => {
    openModalAndRescan(setViewModals, null, 400); // Pass null initially for selectedRow for async fetch
    try {
      const res = await dispatch(ShowStore(row?.id)).unwrap();
      setSelectedRow(res?.data); // Set actual data after fetch
      setTimeout(triggerGoogleTranslateRescan, 200); // Rescan again after data is loaded into view modal
    } catch (err) {
      console.error("View error", err);
      toast.error("Failed to fetch store details.");
    }
  };

  const handleDelete = (row: any) => {
    openModalAndRescan(setIsOpens, row);
  };

  const handleConfirmDelete = async () => {
    if (!selectedRow?.id) {
      toast.error("No entry selected for deletion.");
      return;
    }
    try {
      await dispatch(deleteCheckin(selectedRow.id)).unwrap();
      setData(prev => prev.filter(u => u.id !== selectedRow.id));
      toast.success("Guard entry deleted");
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    } finally {
      // Direct close and rescan after API call
      setIsOpens(false);
      setTimeout(triggerGoogleTranslateRescan, 200);
    }
  };

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const guardTypeValue = item.guard_type || '';
      const searchValue = searchText || '';
      const byType = !filters.guard_type || guardTypeValue.toLowerCase().includes(filters.guard_type.toLowerCase());
      const bySearch = !searchValue || Object.values(item).some(v => {
        if (v == null) return false;
        return String(v).toLowerCase().includes(searchValue.toLowerCase());
      });
      return byType && bySearch;
    });
  }, [data, filters, searchText]);

  const getPermissions = (loginDataObj: any, submoduleId: number) => {
    if (!loginDataObj || !Array.isArray(loginDataObj.permission)) {
      return [];
    }
    return logindata.permission.filter((p: any) => p.submodule_id === submoduleId && p.status === true);
  };
 

  const columns = useMemo(() => {
    const perms = getPermissions(logindata, 2); // Submodule ID 2 for Store Module
    const canAddStore = perms.some(p => p.permission_id === 2);
    const canViewStore = perms.some(p => p.permission_id === 1);
    const canDeleteGuardEntry = perms.some(p => p.permission_id === 4);

    return [
      columnHelper.accessor("inward_number", {
        header: "Inward Number",
        cell: info => <div className="truncate max-w-56 text-base"><h6>{info.getValue() || "-"}</h6></div>
      }),
      columnHelper.accessor("guard_type", { header: "Guard Type", cell: info => info.getValue() || "-" }),
      // columnHelper.accessor("vehicle_number", { header: "Vehicle", cell: info => info.getValue() || "-" }),
       columnHelper.accessor("rmcode", {
        header: "RM Code",
        cell: info => {
          const row = info.row.original;
          const storeItem = StoreData?.data?.find(i => i.guard_entry_id === row.id);
          return (storeItem?.store_rm_code !== null && storeItem?.store_rm_code !== undefined) ? `${storeItem?.store_rm_code} ` : "-";
        }
      }),
      columnHelper.accessor("quantity_net", {
        header: "Net Quantity",
        cell: info => {
          const row = info.row.original;
          const storeItem = StoreData?.data?.find(i => i.guard_entry_id === row.id);
          return (storeItem?.container_count !== null && storeItem?.container_count !== undefined) ? `${storeItem?.container_count} ${storeItem?.container_unit || ''}` : "-";
        }
      }),
      
      // columnHelper.display({
      //   id: "entry_date_time",
      //   header: "Entry Date Time",
      //   cell: info => {
      //     const { entry_date, entry_time } = info.row.original;
      //     const formattedDate = entry_date ? formatDate(entry_date) : '-';
      //     const formattedTime = entry_time ? formatTime(entry_time) : '-';
      //     return (
      //       <div>
      //         <p>{formattedDate}</p>
      //         <span>{formattedTime}</span>
      //       </div>
      //     );
      //   }
      // }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const rowData = info.row.original;
          const storeItem = StoreData?.data?.find(item => item.guard_entry_id == rowData.id);
          const status = storeItem?.qa_qc_status || "New";
          const statusColorMap: { [key: string]: 'secondary' | 'warning' | 'primary' | 'error' | 'success' } = {
            NEW: "secondary", PENDING: "warning", APPROVED: "primary", REJECTED: "error", HOLD: "success",
          };
          const color = statusColorMap[status.toUpperCase()] || "secondary";
          return <Badge color={color} className="capitalize">{status}</Badge>;
        },
      }),
//     columnHelper.accessor("production_status", {
//   header: "Production Status",
//   cell: (info) => {
//     const rowData = info.row.original;
//     const storeItem = StoreData?.data?.find(
//       (item) => item.guard_entry_id == rowData.id
//     );
//     const status = (storeItem?.production_status || "").toUpperCase();

//     // Badge 컬러 맵
//     const statusColorMap: {
//       [key: string]: 'secondary' | 'warning' | 'primary' | 'error' | 'success';
//     } = {
//       "-": "secondary",
//       PENDING: "warning",
//       ISSUE: "primary",
//       REJECTED: "error",
//     };

//     // PENDING일 때만 Dropdown
//     if (status === "ISSUE") {
//       return (
//         <Badge color={statusColorMap[status] || "secondary"} className="capitalize">
//            {status === "ISSUE" && "Issued" }
//                </Badge>
        
//       );
//     }

//     // 그 외에는 Badge
//     return (
//      "No Request"
//     );
//   },
// }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: info => {
          const row = info.row.original;
          const storeItem = StoreData?.data?.find(i => i.guard_entry_id === row.id);

          return (
            <div className="flex gap-2 notranslate" translate="no">
              
              {!storeItem && hasAddPermission && canAddStore && (
                <Button key="add-button" size="sm" title="Add Store Entry" className="p-0 bg-lightsuccess text-success hover:bg-success hover:text-white"
                  onClick={() => handleAddEditStoreInventory(row)}><Icon icon="material-symbols:add-rounded" height={18} /></Button>
              )}
              {storeItem && canViewStore && (
                <Button key="view-button" size="sm" title="View Store Entry" color="lightprimary" className="p-0"
                  onClick={() => handleView(row)}><Icon icon="solar:eye-outline" height={18} /></Button>
              )}
              {canDeleteGuardEntry && (
                <Button key="delete-button" size="sm" title="Delete Guard Entry" color="lighterror" className="p-0"
                  onClick={() => handleDelete(row)}><Icon icon="solar:trash-bin-minimalistic-outline" height={18} /></Button>
              )}
             
            </div>
          );
        },
        enableSorting: false,
        enableColumnFilter: false
      })
    ];
  }, [StoreData, logindata, hasAddPermission, handleAddEditStoreInventory, handleView, handleDelete]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } }
  });

  return (
    <>
      {hasViewPermission ? (
        <>
          <div className="search-input flex justify-end mb-3">
            <input type="text" placeholder="Search..." value={searchText}
              onChange={e => setSearchText(e.target.value)}
              className="me-2 p-2 border rounded-md border-gray-300" />
            <select value={filters.guard_type}
              onChange={e => setFilters(prev => ({ ...prev, guard_type: e.target.value }))}
              className="p-2 border rounded-md border-gray-300">
              <option value="">Select Guard Type</option>
              <option value="Vehicle">Vehicle</option>
              <option value="Courier">Courier</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <TableComponent table={table} flexRender={flexRender} columns={columns} />
          </div>
          <PaginationComponent table={table} />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center my-20 space-y-4">
          <Icon icon="fluent:person-prohibited-20-filled" className="text-red-500" width="60" height="60" />
          <div className="text-red-600 text-xl font-bold text-center px-4">You do not have permission to view this table.</div>
          <p className="text-sm text-gray-500 text-center px-6">Please contact your administrator if you believe this is an error.</p>
        </div>
      )}

      {/* Modals - ALL WRAPPED WITH PORTAL */}
      {/* Ensure onClose uses the centralized handleModalOnClose function */}
      {isOpens && (
        <Portal>
          <ComonDeletemodal
            isOpen={isOpens}
            setIsOpen={() => handleModalOnClose(setIsOpens)} // Pass a function to setModalState
            selectedUser={selectedRow}
            title="Are you sure you want to Delete this Store Entry?"
            handleConfirmDelete={handleConfirmDelete}
          />
        </Portal>
      )}

      {placeModals && (
        <Portal>
          <StoreInventoryAddmodal
            setPlaceModal={() => handleModalOnClose(setPlaceModals)} // Pass a function to setModalState
            modalPlacement="center"
            selectedRow={selectedRow}
            placeModal={placeModals}
          />
        </Portal>
      )}

      {viewModals && (
        <Portal>
          <ViewStoremodel
            setPlaceModal={() => handleModalOnClose(setViewModals, 400)} // Pass a function to setModalState, longer delay for view
            modalPlacement="center"
            selectedRow={selectedRow}
            placeModal={viewModals}
          />
        </Portal>
      )}
    </>
  );
}

export default GRNEntryTable;