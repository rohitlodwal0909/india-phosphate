import React, { useEffect, useRef, useState } from 'react';
import { Button, Label, TextInput } from "flowbite-react";
interface UserProfileProps {
  initialData: {
    username: string;
    email: string;
    role: string;
  };
}
import userImg from "../../../src/assets/images/profile/user-1.jpg"
import CardBox from "src/components/shared/CardBox";
import { useDispatch, useSelector } from 'react-redux';
import { AuthenticationUpdatemodule } from 'src/features/authentication/AuthenticationSlice';
import { toast } from 'react-toastify';
import { AppDispatch } from 'src/store';
import { GetRole } from 'src/features/authentication/PermissionSlice';

// const roleOptions = [
//   { id: "1", label: "Manager" },
//   { id: "2", label: "Employee" },
//   { id: "3", label: "Guard" },
// ];
const UserProfile: React.FC<UserProfileProps> = () => {
 const dispatch = useDispatch<AppDispatch>();
  const logindata = useSelector((state: any) => state.authentication?.logindata);
  const roleData = useSelector((state: any) => state.rolepermission.roledata);
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(userImg); // default image path
 const [formData, setFormData] = useState<any>({
    name: '',
    email: '',
    phone: '',
    address: '',
    gender: '',
    role_id: '',
  });

  useEffect(() => {
  if (logindata) {
    setFormData({
      name: logindata?.admin?.username || '',
      email:  logindata?.admin?.email || '',
      phone:  logindata?.admin?.phone || '',
      address:  logindata?.admin?.address || '',
      gender:  logindata?.admin?.gender || '',
      role_id: logindata?.admin?.role_id || '',
    });
  }
},[logindata]);


useEffect(()=>{
     const fetchCheckinData = async () => {
    try {
      const resultAction = await dispatch(GetRole());
      if (GetRole.rejected.match(resultAction)) {
        console.error("Error fetching check-in module:", resultAction.payload || resultAction.error.message);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };
    fetchCheckinData();
  },[dispatch])
  const handleImageClick = () => {
    fileInputRef.current.click(); // trigger hidden file input on image click
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl); // set uploaded image
    }
  };
    const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
     
      const res = await dispatch(AuthenticationUpdatemodule(formData)).unwrap();
      toast.success(res.message || 'Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <>
      <div className="grid grid-cols-12 lg:gap-y-30 lg:gap-x-30 gap-y-30 gap-x-0">
        <div className="col-span-12">
          <CardBox>
            <div className="mx-auto text-center mt-5">
              <img
                src={selectedImage}
                alt="logo"
                style={{ height: "120px", width: "120px" }}
                className="rounded-full mx-auto"
                onClick={handleImageClick}
              />
              <div className="flex justify-center gap-3 ">
                <TextInput color={"primary"} className="hidden" onChange={handleFileChange}
                  ref={fileInputRef} type="file" />
              </div>

            </div>
            <h5 className="card-title text-center py-3">User Profile Details</h5>
           <div className="grid grid-cols-12 gap-6">
            <div className="md:col-span-6 col-span-12">
              <Label value="User Name" />
              <TextInput
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="form-control"
              />

              <Label value="Email" />
              <TextInput
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="form-control"
              />
            </div>

            <div className="md:col-span-6 col-span-12">
              <Label value="Role" />
              <select
                value={formData.role_id}
                onChange={(e) => handleChange('role_id', e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-3 py-2"
                disabled
              >
                <option value="" disabled>Select Role</option>
            {roleData?.roles
  ?.filter((item) => {
    if (logindata?.admin?.role_id === 1) {
      return true;
    }
    return item.id !== 1;
  })
  .map((item) => (
    <option key={item.id} value={item.id}>
      {item.name}
    </option>
))}

              </select>

              <Label value="Phone" />
              <TextInput
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="form-control"
                 placeholder='Enter Phone Number'
              />
            </div>

            <div className="col-span-6">
              <Label value="Address" />
              <TextInput
                value={formData.address}
                placeholder='Enter Address'
                onChange={(e) => handleChange('address', e.target.value)}
                className="form-control"
              />
            </div>

            <div className="col-span-6">
              <Label value="Gender" />
              <select
                value={formData.gender}
                className='rounded-md w-full border border-gray-300'
                onChange={(e) => handleChange('gender', e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
            <div className="flex justify-end gap-3 pt-5">
              <Button color={"primary"} onClick={handleSubmit}>Save</Button>
              <Button color={"lighterror"}>Cancel</Button>
            </div>
          </CardBox>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
