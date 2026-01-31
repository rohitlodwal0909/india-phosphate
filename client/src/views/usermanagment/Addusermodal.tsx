import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
} from 'flowbite-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { addUser, GetUsermodule } from 'src/features/usermanagment/UsermanagmentSlice';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { AppDispatch } from 'src/store';

interface RegisterFormType {
  username: string;
  password: string;
  role_id: string;
  signature: File | null;
}

const Addusermodal = ({ placeModal, modalPlacement, setPlaceModal, roleData }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<RegisterFormType>({
    username: '',
    password: '',
    role_id: '',
    signature: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormType, string>>>({});

  const handleChange = (field: keyof RegisterFormType, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, signature: file }));
      setErrors((prev) => ({ ...prev, signature: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof RegisterFormType, string>> = {};

    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.role_id) newErrors.role_id = 'Role is required';
    if (!formData.signature) newErrors.signature = 'Signature is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = new FormData();
      payload.append('username', formData.username);
      payload.append('password', formData.password);
      payload.append('role_id', formData.role_id);
      payload.append('signature', formData.signature as File);

      const result = await dispatch(addUser(payload)).unwrap();

      toast.success(result?.message || 'User added successfully');
      dispatch(GetUsermodule());

      setFormData({
        username: '',
        password: '',
        role_id: '',
        signature: null,
      });

      setPlaceModal(false);
    } catch (error: any) {
      toast.error(error?.message || 'Something went wrong');
    }
  };

  return (
    <Modal
      show={placeModal}
      position={modalPlacement}
      onClose={() => setPlaceModal(false)}
      className="large"
    >
      <ModalHeader className="pb-0">New Add User</ModalHeader>

      <ModalBody className="overflow-auto max-h-[100vh]">
        <form onSubmit={handleSubmit} className="grid grid-cols-6 gap-3">
          {/* Username */}
          <div className="col-span-12">
            <Label value="Username" />
            <TextInput
              placeholder="Enter username"
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              color={errors.username ? 'failure' : 'gray'}
              helperText={errors.username}
            />
          </div>

          {/* Password */}
          <div className="col-span-12">
            <Label value="Password" />
            <div className="relative">
              <TextInput
                placeholder="Enter password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                color={errors.password ? 'failure' : 'gray'}
              />
              <div
                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
              </div>
            </div>
            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
          </div>

          {/* Role */}
          <div className="col-span-12">
            <Label value="Role" />
            <select
              value={formData.role_id}
              onChange={(e) => handleChange('role_id', e.target.value)}
              className={`w-full p-2 border rounded ${
                errors.role_id ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Role</option>
              {roleData?.roles?.map(
                (role, index) =>
                  index !== 0 && (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ),
              )}
            </select>
            {errors.role_id && <p className="text-xs text-red-500">{errors.role_id}</p>}
          </div>

          {/* Digital Signature */}
          <div className="col-span-12">
            <Label value="Digital Signature" />
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
              className={`w-full p-2 border rounded ${
                errors.signature ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.signature && <p className="text-xs text-red-500">{errors.signature}</p>}

            {formData.signature && (
              <img
                src={URL.createObjectURL(formData.signature)}
                alt="signature-preview"
                className="mt-2 h-20 border rounded"
              />
            )}
          </div>

          {/* Buttons */}
          <div className="col-span-12 flex justify-end gap-3">
            <Button color="error" onClick={() => setPlaceModal(false)}>
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Submit
            </Button>
          </div>
        </form>
      </ModalBody>

      <ModalFooter />
    </Modal>
  );
};

export default Addusermodal;
