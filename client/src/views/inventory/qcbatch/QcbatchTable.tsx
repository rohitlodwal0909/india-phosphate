import {
  flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel,
  getSortedRowModel, useReactTable, createColumnHelper
} from "@tanstack/react-table";
import { Button, Tooltip } from "flowbite-react";
import { Icon } from "@iconify/react";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { triggerGoogleTranslateRescan } from "src/utils/triggerTranslateRescan";
import { toast } from "react-toastify";
import ComonDeletemodal from '../../../utils/deletemodal/ComonDeletemodal';
import PaginationComponent from "src/utils/PaginationComponent";
import TableComponent from "src/utils/TableComponent";
import AddQcbatchModal from "./AddQcbatchModal";
import { AppDispatch } from "src/store";
import Portal from "src/utils/Portal"; // Assuming this is your custom Portal
import { Deleteqcbatch, GetAllQcbatch } from "src/features/Inventorymodule/Qcinventorymodule/QcinventorySlice";

const columnHelper = createColumnHelper<any>();

function GuardTable() {
  const dispatch = useDispatch<AppDispatch>();

  // Use useMemo for logindata to ensure it's stable and parsed safely
  const logindata = useMemo(() => {
    try {
      const storedData = localStorage.getItem("logincheck");
      return storedData ? JSON.parse(storedData) : {};
    } catch (e) {
      console.error("Error parsing logincheck from localStorage:", e);
      return {};
    }
  }, []);

  const qcAlldata = useSelector((state: any) => state.qcinventory.qcbatchdata);

  const [data, setData] = useState<any[]>([]);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [searchText, setSearchText] = useState(""); // Initialize with empty string
  const [isOpen, setIsOpen] = useState(false);
  const [addModal, setAddmodal] = useState(false);
   useEffect(() => {
    const fetchQcbatches = async () => {
      try {
        await dispatch(GetAllQcbatch()).unwrap(); // throws on error
      } catch (error) {
        console.error('Error fetching QC batches:', error);
    
      }
    };

    fetchQcbatches();
  }, [dispatch]);

  useEffect(() => {
    setData(Array.isArray(qcAlldata?.data) ? qcAlldata.data : []);
  }, [qcAlldata]);

  const filteredData = useMemo(() => {
    return data.filter(item => {
    
      const searchMatch = !searchText || Object.values(item).some(val =>
        String(val).toLowerCase().includes(searchText.toLowerCase())
      );
      return  searchMatch;
    });
  }, [data,searchText]);

  const hasAddPermission = logindata?.permission?.some(
    (p: any) =>
      p.submodule_id === 4 &&
      p.permission_id === 2 &&
      p.status === true
  ) || false; // Default to false if permission is undefined/null
  const handleConfirmDelete = async () => {
    if (!selectedRow?.id) return toast.error("No entry selected.");
    try {
      const res = await dispatch(Deleteqcbatch(selectedRow.id)).unwrap();
      if (res) {
        toast.success("Guard entry deleted!");
        setData(prev => prev.filter(item => item.id !== selectedRow.id));
      }
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    } finally {
      setIsOpen(false);
    }
  };

  const getPermissions = (loginDataObj: any, submoduleId: number) => {
    // Ensure loginDataObj and loginDataObj.permission are valid
    if (!loginDataObj || !Array.isArray(loginDataObj.permission)) {
      return [];
    }
    return loginDataObj.permission.filter((p: any) => p.submodule_id === submoduleId && p.status === true);
  };

  const hasViewPermission = getPermissions(logindata, 4).some(p => p.permission_id === 1);

  const getColumns = (logindata: any, handlers: any) => [
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
    columnHelper.accessor("qc_batch_number", { header: "Batch Number", cell: info => info.getValue() || "-" }),
   
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: info => {
        const row = info.row.original;
        const perms = getPermissions(logindata, 4);

        return (
          <div className="flex gap-2 notranslate" translate="no">
            {/* {perms.some(p => p.permission_id === 3) && (
              <Tooltip content="Edit"><Button size="sm" className="p-0 bg-lightsuccess text-success hover:bg-success hover:text-white" onClick={() => handlers.onEdit(row)}><Icon icon="solar:pen-outline" height={18} /></Button></Tooltip>
            )} */}
            
            {perms.some(p => p.permission_id === 4) && (
              <Tooltip content="Delete"><Button size="sm" color="lighterror" className="p-0" onClick={() => handlers.onDelete(row)}><Icon icon="solar:trash-bin-minimalistic-outline" height={18} /></Button></Tooltip>
            )}
          </div>
        );
      },
      enableSorting: false,
      enableColumnFilter: false
    })
  ];

  const table = useReactTable({
    data: filteredData,
    columns: useMemo(() => getColumns(logindata, {
      // --- IMPORTANT CHANGE: Delay triggerGoogleTranslateRescan ---
      onEdit: (row: any) => {
        setSelectedRow(row);
       
   
        setTimeout(triggerGoogleTranslateRescan, 50);
      },
     
      onDelete: (row: any) => {
        setSelectedRow(row);
        setIsOpen(true);
        // Call rescan AFTER modal state is set, with a small delay
        setTimeout(triggerGoogleTranslateRescan, 50);
      },
    }), [logindata]),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <>
      <div className="search-input flex justify-end mb-3">
        {hasViewPermission &&
          <input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="me-2 p-2 border rounded-md border-gray-300"
          />}
       
        {hasAddPermission && <Button color="primary" className="border rounded-md" onClick={() => {
          setAddmodal(true);
          // --- IMPORTANT CHANGE: Delay triggerGoogleTranslateRescan for Add Modal ---
          setTimeout(triggerGoogleTranslateRescan, 50);
        }} >
          <span className="font-medium"> Add Batch Number </span>
        </Button>}
      </div>
      {hasViewPermission ? (
        <>
          <div className="overflow-x-auto">
            <TableComponent table={table} flexRender={flexRender} columns={table.getAllColumns()} />
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

      {/* ComonDeletemodal is not conditionally rendered via `isOpen` */}
      <ComonDeletemodal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        selectedUser={selectedRow}
        title="Are you sure you want to Delete this Guard Entry?"
        handleConfirmDelete={handleConfirmDelete}
      />
      {addModal && (
        <Portal>
          <AddQcbatchModal setPlaceModal={setAddmodal}  placeModal={addModal} />
        </Portal>
      )}
    </>
  );
}

export default GuardTable;