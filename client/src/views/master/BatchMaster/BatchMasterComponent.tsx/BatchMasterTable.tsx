import { Badge, Button, Tooltip } from "flowbite-react";
import { Icon } from "@iconify/react";
import { useContext, useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import noData from "src/assets/images/svgs/no-data.webp";
import CommonPagination from "../../../../utils/CommonPagination";
import ComonDeletemodal from "../../../../utils/deletemodal/ComonDeletemodal";
import { AppDispatch } from "src/store";
import { toast } from "react-toastify";
import EditBatchMasterModal from "./EditBatchMasterModal";
import AddBatchMasterModal from "./AddBatchMasterModal";
import { deleteBatchMaster, GetBatchMaster } from "src/features/master/BatchMaster/BatchMasterSlice";
import { GetCity } from "src/features/master/City/CitySlice";
import ViewBatchMasterModal from "./ViewBatchMasterModal";
import { GetRmCode } from "src/features/master/RmCode/RmCodeSlice";
import { GetAllQcbatch } from "src/features/Inventorymodule/Qcinventorymodule/QcinventorySlice";
import { CustomizerContext } from "src/context/CustomizerContext";
import { getPermissions } from "src/utils/getPermissions";
import NotPermission from "src/utils/NotPermission";

const BatchMasterTable = () => {
  const logindata = useSelector((state: any) => state.authentication?.logindata);
  const dispatch = useDispatch<AppDispatch>();
  const { BatchMasterdata, loading } = useSelector((state: any) => state.batchmasters);
  const { Citydata  } = useSelector((state: any) => state.cites);
    const { rmcodedata } = useSelector((state: any) => state.rmcodes);
    const qcAlldata = useSelector((state: any) => state.qcinventory.qcbatchdata);
  const [editmodal, setEditmodal] = useState(false);
  const [addmodal, setAddmodal] = useState(false);
  const [deletemodal, setDeletemodal] = useState(false);
  const [selectedrow, setSelectedRow] = useState<any>();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewModal ,setViewModal ]= useState(false)
     const { selectedIconId } = useContext(CustomizerContext) || {};
            const permissions = useMemo(() => {
            return getPermissions(logindata, selectedIconId, 8);
              }, [logindata ,selectedIconId]);
  useEffect(() => {
    dispatch(GetBatchMaster());
        dispatch(GetCity());
        dispatch(GetRmCode());
        dispatch(GetAllQcbatch())
  }, [dispatch]);

  const handleEdit = (entry: any) => {
    setEditmodal(true);
    setSelectedRow(entry);
  };

  const handleDelete = async (userToDelete: any) => {
    if (!userToDelete) return;
    try {
      await dispatch(deleteBatchMaster({id:userToDelete?.id ,user_id:logindata?.admin?.id})).unwrap();
      dispatch(GetBatchMaster());
      toast.success("The batch was successfully deleted.");
    } catch (error: any) {
      console.error("Delete failed:", error);
      if (error?.response?.status === 404) toast.error("User not found.");
      else if (error?.response?.status === 500) toast.error("Server error. Try again later.");
      else toast.error("Failed to delete user.");
    }
  };

  const filteredItems = (BatchMasterdata || []).filter((item: any) => {
    const searchText = searchTerm.toLowerCase();
    const supllier = item?.BatchMaster_name || "";
    const mouldNo = item?.BatchMaster_type || "";
    const hardness = item?.opening_balence || "";
    const temperature = item?.parent_BatchMaster || "";
   
    return (
      mouldNo.toString().toLowerCase().includes(searchText) ||
      supllier.toString().toLowerCase().includes(searchText) ||
      hardness.toString().toLowerCase().includes(searchText) ||
      temperature.toString().toLowerCase().includes(searchText) 
    );
  });

  const totalPages = Math.ceil(filteredItems.length / pageSize);
  const currentItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      {/* Search Bar */}
     <div className="flex justify-end mb-3 gap-2">
        {permissions?.view && <input
          type="text"
          placeholder="Search..."
          className="border rounded-md border-gray-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />}
     {permissions?.add &&    <Button size="sm" className="p-0 bg-primary border rounded-md"   onClick={() => { setAddmodal(true); }}  >
         Create Batch Master  {/* <Icon icon="ic:baseline-plus" height={18} /> */}
        </Button>}
      </div>

    {permissions?.view ?( <>  <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
  <thead className="bg-gray-50 dark:bg-gray-800">
    <tr>
      {["Sr.No", "Batch Number", "Product Name", "Quantity", "Status", "Action"].map((title) => (
        <th
          key={title}
          className="text-base font-semibold py-3 text-left border-b px-4 text-gray-700 dark:text-gray-200"
        >
          {title}
        </th>
      ))}
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
    {loading ? (
      <tr>
        <td colSpan={6} className="text-center py-6">Loading...</td>
      </tr>
    ) : currentItems.length > 0 ? (
      currentItems.map((item: any, index: number) => (
        <tr key={item.id} className="bg-white dark:bg-gray-900">
          <td className="py-3 px-4 text-base"><h6 className="text-base">#{(currentPage - 1) * pageSize + index + 1}</h6></td>
          <td className="py-3 px-4 text-gray-900 dark:text-gray-300">{item?.batch_number || "-"}</td>
          <td className="py-3 px-4 text-gray-900 dark:text-gray-300">{item?.product_name || "-"}</td>
          <td className="py-3 px-4 text-gray-900 dark:text-gray-300">{item?.quantity_produced || "-"}</td>
          <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
            <Badge
              color={item.status === "Final" ? "lightprimary" : item.status === "Draft" ? "lightwarning" : "lighterror"}
              className="capitalize"
            >
              {item.status || "-"}
            </Badge>
          </td>
          <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
            <div className="flex justify-start gap-2">
              <Button size="sm" color="lightsecondary" className="p-0" onClick={() => { setViewModal(true); setSelectedRow(item); }}>
                <Icon icon="hugeicons:view" height={18} />
              </Button>
              {permissions?.edit &&<Tooltip content="Edit" placement="bottom">
                <Button
                  size="sm"
                  className="p-0 bg-lightsuccess text-success hover:bg-success hover:text-white"
                  onClick={() => handleEdit(item)}
                >
                  <Icon icon="solar:pen-outline" height={18} />
                </Button>
              </Tooltip>}
           {permissions?.del &&   <Tooltip content="Delete" placement="bottom">
                <Button
                  size="sm"
                  color="lighterror"
                  className="p-0"
                  onClick={() => {
                    setDeletemodal(true);
                    setSelectedRow(item);
                  }}
                >
                  <Icon icon="solar:trash-bin-minimalistic-outline" height={18} />
                </Button>
              </Tooltip>}
            </div>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={6} className="text-center py-8 px-4">
          <div className="flex flex-col items-center">
            <img src={noData} alt="No data" height={100} width={100} className="mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No data available</p>
          </div>
        </td>
      </tr>
    )}
  </tbody>
</table>

      </div>
      <CommonPagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
      /></>) : <NotPermission/>}

      <ComonDeletemodal
        handleConfirmDelete={handleDelete}
        isOpen={deletemodal}
        setIsOpen={setDeletemodal}
        selectedUser={selectedrow}
        title="Are you sure you want to Delete this Batch Master?"
      />
       <ViewBatchMasterModal setPlaceModal={setViewModal} modalPlacement={"center"} selectedRow={selectedrow} placeModal={viewModal} Statedata={Citydata}  />
      <AddBatchMasterModal setShowmodal={setAddmodal} show={addmodal}  logindata={logindata}  rmcodedata={rmcodedata} batchnumber={qcAlldata} />
      <EditBatchMasterModal show={editmodal} setShowmodal={setEditmodal} BatchMasterData={selectedrow} logindata={logindata} rmcodedata={rmcodedata} batchnumber={qcAlldata}/>
    </div>
  );
};

export default BatchMasterTable;
