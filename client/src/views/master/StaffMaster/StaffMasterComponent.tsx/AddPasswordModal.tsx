import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
} from 'flowbite-react';
import { useEffect, useState} from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { GetStaffMaster, updateStaffMaster } from 'src/features/master/StaffMaster/StaffMasterSlice';
interface PasswordFormData {
    password: string;
    confirm_password: string;
    id:any
}

interface PasswordErrors {
    password?: string;
    confirm_password?: string;
}
const AddPasswordModal = ({ show, setShowmodal, StaffMasterData }) => {
 
 const [formData, setFormData] = useState<PasswordFormData>({
          id:'',
        password: "",
        confirm_password: "",
    });

    const [errors, setErrors] = useState<PasswordErrors>({});
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    useEffect(()=>{ setFormData((prev) => ({ ...prev, id: StaffMasterData?.id })); },[StaffMasterData])
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = (): boolean => {
        const newErrors: PasswordErrors = {};
        if (!formData.password) {
            newErrors.password = "New password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (!formData.confirm_password) {
            newErrors.confirm_password = "Please confirm your password";
        } else if (formData.password !== formData.confirm_password) {
            newErrors.confirm_password = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;
try {
    const id = StaffMasterData?.id; // 👈 extract ID here
    const result = await dispatch(updateStaffMaster({ id, data: formData })).unwrap(); // 👈 pass both

    toast.success(result.message || 'Password created successfully');
    dispatch(GetStaffMaster());

    setFormData({
      id: StaffMasterData?.id,
       password: "",
        confirm_password: "",
    });

    setShowmodal(false);
  } catch (err: any) {
    toast.error(err?.message || err||'Something went wrong');
  }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="2xl">
      <ModalHeader>Create Password </ModalHeader>
      <ModalBody>
      <form onSubmit={handleSubmit}>
                                      {/* New Password */}
                                      <div className="mb-4">
                                          <Label htmlFor="password" className="text-gray-600 " value=" Password" />
                                          <div className="relative">
                                              <TextInput
                                                  id="password"
                                                  name="password"
                                                  type={showPassword ? "text" : "password"}
                                                  value={formData.password}
                                                  onChange={handleInputChange}
                                                  color={errors.password ? "failure" : "gray"}
                                                  className="form-rounded-md bg-transparent"
                                              />
                                              <div
                                                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 cursor-pointer"
                                                  onClick={() => setShowPassword(!showPassword)}
                                              >
                                                  {showPassword ? <IconEye size={20} />  : <IconEyeOff size={20} />}
                                              </div>
                                          </div>
                                          {errors.password && (
                                              <div className="text-red-500 text-xs mt-1">{errors.password}</div>
                                          )}
                                      </div>
      
                                      {/* Confirm Password */}
                                      <div className="mb-4">
                                          <Label htmlFor="confirm_password" className="text-gray-600 " value="Confirm Password" />
                                          <TextInput
                                              id="confirm_password"
                                              name="confirm_password"
                                              type="password"
                                              value={formData.confirm_password}
                                              onChange={handleInputChange}
                                              color={errors.confirm_password ? "failure" : "gray"}
                                              className="form-rounded-md bg-transparent"
                                              
                                          />
                                          {errors.confirm_password && (
                                              <div className="text-red-500 text-xs mt-1">{errors.confirm_password}</div>
                                          )}
                                      </div>
      
                                      {/* Submit Button */}
                                      <Button color="primary" type="submit" className="w-full mt-4 rounded-md">
                                          Submit 
                                      </Button>
                                  </form>
      </ModalBody>
      <ModalFooter className="justify-end">
        {/* <Button color="gray" onClick={() => setShowmodal(false)}>
          Cancel
        </Button>
        <Button type="submit" color="primary" onClick={handleSubmit}>
          Submit
        </Button> */}
      </ModalFooter>
    </Modal>
  );
};

export default AddPasswordModal;
