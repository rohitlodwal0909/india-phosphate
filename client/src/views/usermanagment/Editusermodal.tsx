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
import { GetUsermodule, updateUserPassword } from 'src/features/usermanagment/UsermanagmentSlice';
import { toast } from 'react-toastify';
import { ImageUrl } from 'src/constants/contant';

const Editusermodal = ({ setEditModal, modalPlacement, editModal, selectedUser }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const roleData = useSelector((state: any) => state.rolepermission.roledata);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role_id: '',
    id: '',
  });

  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [existingSignature, setExistingSignature] = useState<string | null>(null);

  // Fetch roles
  useEffect(() => {
    dispatch(GetRole());
  }, [dispatch]);

  // Load selected user
  useEffect(() => {
    if (selectedUser) {
      setFormData({
        username: selectedUser.username || '',
        password: selectedUser.showpassword || '',
        role_id: selectedUser.role_id || '',
        id: selectedUser.id,
      });

      setExistingSignature(selectedUser.signature || null);
      setSignatureFile(null);
    }
  }, [selectedUser]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append('id', formData.id);
    payload.append('username', formData.username);
    payload.append('password', formData.password);
    payload.append('role_id', formData.role_id);

    if (signatureFile) {
      payload.append('signature', signatureFile);
    }
    try {
      const res = await dispatch(updateUserPassword(payload)).unwrap();
      toast.success(res.message || 'User updated successfully');

      dispatch(GetUsermodule());
      setEditModal(false);
    } catch (error: any) {
      // Check if error has a response with message from backend
      toast.error(error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSignatureFile(file);
    }
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

          <div className="col-span-12">
            <Label value="Digital Signature" />
            <br />
            <input type="file" accept="image/png, image/jpeg" onChange={handleFileChange} />

            {/* New uploaded preview */}
            {signatureFile && (
              <img
                src={URL.createObjectURL(signatureFile)}
                alt="signature-preview"
                className="mt-2 h-20 border rounded"
              />
            )}

            {/* Existing signature preview */}
            {!signatureFile && existingSignature && (
              <img
                src={`${ImageUrl}/uploads/signatures/${existingSignature}`}
                alt="existing-signature"
                className="mt-2 h-20 border rounded"
              />
            )}
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
