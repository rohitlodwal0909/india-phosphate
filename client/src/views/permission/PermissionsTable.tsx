import React, { useEffect, useState } from 'react';
import { Icon } from "@iconify/react";
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import { PermissionData } from 'src/utils/PermissionData';
import { useDispatch, useSelector } from 'react-redux';
import { GetRole, GetSavePermission, SavePermission } from 'src/features/authentication/PermissionSlice';
import { toast } from 'react-toastify';
import { AppDispatch } from 'src/store';

const PermissionsTable: React.FC = () => {
  const [permissions, setPermissions] = useState(PermissionData || []);
  const dispatch = useDispatch<AppDispatch>()
  const [activePermissions, setActivePermissions] = useState([])
  const roleData = useSelector((state: any) => state.rolepermission.roledata);

  const [formData, setFormData] = useState({
    role_id: 0,   // selected role ID
    submodule_id: 0,
    permission_id: 0,  // selected submodule ID
    status: false
  });

  const permissionMap = {
    view: 1,
    add: 2,
    edit: 3,
    delete: 4,
  };
useEffect(() => {
  const fetchCheckinData = async () => {
    try {
      const resultAction = await dispatch(GetRole());
      if (GetRole.rejected.match(resultAction)) {
        console.error("Error fetching check-in module:", resultAction.payload || resultAction.error.message);
      } else {
        const data = resultAction.payload;
        const firstRoleId = data?.roles?.[0]?.id;
        if (firstRoleId) {
          setFormData((prev) => ({
            ...prev,
            role_id: Number(firstRoleId),
          }));
          handlegetrolepermisssion(firstRoleId);
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  fetchCheckinData();
}, [dispatch]);

  const handlegetrolepermisssion = async (role_id) => {
    try {
      const response = await dispatch(GetSavePermission(role_id)).unwrap();
      setActivePermissions(response?.permission || []);
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  };

  const getPermissionStatus = (submoduleId, perm) => {
    const permissionId = permissionMap[perm];
    const match = activePermissions.find(
      (p) =>
        p.submodule_id === submoduleId &&
        p.permission_id === permissionId &&
        p.role_id === Number(formData.role_id) // convert string to number
    );

    return match ? match.status : false;
  };
  const handlePermissionToggle = async (
    perm: "add" | "view" | "edit" | "delete",
    subId: any,
    currentValue: boolean
  ) => {
    const updatedFormData = {
      role_id: Number(formData.role_id),
      submodule_id: Number(subId),
      permission_id: permissionMap[perm],
      status: !currentValue
    };

    setFormData(updatedFormData);
    try {
    const response =   await dispatch(SavePermission(updatedFormData)).unwrap();
    console.log(response)
    
       toast.success(response?.message || "Permission updated successfully");

      handlegetrolepermisssion(formData.role_id);
    } catch (err) {
       toast.error(err || "Failed to update permission");
      console.error("Failed to save permission:", err);
    }
  };

  const renderToggle = (
    userId: string,
    subName: string,
    perm: "add" | "view" | "edit" | "delete",
    value: boolean,
    subId: string
  ) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={value}
        onChange={() => {
          // Update the UI (toggle switch)
          setPermissions((prev) =>
            prev.map((user) => {
              if (user.id !== userId) return user;
              return {
                ...user,
                submodule: user.submodule.map((s) => {
                  if (s.name !== subName) return s;
                  return {
                    ...s,
                    [perm]: !s[perm],
                  };
                }),
              };
            })
          );
          handlePermissionToggle(perm, subId , value);
        }}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
    </label>
  );

  return (
    <>
      <BreadcrumbComp items={[{ title: "Permission", to: "/" }]}
        title="Permission" />
      <div className="p-4  rounded-sm shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold "> Permissions</h2>
          <div>
          </div>
          <div className='flex '>
            <div className='me-3'>
              <select
                id="role"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.role_id}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    role_id: Number(e.target.value),
                  })), handlegetrolepermisssion(e.target.value)
                }
                }
              >
                <option value="">Select Role</option>
                {roleData?.roles?.map((items) => (
                  <option key={items?.id} value={items?.id}>
                    {items?.name}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>
        <div className="overflow-x-auto">
          {formData.role_id ? (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700  table table-hover">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="text-base font-semibold py-3 text-left border-b px-4 text-gray-700 dark:text-gray-200"
                  >
                    Module   </th>
                  <th
                    scope="col"
                    className="text-base font-semibold py-3 text-left border-b px-4 text-gray-700 dark:text-gray-200"
                  >
                    Sub Module
                  </th>
                  <th
                    scope="col"
                    className="text-base font-semibold py-3 text-left border-b px-4 text-gray-700 dark:text-gray-200"
                  >
                    View
                  </th>
                  <th
                    scope="col"
                    className="text-base font-semibold py-3 text-left border-b px-4 text-gray-700 dark:text-gray-200"
                  >

                    Add
                  </th>
                  <th
                    scope="col"
                    className="text-base font-semibold py-3 text-left border-b px-4 text-gray-700 dark:text-gray-200"
                  >
                    Edit
                  </th>
                  <th
                    scope="col"
                    className="text-base font-semibold py-3 text-left border-b px-4 text-gray-700 dark:text-gray-200"
                  >
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {permissions.map((user) =>
                  user.submodule.map((sub, subIndex) => (
                    <tr
                      key={`${user.id}-${subIndex}`}
                      className="hover:bg-gray-50 transition duration-150 ease-in-out bg-white dark:bg-gray-900"
                    >
                      {/* ✅ Repeat module name for every submodule */}
                      <td className="px-6 py-4 whitespace-nowrap  text-gray-900 dark:text-gray-300" >
                        <div className="flex items-center">
                          <div
                            className={`flex-shrink-0 h-10 w-10  bg-blue-100 rounded-full border border-blue-500 flex items-center justify-center  text-sm `}
                          >
                            <Icon icon={user?.icons} height={18} color='blue' />
                          </div>
                          <div className="ml-4 text-sm font-medium">
                            {user.name}{" "}
                            {user.isCurrentUser && (
                              <span className=" text-xs"></span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-gray-900 dark:text-gray-300 flex"> <Icon icon={sub?.icon} height={18} color='blue' />  <span className='ms-2'>{sub.name}</span></td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderToggle(user.id, sub.name, 'view', getPermissionStatus(sub.id, 'view'), sub?.id as any)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderToggle(user.id, sub.name, 'add', getPermissionStatus(sub.id, 'add'), sub?.id as any)}

                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderToggle(user.id, sub.name, 'edit', getPermissionStatus(sub.id, 'edit'), sub?.id as any)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderToggle(user.id, sub.name, 'delete', getPermissionStatus(sub.id, 'delete'), sub?.id as any)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>


            </table>) : (<div className='text-center'> Please Select Roles </div>)}
        </div>
      </div>
    </>
  );
};

export default PermissionsTable;