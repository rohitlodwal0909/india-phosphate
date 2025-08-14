import { Button, Tooltip } from "flowbite-react";
import { Icon } from "@iconify/react";
import { useContext, useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import noData from "src/assets/images/svgs/no-data.webp";
import CommonPagination from "../../../../utils/CommonPagination";
import ComonDeletemodal from "../../../../utils/deletemodal/ComonDeletemodal";
import { AppDispatch } from "src/store";
import { toast } from "react-toastify";
import EditStateModal from "./EditCityModal";
import AddStateModal from "./AddCityModal";
import { deleteCity, GetCity } from "src/features/master/City/CitySlice";
import { CustomizerContext } from "src/context/CustomizerContext";
import { getPermissions } from "src/utils/getPermissions";
import NotPermission from "src/utils/NotPermission";

const StateTable = () => {
  const logindata = useSelector((state: any) => state.authentication?.logindata);
  const dispatch = useDispatch<AppDispatch>();
  const { Citydata, loading } = useSelector((state: any) => state.cites);

  const [editmodal, setEditmodal] = useState(false);
  const [addmodal, setAddmodal] = useState(false);
  const [deletemodal, setDeletemodal] = useState(false);
  const [selectedrow, setSelectedRow] = useState<any>();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const { selectedIconId } = useContext(CustomizerContext) || {};
                    const permissions = useMemo(() => {
                    return getPermissions(logindata, selectedIconId, 23);
                      }, [logindata ,selectedIconId]);
  useEffect(() => {
    dispatch(GetCity());
  }, [dispatch]);

  const handleEdit = (entry: any) => {
    setEditmodal(true);
    setSelectedRow(entry);
  };

  const handleDelete = async (userToDelete: any) => {
    if (!userToDelete) return;
    try {
      await dispatch(deleteCity({id:userToDelete?.cities?.[0]?.id ,user_id:logindata?.admin?.id})).unwrap();
      dispatch(GetCity());
      toast.success("The city was successfully deleted.");
    } catch (error: any) {
      console.error("Delete failed:", error);
      if (error?.response?.status === 404) toast.error("User not found.");
      else if (error?.response?.status === 500) toast.error("Server error. Try again later.");
      else toast.error("Failed to delete user.");
    }
  };

 const filteredItems = (Citydata || []).filter((item: any) => {
  const searchText = searchTerm.toLowerCase();
  const supplier = item?.state_name || "";
  const citiesArray = item?.cities?.[0]?.city_name || [];

  // Convert cities array to single lowercase string
  const cityNames = Array.isArray(citiesArray)
    ? citiesArray.join(", ").toLowerCase()
    : "";

  return (
    supplier.toLowerCase().includes(searchText) ||
    cityNames.includes(searchText)
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
       
      </div>
 { permissions?.view  ? 
    <> <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {["Sr.No", "State Name","City Name", "Action"].map((title) => (
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
                  <td className="py-3 px-4 text-gray-900 dark:text-gray-300"> <h6 className="text-base">#{(currentPage - 1) * pageSize + index + 1} </h6></td>
                 
                  <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
                    {(item?.state_name || "-")
                      .replace(/^\w/, (c: string) => c.toUpperCase())}
                  </td>
             <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
  {(() => {
    const raw = item?.cities?.[0]?.city_name;
    try {
      const citiesArray = JSON.parse(raw);
      if (Array.isArray(citiesArray)) {
        return citiesArray
          .map((city: string) =>
            city.trim().charAt(0).toUpperCase() + city.trim().slice(1).toLowerCase()
          )
          .join(', ');
      }
    } catch (err) {
      // not a JSON string, return as is
      return raw || '-';
    }
  })()}
</td>
                  <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
                    <div className="flex justify-start gap-2">
                      
                        <>
                        
                            {
                               item?.cities?.[0]?.city_name ?
                                
                            <>                          
                       { permissions?.edit &&  <Tooltip content="Edit" placement="bottom">
                            <Button
                              size="sm"
                              className="p-0 bg-lightsuccess text-success hover:bg-success hover:text-white"
                              onClick={() => handleEdit(item)}
                            >
                              <Icon icon="solar:pen-outline" height={18} />
                            </Button>
                          </Tooltip>}
                       { permissions?.del &&     <Tooltip content="Delete" placement="bottom">
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
                        

                          </> : <>{ permissions?.add && <Button onClick={() => { setAddmodal(true), setSelectedRow(item); }} color="secondary" outline size="sm" className="p-0 bg-lightprimary text-primary hover:bg-primary hover:text-white">
                                                                <Icon icon="material-symbols:add-rounded" height={18} />
                                                              </Button>}</>

                           }  
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
      /></>  :<NotPermission/>}

      <ComonDeletemodal
        handleConfirmDelete={handleDelete}
        isOpen={deletemodal}
        setIsOpen={setDeletemodal}
        selectedUser={selectedrow}
        title="Are you sure you want to Delete this City?"
      />

      <AddStateModal setShowmodal={setAddmodal} show={addmodal}  selectRow={selectedrow}logindata={logindata} />
      <EditStateModal show={editmodal} setShowmodal={setEditmodal}   CityData={selectedrow?.cities?.length ? selectedrow.cities[0] : {}} logindata={logindata} />
    </div>
  );
};

export default StateTable;
