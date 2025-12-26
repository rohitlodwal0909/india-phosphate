import { useContext, useEffect, useMemo, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";

import TableComponent from "src/utils/TableComponent";
import PaginationComponent from "src/utils/PaginationComponent";
import Portal from "src/utils/Portal";
import { triggerGoogleTranslateRescan } from "src/utils/triggerTranslateRescan";

import { AppDispatch, RootState } from "src/store";
import { CustomizerContext } from "src/context/CustomizerContext";
import { getPermissions } from "src/utils/getPermissions";
import {  GetBmrRecords } from "src/features/Inventorymodule/BMR/BmrCreation/BmrCreationSlice";
import { GetBmrMaster } from "src/features/master/BmrMaster/BmrMasterSlice";
import LineClearanceView from "./LineClearanceView";
import LineClearanceAdd from "./LineClearanceAdd";
import { GetStaffMaster } from "src/features/master/StaffMaster/StaffMasterSlice";


/* =======================
   BMR DATA TYPE
======================= */
interface BmrDataType {
  id: number;
  batch_no: string;
  mfg_date: string;
  exp_date: string;
  status: string;
  records?: {
    id: number;
    product_name: string;
    batch_size: string;
  };
}

const columnHelper = createColumnHelper<BmrDataType>();

const LineClearanceTable = () => {
  const dispatch = useDispatch<AppDispatch>();

  const logindata = useSelector(
    (state: RootState) => state.authentication?.logindata
  ) as any;

  /* ✅ Redux se direct array aa raha hai */
  const bmrRecords = useSelector(
    (state: RootState) => state.bmrRecords.data
  ) as BmrDataType[];

 const bmr = useSelector(
    (state: RootState) => state.bmrmaster.BmrMasterdata
  ) as BmrDataType[];

   const staff = useSelector(
    (state: RootState) => state.staffmaster.staffmasterdata
  ) as BmrDataType[];

  const [data, setData] = useState<BmrDataType[]>([]);
  const [searchText, setSearchText] = useState("");

  const [modals, setModals] = useState({
    add: false,
    edit: false,
    view: false,
    delete: false,
  });


  const [selectedRow, setSelectedRow] = useState<BmrDataType | null>(null);

  const { selectedIconId } = useContext(CustomizerContext) || {};

  const permissions = useMemo(() => {
    return getPermissions(logindata, selectedIconId, 7);
  }, [logindata, selectedIconId]);

  /* =======================
     FETCH BMR RECORDS
  ======================= */
  useEffect(() => {
    dispatch(GetBmrRecords());
    dispatch(GetBmrMaster())
    dispatch(GetStaffMaster())
  }, [dispatch]);

  /* =======================
     SET DATA (FIXED)
  ======================= */
  useEffect(() => {
    if (Array.isArray(bmrRecords)) {
      setData(bmrRecords);
    }
  }, [bmrRecords]);


  /* =======================
     MODAL HANDLER
  ======================= */
  const handleModal = (
    type: keyof typeof modals,
    value: boolean,
    row?: BmrDataType
  ) => {
    setSelectedRow(row || null);
    setModals((prev) => ({ ...prev, [type]: value }));
    setTimeout(triggerGoogleTranslateRescan, 200);
  };



  /* =======================
     SEARCH FILTER
  ======================= */
  const filteredData = useMemo(() => {
    return data.filter((item) =>
      JSON.stringify(item)
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
  }, [data, searchText]);

  /* =======================
     TABLE COLUMNS
  ======================= */
  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "S. No.",
        cell: (info) => <span>#{info.row.index + 1}</span>,
      }),

      columnHelper.accessor(
        (row) => row.records?.product_name,
        {
          id: "product_name",
          header: "Product Name",
          cell: (info) => info.getValue() || "-",
        }
      ),

      columnHelper.accessor("batch_no", {
        header: "Batch No",
      }),

      columnHelper.accessor(
        (row) => row.records?.batch_size,
        {
          id: "batch_size",
          header: "Batch Size",
          cell: (info) => info.getValue() || "-",
        }
      ),

      

      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="flex gap-2 notranslate" translate="no">
              {permissions.view && (
                <Tooltip content="View">
                  <Button
                    size="xs"
                    color="primary"
                    
                    onClick={() => handleModal("view", true, row)}
                  >
                    <Icon icon="solar:eye-outline" height={18} />
                  </Button>
                </Tooltip>
              )}

              {permissions.add && (
                <Tooltip content="Plus">
                  <Button
                    size="xs"
                    color="success"
                    onClick={() => handleModal("add", true, row)}
                  >
                  <Icon icon="material-symbols:add-rounded" height={18} />

                  </Button>
                </Tooltip>
              )}

              
            </div>
          );
        },
      }),
    ],
    [permissions]
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


  /* =======================
     JSX
  ======================= */
  return (
    <div className="p-2">
      <div className="flex justify-end mb-2 gap-2">
        {permissions.view && (
          <input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="p-2 border rounded-md"
          />
        )}

        
      </div>

      {permissions.view ? (
        <>
          <div className="w-full overflow-x-auto">
            <TableComponent
              table={table}
              flexRender={flexRender}
              columns={columns}
            />
          </div>
          <PaginationComponent table={table} />
        </>
      ) : (
        <div className="text-center text-red-500 mt-20">
          You do not have permission to view this table
        </div>
      )}

       {modals.add && (
        <Portal>
        <LineClearanceAdd openModal={modals.add} setOpenModal={() => handleModal('add', false)} priviousProduct={bmr} logindata={logindata} staff={staff} recordId={selectedRow?.id}/>
       </Portal>
       )}
  
      
 {modals.view && (
        <Portal>
        
   <LineClearanceView openModal={modals.view} setPlaceModal={() => handleModal('view', false)} selectedRow={selectedRow}/>

</Portal>
)}
    </div>
  );
};

export default LineClearanceTable;
