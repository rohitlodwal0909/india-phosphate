import { Badge, Button, Tooltip } from "flowbite-react";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import noData from "src/assets/images/svgs/no-data.webp";
import CommonPagination from "../../../../utils/CommonPagination";
import ComonDeletemodal from "../../../../utils/deletemodal/ComonDeletemodal";
import { AppDispatch } from "src/store";
import { toast } from "react-toastify";
import EditStaffMasterModal from "./EditStaffMasterModal";
import AddStaffMasterModal from "./AddStaffMasterModal";
import { deleteStaffMaster, GetStaffMaster } from "src/features/master/StaffMaster/StaffMasterSlice";
import { GetDesignation } from "src/features/master/Designation/DesignationSlice";
import { GetQualification } from "src/features/master/Qualification/QualificationSlice";
import ViewStaffMasterModal from "./ViewStaffMasterModal";
import { triggerGoogleTranslateRescan } from "src/utils/triggerTranslateRescan";
import AddPasswordModal from "./AddPasswordModal";

const StaffMasterTable = () => {
  const logindata = useSelector((state: any) => state.authentication?.logindata);
  const dispatch = useDispatch<AppDispatch>();
  const { staffmasterdata, loading } = useSelector((state: any) => state.staffmaster);
    const { Designationdata } = useSelector((state: any) => state.designation);
  const { Qualificationdata} = useSelector((state: any) => state.qualification);
  const [editmodal, setEditmodal] = useState(false);
  const [addmodal, setAddmodal] = useState(false);
  const [deletemodal, setDeletemodal] = useState(false);
   const [viewmodal, setviewmodal] = useState(false);
  const [selectedrow, setSelectedRow] = useState<any>();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [addpasswordmodal, setAddPasswordmodal] = useState(false);
  useEffect(() => {
    dispatch(GetStaffMaster());
        dispatch(GetDesignation());
        dispatch(GetQualification());
  }, [dispatch]);

  const handleEdit = (entry: any) => {
    setEditmodal(true);
    setSelectedRow(entry);
  };

  const handleDelete = async (userToDelete: any) => {
    if (!userToDelete) return;
    try {
      await dispatch(deleteStaffMaster({id:userToDelete?.id ,user_id:logindata?.admin?.id})).unwrap();
      dispatch(GetStaffMaster());
      toast.success("The staff  was successfully deleted.");
    } catch (error: any) {
      console.error("Delete failed:", error);
      if (error?.response?.status === 404) toast.error("User not found.");
      else if (error?.response?.status === 500) toast.error("Server error. Try again later.");
      else toast.error("Failed to delete user.");
    }
  };

  const filteredItems = (staffmasterdata || []).filter((item: any) => {
    const searchText = searchTerm.toLowerCase();
    const supllier = item?.full_name || "";
    const mouldNo = item?.mobile_number || "";
    const hardness = item?.email || "";
    const temperature = item?.address || "";
   
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
        <input
          type="text"
          placeholder="Search..."
          className="border rounded-md border-gray-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button size="sm" className="p-0 bg-primary border rounded-md"   onClick={() => { setAddmodal(true); }}  >
         Create Staff {/* <Icon icon="ic:baseline-plus" height={18} /> */}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {["Sr.No", "Name", "Email ", "Mobile No.", "Address","Status",  "Action"].map((title) => (
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
                    {(item?.full_name || "-")
                      .replace(/^\w/, (c: string) => c.toUpperCase())}
                  </td>
                  <td className="py-3 px-4 text-gray-900 dark:text-gray-300">{item?.email  || "-"}</td>
                  <td className="py-3 px-4 text-gray-900 dark:text-gray-300">{item?.mobile_number || "-"}</td>
                  <td className="py-3 px-4 text-gray-900 dark:text-gray-300">{item?.address || "-"}</td>

                  <td className="py-3 px-4 text-gray-900 dark:text-gray-300"><Badge
                                           
                                               color={ item.status === "Active"?`lightprimary`:"lightwarning"}
                                               className="capitalize"
                                             >
                                               {item.status}
                                             </Badge></td>
                  {/* <td className="py-3 px-4 text-gray-900 dark:text-gray-300">{item?.date_of_birth || "-"}</td>
                  <td className="py-3 px-4 text-gray-900 dark:text-gray-300">{item?.joining_date || "-"}</td> */}
                  
                  <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
                    <div className="flex justify-start gap-2">
                      
                        <>{ item?.password == null && 
                          (<Button onClick={() => { setAddPasswordmodal(true), triggerGoogleTranslateRescan(), setSelectedRow(item); }} color="secondary" outline size="sm" className="p-0 bg-lightprimary text-primary hover:bg-primary hover:text-white">
                                        <Icon icon="material-symbols:add-rounded" height={18} />
                                      </Button>)}
                        <Button color="secondary" outline size="sm" onClick={() => { setviewmodal(true), triggerGoogleTranslateRescan(), setSelectedRow(item); }}  className="p-0 bg-lightsecondary text-secondary hover:bg-secondary hover:text-white">
                                                                                  <Icon icon="solar:eye-outline" height={18} />
                                                                                </Button>
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
        title="Are you sure you want to Delete this Staff Master?"
      />
      
        <ViewStaffMasterModal   placeModal={viewmodal} modalPlacement={"center"} setPlaceModal={setviewmodal} selectedRow={selectedrow}  Designationdata={Designationdata} Qualificationdata={Qualificationdata} />
       <AddPasswordModal setShowmodal={setAddPasswordmodal} show={addpasswordmodal} StaffMasterData={selectedrow}  />
      <AddStaffMasterModal setShowmodal={setAddmodal} show={addmodal} Designationdata={Designationdata} Qualificationdata={Qualificationdata} logindata={logindata} />
      <EditStaffMasterModal show={editmodal} setShowmodal={setEditmodal} StaffMasterData={selectedrow}  Designationdata={Designationdata} Qualificationdata={Qualificationdata}logindata={logindata} />
    </div>
  );
};

export default StaffMasterTable;
