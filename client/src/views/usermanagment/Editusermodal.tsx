import { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
} from 'flowbite-react';
import { IconUser, IconEye, IconEyeOff } from '@tabler/icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { GetRole } from 'src/features/authentication/PermissionSlice';
import { AppDispatch } from 'src/store';

const Editusermodal = ({
  setEditModal,
  modalPlacement,
  editModal,
  selectedUser,
  onUpdateUser,
}: any) => {
  const dispatch = useDispatch<AppDispatch>();

  const roleData = useSelector((state: any) => state.rolepermission.roledata);

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role_id: '',
    user_id: '',
  });

  // Fetch roles
  useEffect(() => {
    dispatch(GetRole());
  }, [dispatch]);

  // Load selected user
  useEffect(() => {
    if (selectedUser) {
      setFormData({
        username: selectedUser.username || '',
        password: selectedUser.password || '',
        role_id: selectedUser.role_id || '',
        user_id: selectedUser.id,
      });
    }
  }, [selectedUser]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = (e: any) => {
    e.preventDefault();
    if (!selectedUser?.id) return;

    const updatedUser = {
      id: selectedUser.id,
      username: formData.username,
      role_id: formData.role_id,
      password: formData.password || undefined, // empty ho to update na ho
    };

    onUpdateUser(updatedUser);
    setEditModal(false);
  };

  return (
    <Modal show={editModal} position={modalPlacement} onClose={() => setEditModal(false)}>
      <ModalHeader>Edit User</ModalHeader>

      <ModalBody>
        <form className="grid grid-cols-12 gap-4" onSubmit={handleEditSubmit}>
          {/* Username */}
          <div className="col-span-12">
            <Label value="Username" />
            <TextInput
              name="username"
              value={formData.username}
              onChange={handleChange}
              icon={IconUser}
              placeholder="Enter username"
              required
            />
          </div>

          {/* Password */}
          <div className="col-span-12">
            <Label value="Password" />
            <div className="relative">
              <TextInput
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter new password"
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
              </span>
            </div>
          </div>

          {/* Role */}
          <div className="col-span-12">
            <Label value="Role" />
            <select
              name="role_id"
              value={formData.role_id}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              required
            >
              <option value="">Select Role</option>
              {roleData?.roles?.map((role: any) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="col-span-12 flex justify-end gap-3">
            <Button color="gray" onClick={() => setEditModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Update</Button>
          </div>
        </form>
      </ModalBody>

      <ModalFooter />
    </Modal>
  );
};

export default Editusermodal;
