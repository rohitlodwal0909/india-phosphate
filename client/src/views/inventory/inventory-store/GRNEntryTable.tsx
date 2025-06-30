import {
  flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel,
  getSortedRowModel, useReactTable, createColumnHelper
} from "@tanstack/react-table";
import { Badge, Button } from "flowbite-react";
import { Icon } from "@iconify/react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { deleteCheckin, GetCheckinmodule } from "src/features/Inventorymodule/guardmodule/GuardSlice";
import { GetStoremodule, ShowStore } from "src/features/Inventorymodule/storemodule/StoreInventorySlice";
import { formatDate, formatTime } from "src/utils/Datetimeformate";
import { triggerGoogleTranslateRescan } from "src/utils/triggerTranslateRescan";
import ComonDeletemodal from "src/utils/deletemodal/ComonDeletemodal";
import PaginationComponent from "src/utils/PaginationComponent";
import TableComponent from "src/utils/TableComponent";
import StoreInventoryAddmodal from "./StoreInventoryAddmodal";
import ViewStoremodel from "./ViewStoremodel";
import { AppDispatch } from "src/store";

const columnHelper = createColumnHelper<any>();

function GRNEntryTable() {
  const [isOpens, setIsOpens] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [placeModals, setPlaceModals] = useState(false);
  const [viewModals, setViewModals] = useState(false);
  const [filters, setFilters] = useState({ guard_type: '' });
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const dispatch = useDispatch<AppDispatch>();

  const guardData = useSelector((state: any) => state.checkininventory.checkindata);
  const StoreData = useSelector((state: any) => state.storeinventory.storedata);
  const logindata = JSON.parse(localStorage.getItem('logincheck') || '{}');
  const hasAddPermission = logindata?.permission?.some(p => p.submodule_id === 2 && p.permission_id === 2 && p.status);
  const hasViewPermission = logindata?.permission?.some(p => p.submodule_id === 2 && p.permission_id === 1 && p.status);

  useEffect(() => {
    if (!logindata?.admin?.id) return;
    dispatch(GetCheckinmodule(logindata.admin.id));
    dispatch(GetStoremodule());
  }, [dispatch, logindata?.admin?.id]);

  useEffect(() => {
    setData(Array.isArray(guardData?.data) ? guardData.data : []);
  }, [guardData]);

  const handleEdit = row => { triggerGoogleTranslateRescan(); setSelectedRow(row); setPlaceModals(true); };
  const handleView = async row => {
    triggerGoogleTranslateRescan(); setViewModals(true);
    try {
      const res = await dispatch(ShowStore(row?.id)).unwrap();
      setSelectedRow(res?.data);
    } catch (err) { console.error("View error", err); }
  };
  const handleDelete = row => { triggerGoogleTranslateRescan(); setSelectedRow(row); setIsOpens(true); };
  const handleConfirmDelete = async user => {
    if (!user) return;
    try {
      await dispatch(deleteCheckin(user.id)).unwrap();
      setData(prev => prev.filter(u => u.id !== user.id));
      toast.success("Guard deleted");
    } catch { toast.error("Delete failed"); }
  };

const filteredData = useMemo(() => {
  return data.filter(item => {
    const guardTypeValue = item.guard_type || '';
    const searchValue = searchText || '';

    const byType = !filters.guard_type || guardTypeValue.includes(filters.guard_type);
    const bySearch = !searchValue || Object.values(item).some(v => {
      if (v == null) return false;
      return String(v).includes(searchValue);
    });

    return byType && bySearch;
  });
}, [data, filters, searchText]);


  const columns = useMemo(() => [
    columnHelper.accessor("inward_number", {
      header: "Inward Number",
      cell: info => <div className="truncate max-w-56 text-base"><h6>{info.getValue()}</h6></div>
    }),
    columnHelper.accessor("guard_type", { header: "Guard Type", cell: info => info.getValue() || "-" }),
    columnHelper.accessor("vehicle_number", { header: "Vehicle", cell: info => info.getValue() || "-" }),
    columnHelper.accessor("quantity_net", {
      header: "Net Quantity",
      cell: info => {
        const { quantity_net, quantity_unit } = info.row.original;
        return quantity_net ? `${quantity_net} ${quantity_unit || ''}` : "-";
      }
    }),
    columnHelper.display({
      id: "entry_date_time",
      header: "Entry Date Time",
      cell: info => {
        const { entry_date, entry_time } = info.row.original;
        return <div><p>{formatDate(entry_date)}</p><span>{formatTime(entry_time)}</span></div>;
      }
    }),
     columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const rowData = info.row.original;
        const storeItem = StoreData?.data?.find(item => item.guard_entry_id == rowData.id);
        const status = storeItem?.qa_qc_status || "New";
         const statusColorMap = {
      New: "secondary",
      PENDING: "warning",
      APPROVED: "primary",
      REJECTED: "error",
      HOLD: "success",
    };
          const color = statusColorMap[status.toUpperCase()] || "secondary";
        return <Badge color={color} className="capitalize">{status}</Badge>;
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: info => {
        const row = info.row.original;
        const storeItem = StoreData?.data?.find(i => i.guard_entry_id === row.id);
        const permissions = logindata?.permission?.filter(p =>
          p.submodule_id === 2 && p.status && p.role_id === logindata?.admin?.role_id);
        // const canEdit = permissions?.some(p => p.permission_id === 3);
        const canDelete = permissions?.some(p => p.permission_id === 4);
        return (
          <div className="flex gap-2">
            {!storeItem && hasAddPermission && (
              <Button size="sm" title="Add" className="p-0 bg-lightsuccess text-success hover:bg-success hover:text-white"
                onClick={() => handleEdit(row)}><Icon icon="material-symbols:add-rounded" height={18} /></Button>
            )}
            {storeItem && (
              <Button size="sm" title="View" color="lightprimary" className="p-0"
                onClick={() => handleView(row)}><Icon icon="solar:eye-outline" height={18} /></Button>
            )}
            {canDelete && (
              <Button size="sm" title="Delete" color="lighterror" className="p-0"
                onClick={() => handleDelete(row)}><Icon icon="solar:trash-bin-minimalistic-outline" height={18} /></Button>
            )}
          </div>
        );
      },
      enableSorting: false,
      enableColumnFilter: false
    })
  ], [StoreData, logindata]);

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

      <ComonDeletemodal
        isOpen={isOpens}
        setIsOpen={setIsOpens}
        selectedUser={selectedRow}
        title="Are you sure you want to Delete this Store Entry?"
        handleConfirmDelete={() => handleConfirmDelete(selectedRow)}
      />
      <StoreInventoryAddmodal
        setPlaceModal={setPlaceModals}
        modalPlacement="center"
        selectedRow={selectedRow}
        placeModal={placeModals}
      />
      <ViewStoremodel
        setPlaceModal={setViewModals}
        modalPlacement="center"
        selectedRow={selectedRow}
        placeModal={viewModals}
      />
    </>
  );
}

export default GRNEntryTable;
