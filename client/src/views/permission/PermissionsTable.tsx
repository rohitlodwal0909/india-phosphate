import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import SidebarContent from 'src/layouts/full/vertical/sidebar/Sidebaritems';
import { useDispatch, useSelector } from 'react-redux';
import {
  GetRole,
  GetSavePermission,
  SavePermission,
} from 'src/features/authentication/PermissionSlice';
import { toast } from 'react-toastify';
import { AppDispatch } from 'src/store';
import { GetUsermodule } from 'src/features/usermanagment/UsermanagmentSlice';

const PermissionsTable: React.FC = () => {
  const [permissions] = useState(SidebarContent || []);
  const dispatch = useDispatch<AppDispatch>();
  const [activePermissions, setActivePermissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const roleData = useSelector((state: any) => state.rolepermission.roledata);
  const allusers = useSelector((state: any) => state.usermanagement.userdata);
  const [users, setusers] = useState([]);

  const [formData, setFormData] = useState({
    role_id: 0,
    user_role_id: 0,
  });

  const permissionMap = {
    view: 1,
    add: 2,
    edit: 3,
    delete: 4,
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch roles
        const roleAction = await dispatch(GetRole());

        // Fetch users/modules
        const userAction = await dispatch(GetUsermodule());

        if (GetRole.rejected.match(roleAction)) {
          console.error('Error fetching roles:', roleAction.payload || roleAction.error.message);
          return;
        }

        const rolesData = roleAction.payload;
        const usersData = userAction.payload;

        const firstRoleId = rolesData?.roles?.[0]?.id;

        if (firstRoleId) {
          setFormData((prev) => ({
            ...prev,
            role_id: Number(firstRoleId),
          }));

          const user = usersData?.find((user) => user.role_id === Number(firstRoleId));
          const us = usersData?.filter((user) => user.role_id === Number(firstRoleId));

          handleGetRolePermission(user?.id);
          setFormData((prev) => ({
            ...prev,
            user_role_id: Number(user?.id),
          }));
          setusers(us);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    };

    fetchInitialData();
  }, [dispatch]);

  const handleOnchange = async (role_id) => {
    try {
      const data = allusers.filter((user) => user.role_id === Number(role_id));
      setusers(data);
      // const response = await dispatch(GetSavePermission(role_id)).unwrap();
      // setActivePermissions(response?.permission || []);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  const handleGetRolePermission = async (userId) => {
    try {
      const response = await dispatch(GetSavePermission(userId)).unwrap();
      setActivePermissions(response?.permission || []);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  const getPermissionStatus = (moduleId, submoduleId, perm) => {
    const permissionId = permissionMap[perm];

    const match = activePermissions.find(
      (p) =>
        p.module_id === moduleId &&
        p.submodule_id === submoduleId &&
        p.permission_id === permissionId &&
        p.role_id === Number(formData.role_id),
    );
    return match ? match.status : false;
  };

  const handlePermissionToggle = async (
    perm: 'add' | 'view' | 'edit' | 'delete',
    subId: number,
    moduleId: number,
    currentValue: boolean,
  ) => {
    const updatedFormData = {
      role_id: Number(formData.role_id),
      user_role_id: Number(formData.user_role_id),
      module_id: Number(moduleId),
      submodule_id: Number(subId),
      permission_id: permissionMap[perm],
      status: !currentValue,
    };

    try {
      const response = await dispatch(SavePermission(updatedFormData)).unwrap();
      toast.success(response?.message || 'Permission updated successfully');
      handleGetRolePermission(formData.user_role_id);
    } catch (err) {
      toast.error(err || 'Failed to update permission');
      console.error('Failed to save permission:', err);
    }
  };

  const renderToggle = (
    moduleId: number,
    perm: 'add' | 'view' | 'edit' | 'delete',
    value: boolean,
    subId: number,
  ) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={value}
        onChange={() => {
          handlePermissionToggle(perm, subId, moduleId, value);
        }}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
    </label>
  );

  return (
    <>
      <BreadcrumbComp items={[{ title: 'Permission', to: '/' }]} title="Permission" />
      <div className="p-4 rounded-sm shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Permissions</h2>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search..."
              className="border rounded-md border-gray-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="me-3">
              <select
                id="role"
                className="w-full p-2 border rounded-md border-gray-300"
                value={formData.role_id}
                onChange={(e) => {
                  const newRoleId = Number(e.target.value);
                  setFormData((prev) => ({ ...prev, role_id: newRoleId }));
                  handleOnchange(newRoleId);
                }}
              >
                <option value="">Select Role</option>
                {roleData?.roles?.map((items) => (
                  <option key={items?.id} value={items?.id}>
                    {items?.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="me-3">
              <select
                id="role"
                className="w-full p-2 border rounded-md border-gray-300"
                value={formData.user_role_id}
                onChange={(e) => {
                  const userId = Number(e.target.value);
                  setFormData((prev) => ({ ...prev, user_role_id: userId }));
                  handleGetRolePermission(userId);
                }}
              >
                <option value="">Select Name</option>
                {users?.map((items) => (
                  <option key={items?.id} value={items?.id}>
                    {items?.username}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          {formData.role_id ? (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table table-hover">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {['Module', 'Sub Module', 'View', 'Add', 'Edit', 'Delete'].map((title) => (
                    <th
                      key={title}
                      scope="col"
                      className="text-base font-semibold py-3 text-left border-b px-4 text-gray-700 dark:text-gray-200"
                    >
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {permissions
                  .filter(
                    (module) =>
                      module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      module.items?.some((item) =>
                        item.children?.some((sub) =>
                          sub.name.toLowerCase().includes(searchTerm.toLowerCase()),
                        ),
                      ),
                  )
                  .flatMap((module) =>
                    module.items?.flatMap((item) =>
                      item.children
                        ?.filter(
                          (sub) =>
                            module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            sub.name.toLowerCase().includes(searchTerm.toLowerCase()),
                        )
                        .map((sub, subIndex) => (
                          <tr
                            key={`${module.id}-${subIndex}`}
                            className="hover:bg-gray-50 transition duration-150 ease-in-out bg-white dark:bg-gray-900"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-300">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full border border-blue-500 flex items-center justify-center text-sm">
                                  <Icon icon={sub?.icon} height={18} color="blue" />
                                </div>
                                <div className="ml-4 text-sm font-medium">{module.name}</div>
                              </div>
                            </td>

                            <td className="px-6 py-5 text-gray-900 dark:text-gray-300 flex items-center">
                              <Icon icon={sub?.icon} height={18} color="blue" />
                              <span className="ms-2">{sub.name}</span>
                            </td>

                            {['view', 'add', 'edit', 'delete'].map((perm) => (
                              <td key={perm} className="px-6 py-4 whitespace-nowrap">
                                {renderToggle(
                                  module.id,
                                  perm as 'view' | 'add' | 'edit' | 'delete',
                                  getPermissionStatus(module.id, sub.subId, perm),
                                  sub.subId,
                                )}
                              </td>
                            ))}
                          </tr>
                        )),
                    ),
                  )}
              </tbody>
            </table>
          ) : (
            <div className="text-center">Please Select Roles</div>
          )}
        </div>
      </div>
    </>
  );
};

export default PermissionsTable;
