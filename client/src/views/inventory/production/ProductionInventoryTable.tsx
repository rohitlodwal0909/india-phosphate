import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  createColumnHelper,
} from "@tanstack/react-table";
import {  Button } from "flowbite-react";
import TableComponent from "src/utils/TableComponent";
import { useDispatch, useSelector } from "react-redux";

import { GetStoremodule } from "src/features/Inventorymodule/storemodule/StoreInventorySlice";
import { GetCheckinmodule } from "src/features/Inventorymodule/guardmodule/GuardSlice";

import PaginationComponent from "src/utils/PaginationComponent";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { triggerGoogleTranslateRescan } from "src/utils/triggerTranslateRescan";
import { Link, useNavigate } from "react-router";
import { AppDispatch } from "src/store";

export interface PaginationTableType {
  id: number;
  supplier_name: string;
  grn_date: string;
  grn_time: string;
  grn_number: string;
  manufacturer_name: string;
  invoice_number: string;
  guard_entry_id: number;
  batch_number: string;
  store_rm_code: string;
  container_count: number;
  quantity: string;
  unit: string;
  qa_qc_status: string;
  remarks: string | null;
  store_location: string | null;
  mfg_date: string | null;
  exp_date: string | null;
  createdAt: string;
  status: any;
  tested_by: any;
  actions: any;
}

const columnHelper = createColumnHelper<PaginationTableType>();
// const Statuses = ["PENDING", "APPROVED", "REJECT", "HOLD"];

