import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  createColumnHelper,
} from "@tanstack/react-table";
import { Badge, Button } from "flowbite-react";
import TableComponent from "src/utils/TableComponent";
import { useDispatch, useSelector } from "react-redux";
import PaginationComponent from "src/utils/PaginationComponent";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { triggerGoogleTranslateRescan } from "src/utils/triggerTranslateRescan";
import { AppDispatch } from "src/store";
import Addproductionmodal from "./Addproductionmodal";
import { toast } from "react-toastify";
import { GetAllQcbatch, GetAllrowmaterial } from "src/features/Inventorymodule/Qcinventorymodule/QcinventorySlice";
import { addProduction, GetFetchProduction } from "src/features/Inventorymodule/productionmodule/ProdutionSlice";
import { GetNotification } from "src/features/Notifications/NotificationSlice";

export interface PaginationTableType {
  id: number;
  qc_batch_number: string;
  rm_code: string;
  quantity: string;
  status: any;
  grn_number: any;
  tested_by: any;
  productionExists:any
  actions: any;
  qa_qc_status: any;
}

const columnHelper = createColumnHelper<PaginationTableType>();
// const Statuses = ["PENDING", "APPROVED", "REJECT", "HOLD"];

function ProductionInventoryTable() {

  const [selectedRow, setSelectedRow] = useState<PaginationTableType | null>(null);

  const [addmodal, setaddmodal] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const logindata = JSON.parse(localStorage.getItem('logincheck') || '{}');
  const qcrowmaterial = useSelector((state: any) => state.qcinventory.rowmaterial);
  const qcAlldata = useSelector((state: any) => state.qcinventory.qcbatchdata);
  const ProductionAlldata = useSelector((state: any) => state.productionData.productiondata);
  const [data, setData] = useState<PaginationTableType[]>(qcAlldata?.data || []);

  
const [filteredProductionData, setFilteredProductionData] = useState<any>([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
  if (!Array.isArray(qcAlldata?.data) || !Array.isArray(ProductionAlldata?.data)) {
    setFilteredProductionData([]);
    return;
  }
  const batchIds = qcAlldata.data.map((item: any) => item.id);

  
  const filtered = ProductionAlldata.data.filter((item: any) =>
    batchIds.includes(Number(item.batch_id))
  );

  setFilteredProductionData(filtered);
},[qcAlldata, ProductionAlldata]);

const mergedData = useMemo(() => {
  if (!Array.isArray(qcAlldata?.data)) return [];

  return qcAlldata.data.map((qcItem: any) => {
    const matchingProduction = filteredProductionData.find(
      (prod: any) => String(prod.batch_id) == String(qcItem.id)
    );

    return {
      ...qcItem,
      rm_code: matchingProduction?.rm_code || "-",
      quantity: matchingProduction?.quantity || "-",
      status: matchingProduction ? "COMPLETE" : "PENDING",
      productionExists: !!matchingProduction
    };
  });
}, [qcAlldata, filteredProductionData]);

  useEffect(() => {
    setData(Array.isArray(qcAlldata?.data) ? qcAlldata.data : []);
  }, [qcAlldata]);

  useEffect(() => {
    const fetchrawall = async () => {
      try {
        await dispatch(GetAllrowmaterial()).unwrap(); // throws on error
      } catch (error) {
        console.error('Error fetching QC batches:', error);
        toast.error('Failed to fetch QC batches.');
      }
    };
    const fetchQcbatches = async () => {
      try {
        await dispatch(GetAllQcbatch()).unwrap(); // throws on error
      } catch (error) {
        console.error('Error fetching QC batches:', error);
        toast.error('Failed to fetch QC batches.');
      }
    };

     const fetchStoreData = async () => {
      try {
        const result = await dispatch(GetFetchProduction());
        if (GetFetchProduction.rejected.match(result)) return console.error("Store Module Error:", result.payload || result.error.message);

      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };
    fetchStoreData();
    fetchQcbatches();
    fetchrawall();
  }, [dispatch]);

  const  handleSubmit = async (data)=>{
     try {
          const res = await dispatch(addProduction(data)).unwrap();
          if (res) {
            toast.success("Productionresult entry created successfully");
            dispatch(GetFetchProduction());
            dispatch(GetAllQcbatch());
            dispatch(GetAllrowmaterial());
            dispatch(GetNotification());
           
               setTimeout(() => {
      setData(mergedData); // mergedData will now be up-to-date due to updated Redux state
    }, 100);
             setaddmodal(false)
          }
        } catch (err: any) {
          toast.error(err);
        }
  }

    const getPermissions = (loginDataObj: any, submoduleId: number) =>
    loginDataObj?.permission?.filter((p: any) => p.submodule_id === submoduleId && p.status === true) || [];
  const hasViewPermission = getPermissions(logindata, 5).some(p => p.permission_id === 1);
  const hasAddPermission = getPermissions(logindata, 5).some(p => p.permission_id === 2);
  // const hasEditPermission = getPermissions(logindata, 5).some(p => p.permission_id === 3);
  // const hasDeletePermission = getPermissions(logindata, 5).some(p => p.permission_id === 4);

  const handleApprove = (row: PaginationTableType) => {
    triggerGoogleTranslateRescan();
    setSelectedRow(row);

  };
  const handleReject = (row: PaginationTableType) => {
    triggerGoogleTranslateRescan();
    setSelectedRow(row);
    
  };

  const filteredData = useMemo(() => {
    return mergedData?.filter((item) => {

      const bySearch = !searchText || Object.values(item).some(v => String(v).toLowerCase().includes(searchText.toLowerCase()));
      return bySearch
    });
  }, [data, searchText]);


  const columns = [
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
    columnHelper.accessor("qc_batch_number", {
      cell: (info) => <p>{info.getValue() || "N0 Code"}</p>,
      header: () => <span>Batch Number</span>,
    }),

 columnHelper.accessor("rm_code", {
  cell: (info) => {
    let values = [];

    try {
      values = JSON.parse(info.getValue() || "[]");
    } catch {}

    return values.length ? (
      <div className="flex flex-wrap gap-1">
        {values.map((v, i) => (
          <span key={i} className="bg-pink-100 text-pink-800 text-xs px-2 py-0.5 rounded">{v}</span>
        ))}
      </div>
    ) : (
      <span className="bg-pink-100 text-pink-800 text-xs px-2 py-0.5 rounded">No RM Code</span>
    );
  },
  header: () => <span >RM Code</span>,
}),
columnHelper.accessor("quantity", {
  cell: (info) => {
    const raw = info.getValue(); // e.g., "3,4"
    const values = typeof raw === "string" ? raw.split(",").map(q => q.trim()) : [];

    return values.length ? (
      <div className="flex flex-wrap gap-1">
        {values.map((q, i) => (
          <span
            key={i}
            className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded"
          >
            {q}
          </span>
        ))}
      </div>
    ) : (
      <p>-</p>
    );
  },
  header: () => <span>Quantity</span>,
}),
    columnHelper.accessor("status", {
      cell: (info) => {
        const row = info.row.original?.status || "PENDING";
        const color = row === "PENDING" ? "warning" : "secondary";
        return <Badge color={color} className="capitalize">{row}</Badge>;
      },
      header: () => <span>Status</span>,
    }),
    columnHelper.accessor("actions", {
      cell: (info) => {
        const rowData = info.row.original;
        return (
          <div className="flex gap-2">
           
            {rowData?.productionExists ? (
              // <Link to={`/view-report/${idStr}`}>
                  <Button color="secondary" outline size="xs" className="border border-primary text-primary   hover:bg-primary hover:text-white rounded-md">
                    <Icon icon="solar:eye-outline" height={18} />
                  </Button>
                // </Link>

            ):(
              hasAddPermission &&
            <Button onClick={() => { setaddmodal(true), setSelectedRow(rowData) }} color="secondary" outline size="xs" className="border border-primary text-primary hover:bg-primary hover:text-white rounded-md"><Icon icon="material-symbols:add-rounded" height={18} /></Button>
            )}

            {rowData.qa_qc_status === "PENDING" && <>
              <Button onClick={() => handleApprove(rowData)} color="secondary" outline size="xs" className="border border-primary text-primary hover:bg-primary hover:text-white rounded-md">APPROVE</Button>
              <Button onClick={() => { setSelectedRow(rowData); }} color="secondary" outline size="xs" className="border border-secondary text-secondary hover:bg-secondary hover:text-white rounded-md">HOLD</Button>
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
      <Addproductionmodal openModal={addmodal} setOpenModal={setaddmodal} rmcode={qcrowmaterial?.data} selectedRow={selectedRow}handleSubmited={handleSubmit} logindata={logindata} />
    </>
  );
}

export default ProductionInventoryTable;
