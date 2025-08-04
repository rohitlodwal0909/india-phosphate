import { useState, useEffect } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Label, TextInput } from 'flowbite-react';
import { IconUser, IconMail} from "@tabler/icons-react";
// import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { useDispatch, useSelector } from "react-redux";
import { GetRole } from "src/features/authentication/PermissionSlice";
import { AppDispatch } from "src/store";
const Editusermodal = ({ setEditModal, modalPlacement, editModal, selectedUser, onUpdateUser }) => {
  // 1. Set form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role_id: "",
   user_id:""
  });
const dispatch = useDispatch<AppDispatch>()
const roleData = useSelector((state: any) => state.rolepermission.roledata);
  //  const [showPassword, setShowPassword] = useState(false);

 useEffect(()=>{
     const fetchCheckinData = async () => {
    try {
      const resultAction = await dispatch(GetRole());

      if (GetRole.rejected.match(resultAction)) {
        // Error aaya hai
        console.error("Error fetching check-in module:", resultAction.payload || resultAction.error.message);
      }
    } catch (error) {
      // Agar dispatch ya network mein error aaya
      console.error("Unexpected error:", error);
    }
  };

  
    fetchCheckinData();

  },[dispatch])

  // 2. Load selectedUser data into form
  useEffect(() => {
    if (selectedUser) {
      setFormData({
        username: selectedUser.username || "",
        email: selectedUser.email || "",
        password: selectedUser.password, // Leave empty or mask for security
        role_id: selectedUser?.role_id || "",
        user_id:selectedUser?.id 
      });
    }
  }, [selectedUser]);

  // 3. Handle changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // 4. Handle submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!selectedUser?.id) return;

    const updatedUser = {
      ...selectedUser,
      username: formData.username,
      email: formData.email,
      role_id: formData.role_id,
      password: formData.password,
      user_id:formData?.user_id
    };
    onUpdateUser(updatedUser);
   
  };

  return (
    <Modal show={editModal} position={modalPlacement} onClose={() => setEditModal(false)} className="large">
      <ModalHeader className="pb-0">Edit User</ModalHeader>
      <ModalBody className="overflow-auto max-h-[100vh]">
        <form className="grid grid-cols-6 gap-3" onSubmit={handleEditSubmit}>
          {/* Name */}
          <div className="col-span-12">
            <Label htmlFor="name" value="Username" />
            <TextInput
              id="name"
              name="username"
              type="text"
              rightIcon={() => <IconUser size={20} />}
              placeholder="Enter name"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className="col-span-12">
            <Label htmlFor="email" value="Email" />
            <TextInput
              id="email"
              name="email"
              type="email"
              rightIcon={() => <IconMail size={20} />}
              placeholder="Enter Email "
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          {/* <div className="col-span-12">
            <Label htmlFor="password" value="Password" />
               <div className="relative">
                      <TextInput
                        id="userpwd"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                       onChange={handleChange}
                        sizing="md"
                        className="form-control "
                       
                      />
                    
                      <div
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                       >
                        {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                      </div>
                    </div>
          </div> */}

          {/* Role */}
          <div className="col-span-12">
            <Label htmlFor="role" value="Role" />
          <select
  id="role_id"
  name="role_id"
  value={formData.role_id} // should be a number: 1, 2, or 3
  onChange={handleChange}
  className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-500"
>
  <option value="" disabled>
    Select Role
  </option>
  {roleData?.roles?.map((items, index) =>
    index !== 0 && (
      <option key={items?.id} value={items?.id}>
        {items?.name}
      </option>
    )
  )}
</select>
          </div>

          {/* File Upload */}
          {/* Buttons */}
          <div className="col-span-12 flex justify-end items-center gap-[1rem]">
            <Button type="reset" color="error" onClick={() => setEditModal(false)}>
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

export default Editusermodal;
