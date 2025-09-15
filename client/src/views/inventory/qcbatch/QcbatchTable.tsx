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
import { useEffect, useState, useMemo, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { triggerGoogleTranslateRescan } from "src/utils/triggerTranslateRescan";
import { toast } from "react-toastify";

import ComonDeletemodal from "src/utils/deletemodal/ComonDeletemodal";
import PaginationComponent from "src/utils/PaginationComponent";
import TableComponent from "src/utils/TableComponent";
import AddQcbatchModal from "./AddQcbatchModal";
import { AppDispatch } from "src/store";
import Portal from "src/utils/Portal";
import {
  Deleteqcbatch,
  GetAllQcbatch,
} from "src/features/Inventorymodule/Qcinventorymodule/QcinventorySlice";
import { CustomizerContext } from "src/context/CustomizerContext";
import { getPermissions } from "src/utils/getPermissions";

const columnHelper = createColumnHelper<any>();

function QcbatchTable() {
  const dispatch = useDispatch<AppDispatch>();

  const logindata = useSelector(
    (state: any) => state.authentication?.logindata
  );
  const qcAlldata = useSelector(
    (state: any) => state.qcinventory.qcbatchdata
  );

  const [data, setData] = useState<any[]>([]);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [searchText, setSearchText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [addModal, setAddmodal] = useState(false);
  // const [editModal, setEditModal] = useState(false);

  const { selectedIconId } = useContext(CustomizerContext) || {};
  const permissions = useMemo(
    () => getPermissions(logindata, selectedIconId, 4),
    [logindata, selectedIconId]
  );

  // Fetch QC batches
  useEffect(() => {
    dispatch(GetAllQcbatch()).unwrap().catch((error) => {
      console.error("Error fetching QC batches:", error);
    });
  }, [dispatch]);
  

  // Sync Redux state to local state
  useEffect(() => {
    setData(Array.isArray(qcAlldata?.data) ? qcAlldata.data : []);
  }, [qcAlldata]);

  // Filter data
  const filteredData = useMemo(() => {
    if (!searchText) return data;
    return data.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [data, searchText]);

  // Handle delete
  const handleConfirmDelete = async () => {
    if (!selectedRow?.id) return toast.error("No entry selected.");
    try {
      const res = await dispatch(
        Deleteqcbatch({
          id: selectedRow.id,
          user_id: logindata?.admin?.id,
        })
      ).unwrap();
      if (res) {
        toast.success("QA Batch deleted successfully!");
        setData((prev) => prev.filter((item) => item.id !== selectedRow.id));
      }
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    } finally {
      setIsOpen(false);
    }
  };

  // Table columns
  const getColumns = (handlers: any) => [
    columnHelper.accessor("id", {
      header: "S. No.",
      cell: (info) => {
        const rowIndex = info.row.index + 1;
        return (
          <div className="truncate max-w-56">
            <h6 className="text-base">#{rowIndex}</h6>
          </div>
        );
      },
    }),
    columnHelper.accessor("qc_batch_number", {
      header: "Batch Number",
      cell: (info) => info.getValue() || "-",
    }),
    columnHelper.accessor("product_name", {
      header: "Product Name",
      cell: (info) => info.getValue() || "-",
    }),
    columnHelper.accessor("mfg_date", {
      header: "Mfg Date",
      cell: (info) => info.getValue() || "-",
    }),
    columnHelper.accessor("exp_date", {
      header: "Exp Date",
      cell: (info) => info.getValue() || "-",
    }),
    columnHelper.accessor("grade", {
      header: "Grade",
      cell: (info) => info.getValue() || "-",
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => {
        const row = info.row.original;
        return (
          <div className="flex gap-2 notranslate" translate="no">
            {/* {permissions?.edit && (
              <Tooltip content="Edit">
                <Button
                  size="sm"
                  className="p-0 bg-lightsuccess text-success hover:bg-success hover:text-white"
                  onClick={() => {
                    handlers.onEdit(row);
                    setTimeout(triggerGoogleTranslateRescan, 50);
                  }}
                >
                  <Icon icon="solar:pen-outline" height={18} />
                </Button>
              </Tooltip>
            )} */}
            {permissions?.del && (
              <Tooltip content="Delete">
                <Button
                  size="sm"
                  color="lighterror"
                  className="p-0"
                  onClick={() => {
                    handlers.onDelete(row);
                    setTimeout(triggerGoogleTranslateRescan, 50);
                  }}
                >
                  <Icon icon="solar:trash-bin-minimalistic-outline" height={18} />
                </Button>
              </Tooltip>
            )}
          </div>
        );
      },
      enableSorting: false,
      enableColumnFilter: false,
    }),
  ];

  // React Table instance
  const table = useReactTable({
    data: filteredData,
    columns: useMemo(
      () =>
        getColumns({
          onEdit: (row: any) => setSelectedRow(row),
          onDelete: (row: any) => {
            setSelectedRow(row);
            setIsOpen(true);
          },
        }),
      [permissions]
    ),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <>
      <div className="search-input flex justify-end mb-3">
        {permissions?.view && (
          <input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="me-2 p-2 border rounded-md border-gray-300"
          />
        )}
        {permissions?.add && (
          <Button
            color="primary"
            className="border rounded-md"
            onClick={() => {
              setAddmodal(true);
              setTimeout(triggerGoogleTranslateRescan, 50);
            }}
          >
            <span className="font-medium">Add Batch Number</span>
          </Button>
        )}
      </div>

      {permissions?.view ? (
        <>
          <div className="overflow-x-auto">
            <TableComponent
              table={table}
              flexRender={flexRender}
              columns={table.getAllColumns()}
            />
          </div>
          <PaginationComponent table={table} />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center my-20 space-y-4">
          <Icon
            icon="fluent:person-prohibited-20-filled"
            className="text-red-500"
            width="60"
            height="60"
          />
          <div className="text-red-600 text-xl font-bold text-center px-4">
            You do not have permission to view this table.
          </div>
          <p className="text-sm text-gray-500 text-center px-6">
            Please contact your administrator.
          </p>
        </div>
      )}

      {/* Delete Modal */}
      <ComonDeletemodal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        selectedUser={selectedRow}
        title="Are you sure you want to Delete this Batch Number?"
        handleConfirmDelete={handleConfirmDelete}
      />

      {/* Add Batch Modal */}
      {addModal && (
        <Portal>
          <AddQcbatchModal
            setPlaceModal={setAddmodal}
            placeModal={addModal}
            logindata={logindata}
          />
        </Portal>
      )}
    </>
  );
}

export default QcbatchTable;

