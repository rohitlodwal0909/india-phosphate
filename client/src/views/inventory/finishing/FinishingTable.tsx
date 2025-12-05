import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  createColumnHelper
} from "@tanstack/react-table";
import { Button } from "flowbite-react";
import TableComponent from "src/utils/TableComponent";
import { useDispatch, useSelector } from "react-redux";
import PaginationComponent from "src/utils/PaginationComponent";
import { useContext, useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { AppDispatch } from "src/store";
import { toast } from "react-toastify";
import { GetAllQcbatch } from "src/features/Inventorymodule/Qcinventorymodule/QcinventorySlice";
import { addFinishingEntry, GetFetchProduction, updateFinishentry } from "src/features/Inventorymodule/productionmodule/ProdutionSlice";
import FinishingModal from "./FinishingModal";
import EditFinishingModal from "./EditFinishingModal";
import { triggerGoogleTranslateRescan } from "src/utils/triggerTranslateRescan";
import { CustomizerContext } from "src/context/CustomizerContext";
import { getPermissions } from "src/utils/getPermissions";

export interface PaginationTableType {
  id: number;
  qc_batch_number: string;
  rm_code: string;
  quantity: string;
  finishing: any;
  grn_number: any;
  tested_by: any;
  productionExists: any;
  actions: any;
  qa_qc_status: any;
  finishing_entries: any;
  unfinishing: any;
  unfinish_quantity: any;
  finish_quantity: any;
  batch_id: any
}

const columnHelper = createColumnHelper<PaginationTableType>();

function FinishingTable() {
  const [selectedRow, setSelectedRow] = useState<PaginationTableType | null>(null);
  const [addmodal, setaddmodal] = useState(false);
  const [editmodal, setEditModal] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
   const logindata = useSelector((state: any) => state.authentication?.logindata);

  const qcAlldata = useSelector((state: any) => state.qcinventory.qcbatchdata);
  const ProductionAlldata = useSelector((state: any) => state.productionData.productiondata);
  const [data, setData] = useState<PaginationTableType[]>(qcAlldata?.data || []);

  const [searchText, setSearchText] = useState('');

     const { selectedIconId } = useContext(CustomizerContext) || {};
      const permissions = useMemo(() => {
      return getPermissions(logindata, selectedIconId, 6);
    }, [logindata ,selectedIconId]);
   useEffect(() => setData(Array.isArray(ProductionAlldata?.data) ? ProductionAlldata.data : []), [ProductionAlldata]);
  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const result = await dispatch(GetFetchProduction());
        if (GetFetchProduction.rejected.match(result))
          return console.error("Store Module Error:", result.payload || result.error.message);
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };
    dispatch(GetAllQcbatch());
    fetchStoreData();
  }, [dispatch]);


  const handlesubmit = async (data) => {
    try {
      await dispatch(addFinishingEntry(data)).unwrap(); // unwrap for direct success/error
      toast.success("Finishing entry added successfully!");
      dispatch(GetFetchProduction());
      dispatch(GetAllQcbatch());

      setaddmodal(false);

    } catch (error) {

      toast.error(error || "Something went wrong!");
    }
  }
  const handleupdatedentry = async (data) => {
    try {
      await dispatch(updateFinishentry(data)).unwrap();
      toast.success('Finishing entry updated successfully!');
      dispatch(GetFetchProduction());
      setEditModal(false)
    } catch (error) {
      toast.error(error?.message || 'Update failed!');
    }
  };

