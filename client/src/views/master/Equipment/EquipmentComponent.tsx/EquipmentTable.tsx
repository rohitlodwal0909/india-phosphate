import { Badge, Button, Tooltip } from "flowbite-react";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import noData from "src/assets/images/svgs/no-data.webp";
import CommonPagination from "../../../../utils/CommonPagination";
import ComonDeletemodal from "../../../../utils/deletemodal/ComonDeletemodal";
import { AppDispatch } from "src/store";
import { toast } from "react-toastify";
import EditEquipmentModal from "./EditEquipmentModal";
import AddEquipmentModal from "./AddEquipmentModal";
import { deleteEquipment, GetEquipment } from "src/features/master/Equipment/EquipmentSlice";


const EquipmentTable = () => {
  const logindata = useSelector((state: any) => state.authentication?.logindata);
  const dispatch = useDispatch<AppDispatch>();
  const { Equipmentdata, loading } = useSelector((state: any) => state.equipment);

  const [editmodal, setEditmodal] = useState(false);
  const [addmodal, setAddmodal] = useState(false);
  const [deletemodal, setDeletemodal] = useState(false);
  const [selectedrow, setSelectedRow] = useState<any>();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(GetEquipment());
  }, [dispatch]);

  const handleEdit = (entry: any) => {
    setEditmodal(true);
    setSelectedRow(entry);
  };

  const handleDelete = async (userToDelete: any) => {
    if (!userToDelete) return;
    try {
      await dispatch(deleteEquipment({ id: userToDelete?.id, user_id: logindata?.admin?.id })).unwrap();
      dispatch(GetEquipment());
      toast.success("The equipment was successfully deleted.");
    } catch (error: any) {
   
      if (error?.response?.status === 404) toast.error("User not found.");
      else if (error?.response?.status === 500) toast.error("Server error. Try again later.");
      else toast.error("Failed to delete user.");
    }
  };

  const filteredItems = (Equipmentdata || []).filter((item: any) => {
    const searchText = searchTerm.toLowerCase();
    const supllier = item?.name || "";
    const mouldNo = item?.description || "";
    const hardness = item?.category || "";
    const status = item?.status ? "Active" : "Inactive";
    return (
      mouldNo.toString().toLowerCase().includes(searchText) ||
      supllier.toString().toLowerCase().includes(searchText) ||
      hardness.toString().toLowerCase().includes(searchText) ||
      status.toString().toLowerCase().includes(searchText)
    );
  });

  const totalPages = Math.ceil(filteredItems.length / pageSize);
  const currentItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      {/* Search Bar */}
      <div className="flex justify-end mb-3 gap-2">
        <input
          type="text"
          placeholder="Search..."
          className="border rounded-md border-gray-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button size="sm" className="p-0 bg-primary border rounded-md" onClick={() => { setAddmodal(true); }}  >
          Create Equipment {/* <Icon icon="ic:baseline-plus" height={18} /> */}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {["Sr.No", "Equipment Name", "Category", "Description", "Status", "Action"].map((title) => (
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
                <td colSpan={8} className="text-center py-6">Loading...</td>
              </tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((item: any, index: number) => (
                <tr key={item.id} className="bg-white dark:bg-gray-900">
                  <td className="py-3 px-4 text-gray-900 dark:text-gray-300">#{(currentPage - 1) * pageSize + index + 1}</td>

                  <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
                    {item?.name || "-"}
                  </td>
                  <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
                    {item?.category || "-"}
                  </td>
                  <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
                    {item?.description || "-"}
                  </td>
                  <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
                    <Badge color={item.status ? `lightprimary` : "lighterror"}
                      className="capitalize"
                    >
                      {item.status ? "Active" : "Inactive"}
                    </Badge>
                  </td>

                  <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
                    <div className="flex justify-start gap-2">
                      <>
                        <Tooltip content="Edit" placement="bottom">
                          <Button
                            size="sm"
                            className="p-0 bg-lightsuccess text-success hover:bg-success hover:text-white"
                            onClick={() => handleEdit(item)}
                          >
                            <Icon icon="solar:pen-outline" height={18} />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Delete" placement="bottom">
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
                        </Tooltip>
                      </>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-8 px-4">
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
      />

      <ComonDeletemodal
        handleConfirmDelete={handleDelete}
        isOpen={deletemodal}
        setIsOpen={setDeletemodal}
        selectedUser={selectedrow}
        title="Are you sure you want to Delete this Equipment ?"
      />
      <AddEquipmentModal setShowmodal={setAddmodal} show={addmodal}logindata={logindata} />
      <EditEquipmentModal show={editmodal} setShowmodal={setEditmodal} EquipmentData={selectedrow} logindata={logindata} />
    </div>
  );
};

export default EquipmentTable;
