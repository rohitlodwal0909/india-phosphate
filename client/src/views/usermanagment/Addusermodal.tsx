
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import {   Label, TextInput } from "flowbite-react";
import {  useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { addUser, GetUsermodule } from 'src/features/usermanagment/UsermanagmentSlice';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { AppDispatch } from 'src/store';
interface RegisterFormType {
  username: string;
  email: string;
  password: string;
  role_id: string;
}
const Addusermodal = ({placeModal, modalPlacement , setPlaceModal ,roleData}) => {

  const [formData, setFormData] = useState<RegisterFormType>({
  username: '',
  email: '',
  password: '',
  role_id: '',
 
   });
   const [showPassword, setShowPassword] = useState(false);
const [errors, setErrors] = useState<Partial<RegisterFormType>>({});

const dispatch = useDispatch<AppDispatch>()


 
const handleChange = (field, value) => {
  setFormData((prev) => ({ ...prev, [field]: value }));
  setErrors((prev) => ({ ...prev, [field]: '' }));
};
 
const validateForm = () => {
 const newErrors: Partial<RegisterFormType> = {};
  if (!formData.username) newErrors.username = 'Username is required';
  if (!formData.email) newErrors.email = 'Email is required';
  if (!formData.password) newErrors.password = 'Password is required';
  if (!formData.role_id) newErrors.role_id = 'Role is required';
 
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};




const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) return;
  try {
    const result = await dispatch(addUser(formData)).unwrap();
    toast.success(result?.message || "User added successfully");
    dispatch(GetUsermodule())
    setFormData({
    username: '',
    email: '',
  password: '',
  role_id: '',
 
   })
    setPlaceModal(false);
  } catch (error: any) {
 
    // Check if error has a response with message from backend
    toast.error(error);
  }
};


  return (
    <>
        <Modal show={placeModal} position={modalPlacement} onClose={() => setPlaceModal(false)} className='large'>
         <ModalHeader className="pb-0">New Add User</ModalHeader>
          <ModalBody className='overflow-auto max-h-[100vh]'>
       <form onSubmit={handleSubmit} className="grid grid-cols-6 gap-3">
  {/* Username */}
      <div className="col-span-12">
     <div className="mb-2 block">
    <Label htmlFor="username" value="Username" />
     <span className='text-red-700 ps-1 '>*</span>
    </div>
    <TextInput
      id="username"
      type="text"
      value={formData.username}
      onChange={(e) => handleChange('username', e.target.value)}
      placeholder="Enter name"
      style={{ borderRadius: '5px' }}
      color={errors.username ? 'failure' : 'gray'}
      helperText={errors.username && <span className="text-red-500 text-xs">{errors.username}</span>}
    />
  </div>

  {/* Email */}
  <div className="col-span-12">
     <div className="mb-2 block">
    <Label htmlFor="email" value="Email" />
     <span className='text-red-700 ps-1 '>*</span>
    </div>
    <TextInput
      id="email"
      type="email"
      value={formData.email}
      onChange={(e) => handleChange('email', e.target.value)}
      placeholder="name@matdash.com"
      style={{ borderRadius: '5px' }}
      color={errors?.email ? 'failure' : 'gray'}
      helperText={errors?.email && <span className="text-red-500 text-xs">{errors.email}</span>}
    />
  </div>
  {/* Password */}
  <div className="col-span-12">
    <div className="mb-2 block">
    <Label htmlFor="password" value="Password" />
     <span className='text-red-700 ps-1 '>*</span>
    </div>
       <div className="relative">
          <TextInput
            id="userpwd"
            type={showPassword ? 'text' : 'password'}
            name="password"
             placeholder="password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            sizing="md"
            color={errors.password ? 'failure' : 'gray'}
            className=""
           style={{ borderRadius: '5px' }}
          />
          {/* Interactive Icon Positioned Over Right Side */}
          <div
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
           {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
          </div>
        </div>
  {errors.password && (
  <div className="text-red-500 text-xs mt-1">{errors.password}</div>
)}
  </div>

  {/* Role */}
  <div className="col-span-12">
  <div className="mb-2 block">
    <Label htmlFor="role" value="Role" />
    <span className="text-red-700 ps-1">*</span>
  </div>

  <select
    id="role"
    value={formData.role_id}
    onChange={(e) => handleChange("role_id", e.target.value)}
    className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      errors.role_id ? "border-red-500" : "border-gray-300"
    }`}
  >
    <option value="">Select Role</option>
   {
 roleData?.roles?.map((items, index) =>
    index !== 0 && (
      <option key={items?.id} value={items?.id}>
        {items?.name}
      </option>
    )
  )
    }
  </select>

  {errors.role_id && (
    <span className="text-red-500 text-xs">{errors.role_id}</span>
  )}
</div>

  <div className="col-span-12 flex justify-end items-center gap-[1rem]">
    <Button type="reset" color="error" onClick={() => setPlaceModal(false)}>
      Cancel
    </Button>
    <Button type="submit" color="primary">
      Submit
    </Button>
  </div>
</form>
  </ModalBody>
            <ModalFooter>            
          </ModalFooter>
        </Modal>
    </>
  )
}

export default Addusermodal