const filteredData = useMemo(() => {
  if (!searchText) return data;

  const keyword = searchText.toLowerCase();

  return data?.filter((item) => {
    const batchId = item?.batch_id;
    const matchedBatch = qcAlldata?.data?.find((qc: any) => qc.id == batchId);
    const batchNumber = matchedBatch?.qc_batch_number?.toLowerCase() || "";
    let rmCodes = [];
    try {
      rmCodes = JSON.parse(item?.rm_code || "[]");
    } catch {}

    const quantities = typeof item?.quantity === "string"
      ? item.quantity.split(",").map((q) => q.trim().toLowerCase())
      : [];

    const entry = Array.isArray(item?.finishing_entries)
      ? item.finishing_entries[0]
      : null;

    const finish = entry?.finishing?.toLowerCase() || "";
    const unfinish = entry?.unfinishing?.toLowerCase() || "";
    const finishQty = entry?.finish_quantity?.toString().toLowerCase() || "";
    const unfinishQty = entry?.unfinish_quantity?.toString().toLowerCase() || "";

    // Match against all visible fields
    return (
      batchNumber.includes(keyword) ||
      rmCodes.some((code) => code.toLowerCase().includes(keyword)) ||
      quantities.some((qty) => qty.includes(keyword)) ||
      finish.includes(keyword) ||
      unfinish.includes(keyword) ||
      finishQty.includes(keyword) ||
      unfinishQty.includes(keyword)
    );
  });
}, [data, searchText, qcAlldata]);


  const columns = [
    columnHelper.accessor("id", {
      header: "S. No.",
      cell: (info) => <div className="truncate max-w-56"><h6 className="text-base">#{info.row.index + 1}</h6></div>
    }),
    columnHelper.accessor("qc_batch_number", {
      cell: (info) => {
        const rowData = info.row.original;
        const batchId = rowData?.batch_id;

        const matchedBatch = qcAlldata?.data?.find((qc: any) => qc.id == batchId);

        return (
          <p>{matchedBatch?.qc_batch_number || "No Code"}</p>
        );
      },
      header: () => <span>Batch Number</span>,
    }),
    columnHelper.accessor("rm_code", {
      cell: (info) => {
        let values = [];
        try { values = JSON.parse(info.getValue() || "[]"); } catch { }
        return values.length ? (
          <div className="flex flex-wrap gap-1">{values.map((v, i) => <span key={i} className="bg-pink-100 text-pink-800 text-xs px-2 py-0.5 rounded">{v}</span>)}</div>
        ) : <span className="bg-pink-100 text-pink-800 text-xs px-2 py-0.5 rounded">No RM Code</span>;
      },
      header: () => <span>RM Code</span>
    }),
    columnHelper.accessor("quantity", {
      cell: (info) => {
        const raw = info.getValue();
        const values = typeof raw === "string" ? raw.split(",").map(q => q.trim()) : [];
        return values.length ? (
          <div className="flex flex-wrap gap-1">{values.map((q, i) => <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">{q}</span>)}</div>
        ) : <p>-</p>;
      },
      header: () => <span>Quantity</span>
    }),
   
   
    columnHelper.accessor("unfinish_quantity", {
      cell: (info) => {
        const rowData = info?.row?.original;
        const entry = Array.isArray(rowData?.finishing_entries) ? rowData.finishing_entries[0] : null;
        return (
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
            {entry?.unfinish_quantity ?? "-"}
          </span>
        );
      },
      header: () => <span>Unfinish Quantity</span>,
    }),
    columnHelper.accessor("finish_quantity", {
      cell: (info) => {
        const rowData = info?.row?.original;
        const entry = Array.isArray(rowData?.finishing_entries) ? rowData.finishing_entries[0] : null;
        return (
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
            {entry?.finish_quantity ?? "-"}
          </span>
        );
      },
      header: () => <span>Finish Quantity</span>,
    }),

    columnHelper.accessor("actions", {
      cell: (info) => {
        const rowData = info?.row?.original;
        const entry = Array.isArray(rowData?.finishing_entries) ? rowData.finishing_entries[0] : null;
        return (
          <div className="flex gap-2">
            {entry ? (
              permissions?.edit &&
              <Button color="secondary" onClick={() => { setEditModal(true), triggerGoogleTranslateRescan(), setSelectedRow(rowData); }} outline size="xs" className="border border-primary text-primary hover:bg-primary hover:text-white rounded-md">
                <Icon icon="material-symbols:edit-outline" height={18} />
              </Button>
            ) : (
              permissions?.add &&
              <Button onClick={() => { setaddmodal(true), triggerGoogleTranslateRescan(), setSelectedRow(rowData); }} color="secondary" outline size="xs" className="border border-primary text-primary hover:bg-primary hover:text-white rounded-md">
                <Icon icon="material-symbols:add-rounded" height={18} />
              </Button>
            )}
          </div>
        );
      },
      header: () => <span>Actions</span>
    })
  ];
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  return (
    <>
      {permissions?.view ? (
        <>
          <div className="p-4">
            <div className="flex justify-end">
              <input type="text" placeholder="Search..." value={searchText} onChange={e => setSearchText(e.target.value)} className="me-2 p-2 border rounded-md border-gray-300" />
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
      <FinishingModal openModal={addmodal} setOpenModal={setaddmodal} selectedRow={selectedRow} handlesubmit={handlesubmit} logindata={logindata} />
      <EditFinishingModal openModal={editmodal} setOpenModal={setEditModal} selectedRow={selectedRow} handleupdatedentry={handleupdatedentry} logindata={logindata}/>
    </>
  );
}

export default FinishingTable;
