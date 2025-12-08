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
  
  const { selectedIconId } =
    useContext(CustomizerContext) || {};

  const permissions = useMemo(() => {
    return getPermissions(logindata, selectedIconId, 23);
  }, [logindata, selectedIconId]);

  useEffect(() => {
    dispatch(GetCity());
  }, [dispatch]);



  const handleDelete = async (userToDelete: any) => {
    if (!userToDelete) return;
    try {
      await dispatch(
        deleteCity({
          id: userToDelete?.cities?.[0]?.id,
          user_id: logindata?.admin?.id,
        })
      ).unwrap();
      dispatch(GetCity());
      toast.success("The city was successfully deleted.");
    } catch (error: any) {
      toast.error("Failed to delete.");
    }
  };

  const filteredItems = (Citydata || []).filter((item: any) => {
    const searchText = searchTerm.toLowerCase();
    const state = item?.state_name?.toLowerCase() || "";
    const citiesArray = item?.cities?.[0]?.city_name || "[]";

    let cityNames = "";
    try {
      const parsed = JSON.parse(citiesArray);
      cityNames = parsed.join(", ").toLowerCase();
    } catch {
      cityNames = citiesArray.toLowerCase();
    }

    const pincode = item?.cities?.[0]?.pincode?.toString() || "";

    return (
      state.includes(searchText) ||
      cityNames.includes(searchText) ||
      pincode.includes(searchText)
    );
  });

  const totalPages = Math.ceil(filteredItems.length / pageSize);


  return (
    <div>
      {/* Search + Add Button */}
      <div className="flex justify-between mb-3">
        {/* Search */}
        <input
          type="text"
          placeholder="Search..."
          className="border rounded-md border-gray-300 px-2 py-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* ADD BUTTON HERE */}
        {permissions?.add && (
          <Button
            color="primary"
            onClick={() => {
              setAddmodal(true);
              setSelectedRow(null);
            }}
          >
            <Icon icon="material-symbols:add-rounded" height={20} />
            Add City
          </Button>
        )}
      </div>

      {permissions?.view ? (
        <>
          {/* TABLE */}
          <div className="overflow-x-auto">
           <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {[
                    "Sr.No",
                    "State Name",
                    "City Name",
                    "Pincode / Zipcode", // 🔥 NEW COLUMN
                    "Action",
                  ].map((title) => (
                    <th
                      key={title}
          className="text-base font-semibold py-3 text-left border-b px-4 text-gray-700 dark:text-gray-200"
                    >
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
  {loading ? (
    <tr>
      <td colSpan={5} className="text-center py-6">
        Loading...
      </td>
    </tr>
  ) : filteredItems.length > 0 ? (
    filteredItems
      .flatMap((item) =>
        item.cities.map((city) => ({
          state_name: item.state_name,
          ...city,
        }))
      )
      .slice((currentPage - 1) * pageSize, currentPage * pageSize)
      .map((row, index) => (
        <tr key={row.id}>
          <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
            #{(currentPage - 1) * pageSize + index + 1}
          </td>

          <td className="py-3 px-4 text-gray-900 dark:text-gray-300">{row.state_name}</td>

          <td className="py-3 px-4 text-gray-900 dark:text-gray-300">{row.city_name}</td>

          <td className="py-3 px-4 text-gray-900 dark:text-gray-300">{row.pincode || "-"}</td>

          <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
            <div className="flex gap-2">

              {permissions?.edit && (
                <Tooltip content="Edit">
                  <Button
                    size="sm"
                    className="p-0 bg-lightsuccess text-success"
                    onClick={() => {
                      setSelectedRow(row);
                      setEditmodal(true);
                    }}
                  >
                    <Icon icon="solar:pen-outline" height={18} />
                  </Button>
                </Tooltip>
              )}

              {permissions?.del && (
                <Tooltip content="Delete">
                  <Button
                    size="sm"
                    color="lighterror"
                    className="p-0"
                    onClick={() => {
                      setSelectedRow(row);
                      setDeletemodal(true);
                    }}
                  >
                    <Icon
                      icon="solar:trash-bin-minimalistic-outline"
                      height={18}
                    />
                  </Button>
                </Tooltip>
              )}

            </div>
          </td>
        </tr>
      ))
  ) : (
    <tr>
      <td colSpan={5} className="text-center py-8">
        <img src={noData} width={90} className="mx-auto" />
        <p>No data available</p>
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
        </>
      ) : (
        <NotPermission />
      )}

      {/* Delete Modal */}
      <ComonDeletemodal
        handleConfirmDelete={handleDelete}
        isOpen={deletemodal}
        setIsOpen={setDeletemodal}
        selectedUser={selectedrow}
        title="Are you sure you want to Delete this City?"
      />

      {/* Add / Edit Modals */}
      <AddStateModal
        setShowmodal={setAddmodal}
        show={addmodal}
        selectRow={selectedrow}
        logindata={logindata}
        stateList={Citydata}

      />


      <EditStateModal
        show={editmodal}
        setShowmodal={setEditmodal}
        CityData={
          selectedrow
        }
        logindata={logindata}
      />
    </div>
  );
};

export default StateTable;
