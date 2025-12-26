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
import { toast } from "react-toastify";

import TableComponent from "src/utils/TableComponent";
import PaginationComponent from "src/utils/PaginationComponent";
import ComonDeletemodal from "src/utils/deletemodal/ComonDeletemodal";
import Portal from "src/utils/Portal";
import { triggerGoogleTranslateRescan } from "src/utils/triggerTranslateRescan";

import { AppDispatch, RootState } from "src/store";
import { GetStoremodule } from "src/features/Inventorymodule/storemodule/StoreInventorySlice";
import { CustomizerContext } from "src/context/CustomizerContext";
import { getPermissions } from "src/utils/getPermissions";
import { deleteBmrRecord, GetBmrRecords } from "src/features/Inventorymodule/BMR/BmrCreation/BmrCreationSlice";
import BmrAdd from "./BmrAdd";
import { GetBmrMaster } from "src/features/master/BmrMaster/BmrMasterSlice";
import BmrEdit from "./BmrEdit";
import BmrView from "./BmrView";

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
  };
}

const columnHelper = createColumnHelper<BmrDataType>();

const BmrCreateTable = () => {
  const dispatch = useDispatch<AppDispatch>();

  const logindata = useSelector(
    (state: RootState) => state.authentication?.logindata
  ) as any;

  /* ✅ Redux se direct array aa raha hai */
  const bmrRecords = useSelector(
    (state: RootState) => state.bmrRecords.data
  ) as BmrDataType[];

    const bmrProductName = useSelector(
    (state: RootState) => state.bmrmaster.BmrMasterdata
  );


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
     DELETE
  ======================= */
  const handleConfirmDelete = async () => {
    if (!selectedRow?.id) return toast.error("No entry selected");

    try {
      await dispatch(deleteBmrRecord(selectedRow.id)).unwrap();
      toast.success("BMR entry deleted successfully");
      dispatch(GetStoremodule());
      setData((prev) => prev.filter((i) => i.id !== selectedRow.id));
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    } finally {
      handleModal("delete", false);
    }
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

      columnHelper.accessor("mfg_date", {
        header: "Mfg Date",
      }),

      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => (
          <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 capitalize">
            {info.getValue()}
          </span>
        ),
      }),

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
                    outline
                    onClick={() => handleModal("view", true, row)}
                  >
                    <Icon icon="solar:eye-outline" height={18} />
                  </Button>
                </Tooltip>
              )}

              {permissions.edit && (
                <Tooltip content="Edit">
                  <Button
                    size="xs"
                    color="success"
                    outline
                    onClick={() => handleModal("edit", true, row)}
                  >
                    <Icon icon="solar:pen-outline" height={18} />
                  </Button>
                </Tooltip>
              )}

              {permissions.del && (
                <Tooltip content="Delete">
                  <Button
                    size="xs"
                    color="failure"
                    outline
                    onClick={() => handleModal("delete", true, row)}
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

  console.log(selectedRow)

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

        {permissions.add && (
          <Button size="sm" onClick={() => handleModal("add", true)}>
            Add BMR
          </Button>
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

      {modals.delete && (
        <Portal>
          <ComonDeletemodal
            isOpen={modals.delete}
            setIsOpen={() => handleModal("delete", false)}
            selectedUser={selectedRow}
            title="Are you sure you want to delete this BMR Entry?"
            handleConfirmDelete={handleConfirmDelete}
          />
        </Portal>
      )}

      {modals.add && (
        <Portal>
          <BmrAdd
            openModal={modals.add}
            setOpenModal={() => handleModal("add", false)}
            StoreData={bmrProductName}
            logindata={logindata}
          />
        </Portal>
      )}
      {modals.edit && selectedRow && (
  <Portal>
    <BmrEdit
      openModal={modals.edit}
      data={selectedRow}   // ✅ SINGLE ROW
      setOpenModal={() => handleModal("edit", false)}
      StoreData={bmrProductName}
      logindata={logindata}
    />
  </Portal>
)}

 {modals.view && (
        <Portal>
        
   <BmrView openModal={modals.view} setPlaceModal={() => handleModal('view', false)} selectedRow={selectedRow}/>

</Portal>
)}
    </div>
  );
};

export default BmrCreateTable;
