import React, { useRef, useState } from 'react';
import { Button, Label, Select, TextInput } from "flowbite-react";
interface UserProfileProps {
  initialData: {
    username: string;
    email: string;
    role: string;
  };
}
import userImg from "../../../src/assets/images/profile/user-1.jpg"
import CardBox from "src/components/shared/CardBox";

const roleOptions = [
  { id: "1", label: "Manager" },
  { id: "2", label: "Employee" },
  { id: "3", label: "Guard" },
];
const UserProfile: React.FC<UserProfileProps> = () => {

  const logindata = JSON.parse(localStorage.getItem('logincheck') || '{}');

  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(userImg); // default image path

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

                <div className="flex flex-col gap-3 mt-3">
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="ynm" value=" User Name" />
                    </div>
                    <TextInput
                      id="ynm"
                      type="text"
                      sizing="md"
                      value={logindata?.admin
                        ?.name}
                      className="form-control"
                    />
                  </div>

                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="ynm" value="Email" />
                    </div>
                    <TextInput
                      id="em"
                      type="email"
                      value={logindata?.admin
                        ?.email}
                      placeholder="info@MatDash.com"
                      sizing="md"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
              <div className="md:col-span-6 col-span-12">
                <div className="flex flex-col gap-3 mt-3">
                  <div>

                    <Label htmlFor="role" value="Role" />
                    <select
                      id="role_id"
                      name="role_id"
                      value={logindata?.admin?.role_id} // should be a number: 1, 2, or 3

                      className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-500"

                    >
                      <option value="" disabled>
                        Select Role
                      </option>
                      {roleOptions.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.label}
                        </option>
                      ))}
                    </select>

                  </div>
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="ph" value="Phone" />
                    </div>
                    <TextInput
                      id="ph"
                      type="text"
                      sizing="md"
                      placeholder="+91 1234567895"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
              <div className="col-span-6 -mt-4">
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="add" value="Address" />
                  </div>
                  <TextInput
                    id="add"
                    type="text"
                    sizing="md"
                    placeholder="814 Howard Street, 120065, India"
                    className="form-control "
                  />
                </div>
              </div>
              <div className="col-span-6 -mt-4">
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="gender" value=" Select Gender" />
                  </div>
                  <Select id="gender" required className=" " style={{ borderRadius: "10px" }}>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-5">
              <Button color={"primary"}>Save</Button>
              <Button color={"lighterror"}>Cancel</Button>
            </div>
          </CardBox>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