function ProductionInventoryTable() {

  const [selectedRow, setSelectedRow] = useState<PaginationTableType | null>(null);

  // const [filters, setFilters] = useState<{ [key: string]: string }>({ status: '' });

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const StoreData = useSelector((state: any) => state.storeinventory.storedata);
  const guardData = useSelector((state: any) => state.checkininventory.checkindata);
  const logindata = JSON.parse(localStorage.getItem('logincheck') || '{}');
  const [data, setData] = useState<PaginationTableType[]>(StoreData?.data || []);
   const [searchText, setSearchText] = useState('');
  useEffect(() => {
    if (StoreData?.data) setData(StoreData.data);
  }, [StoreData]);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const result = await dispatch(GetStoremodule());
        if (GetStoremodule.rejected.match(result)) return console.error("Store Module Error:", result.payload || result.error.message);
       
            } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    const fetchData = async () => {
      try {
        const checkinResult = await dispatch(GetCheckinmodule(logindata?.admin?.id));
        if (GetCheckinmodule.rejected.match(checkinResult)) console.error("Checkin Error", checkinResult);
      } catch (error) {
        console.error("Unexpected Error:", error);
      }
    };

    fetchData();
    fetchStoreData();
  }, [dispatch]);

  const hasViewPermission = logindata?.permission?.some(
    (p: any) => p.submodule_id === 3 && p.permission_id === 1 && p.status === true
  );
  const filteredusername = data?.filter((item:any) =>  item?.qc_result?.[0]?.testedBy?.username );

  const handleApprove = (row: PaginationTableType) => {
    triggerGoogleTranslateRescan();
    setSelectedRow(row);
   
  };

 
  const handleReject = (row: PaginationTableType) => {
    triggerGoogleTranslateRescan();
    setSelectedRow(row);
console.log(selectedRow)
  };

  const handlereportsubmit = (data) => {
    navigate(`/inventory/report/${data?.store_rm_code}`, { state: data });
  };

  const filteredData = useMemo(() => {
    return filteredusername.filter((item) => {
    
         const bySearch = !searchText || Object.values(item).some(v => String(v).toLowerCase().includes(searchText.toLowerCase()));
      return  bySearch
    });
  }, [data, searchText]);
  

  const columns = [
    columnHelper.accessor("guard_entry_id", {
      cell: (info) => {
        const rowData = info.row.original;
        const storeItem = guardData?.data?.find(item => item.id === rowData.guard_entry_id);
        return <div className="truncate max-w-56"><h6 className="text-base">{storeItem?.inward_number}</h6></div>;
      },
      header: () => <span className="text-base">Inward Number</span>,
    }),
    columnHelper.accessor("batch_number", {
      cell: (info) => <p>{info.getValue() || "N0 Code"}</p>,
      header: () => <span>Batch Number</span>,
    }),
    // columnHelper.accessor("grn_number", {
    //   cell: (info) => <p>{info.getValue() || "N0 Nmber"}</p>,
    //   header: () => <span>GRN_Number</span>,
    // }),
    // columnHelper.accessor("remarks", {
    //   cell: (info) => <p>{info.getValue() || "N0 Remark"}</p>,
    //   header: () => <span>Remark</span>,
    // }),
    // columnHelper.accessor("qa_qc_status", {
    //   cell: (info) => {
    //     const status = info.getValue() || "New";
    //     const color = status === "PENDING" ? "warning" : status === "APPROVED" ? "primary" : status === "HOLD" ? "secondary" : "error";
    //     return <Badge color={color} className="capitalize">{status}</Badge>;
    //   },
    //   header: () => <span>Status</span>,
    // }),
    columnHelper.accessor("tested_by", {
     cell: (info) => {
  const row = info.row.original as { qc_result?: { testedBy?: { username?: string } }[] };
  return <p>{row.qc_result?.[0]?.testedBy?.username || "Unknown"}</p>;
},
      header: () => <span>Tested By</span>,
    }),
    columnHelper.accessor("actions", {
      cell: (info) => {
        const rowData = info.row.original;
        const row = info.row.original as { qc_result?: { testedBy?: { username?: string } }[] };
        const idStr = String(rowData.id);
        return (
          <div className="flex gap-2">
            {rowData.qa_qc_status === "REJECTED" &&
              <Link to={`/view-report/${idStr}`}>
                <Button color="error" outline size="xs" className="border border-error text-error hover:bg-error hover:text-white rounded-md">
                  <Icon icon="solar:eye-outline" height={18} />
                </Button>
              </Link>}
            {rowData.qa_qc_status === "HOLD" &&
              <Button color="error" outline size="xs" className="border border-secondary text-secondary hover:bg-secondary hover:text-white rounded-md">
                <Icon icon="mdi:gesture-tap-hold" height={20} />
              </Button>}
            {rowData.qa_qc_status === "APPROVED" && (
              row?.qc_result?.[0]?.testedBy?.username ?
                <Link to={`/view-report/${idStr}`}>
                  <Button color="secondary" outline size="xs" className="border border-primary text-primary hover:bg-primary hover:text-white rounded-md">
                    <Icon icon="solar:eye-outline" height={18} />
                  </Button>
                </Link>
                :
              
                  <Button color="secondary"  onClick={() => handlereportsubmit(rowData)} outline size="xs" className="border border-primary text-primary hover:bg-primary hover:text-white rounded-md">
                    <Icon icon="tabler:report" height={18} />
                  </Button>
              
            )}
            {rowData.qa_qc_status === "PENDING" && <>
              <Button onClick={() => handleApprove(rowData)} color="secondary" outline size="xs" className="border border-primary text-primary hover:bg-primary hover:text-white rounded-md">APPROVE</Button>
              <Button onClick={() => {  setSelectedRow(rowData); }} color="secondary" outline size="xs" className="border border-secondary text-secondary hover:bg-secondary hover:text-white rounded-md">HOLD</Button>
              <Button onClick={() => handleReject(rowData)} color="error" outline size="xs" className="border border-error text-error hover:bg-error hover:text-white rounded-md">REJECT</Button>
            </>}
          </div>
        );
      },
      header: () => <span>Actions</span>,
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
    <>
      {hasViewPermission ? (
        <>
          <div className="p-4">
            <div className="flex justify-end">
               <input type="text" placeholder="Search..." value={searchText}
              onChange={e => setSearchText(e.target.value)}
           className="me-2 p-2 border rounded-md border-gray-300" />
             
            </div>
          </div>
          <div className="w-full overflow-x-auto">
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
     
    </>
  );
}

export default ProductionInventoryTable;
