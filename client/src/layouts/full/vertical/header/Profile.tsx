import { Icon } from "@iconify/react";
import { Button, Dropdown } from "flowbite-react";
import * as profileData from "./Data";
import SimpleBar from "simplebar-react";
import user1 from "/src/assets//images/profile/user-1.jpg"
import { Link, useNavigate } from "react-router";
// import { CustomizerContext } from "src/context/CustomizerContext";
import { useState } from "react";
import { toast } from "react-toastify";
import Logoutmodel from "./Logoutmodel";
import { useSelector } from "react-redux";
import { ImageUrl } from "src/constants/contant";

const Profile = () => {
  const navigate = useNavigate()
  // const { setIsCollapse, isCollapse } = useContext(CustomizerContext);
  // const logindata = JSON.parse(localStorage.getItem('logincheck') || '{}');
  const logindata = useSelector((state: any) => state.authentication?.logindata);
  const [isOpen, setIsOpen] = useState(false)
  const handlelogout = () => {
    localStorage.removeItem("logincheck");
    toast.success("Logout ")
    navigate("/admin/login");
  }

  const handleprofile = () => {

    navigate("/user-profile");
  }
  return (
    <div className="relative group/menu">
      <Dropdown
        label=""
        className="w-screen sm:w-[360px] py-6 rounded-sm"
        dismissOnClick={true}
        renderTrigger={() => (
          <span className="h-10 w-10 hover:text-primary hover:bg-lightprimary rounded-full flex justify-center items-center cursor-pointer group-hover/menu:bg-lightprimary group-hover/menu:text-primary">
            <img
             src={
    logindata?.admin?.profile_image
      ? `${ImageUrl}${logindata.admin.profile_image}?t=${logindata.admin.updated_at || Date.now()}`
      : user1
  }
 
              alt="logo"
                height="80"
              width="80"
              className="rounded-full "
            />
          </span>
        )}
      >

        <div className="px-6" onClick={handleprofile}>
          <h3 className="text-lg font-semibold text-ld">User Profile</h3>
          <div className="flex items-center gap-6 pb-5 border-b dark:border-darkborder mt-5 mb-3">
            <img
              src={
                logindata?.admin?.profile_image
                  ? "http://localhost:5000" + logindata.admin.profile_image
                  : user1
              }
              alt="logo"
              height="80"
              width="80"
              className="rounded-full"
            />
            <div>
              <h5 className="card-title">{logindata?.admin?.username}</h5>
              {/* <span className="card-subtitle"> Admin </span> */}
              <p className="card-subtitle mb-0 mt-1 flex items-center">
                <Icon
                  icon="solar:mailbox-line-duotone"
                  className="text-base me-1"
                />
                {logindata?.admin?.email}
              </p>
            </div>
          </div>
        </div>
        <SimpleBar>
          {profileData.profileDD.map((items, index) => {
            // Condition to hide index 0 and 1 for non-admins (role_id !== 1)
            if ((index === 0 || index === 1 || index === 3) && logindata?.admin?.role_id !== 1) {
              return null;
            }

            return (
              <Dropdown.Item
                as={Link}
                to={items.url}
                className="px-6 py-3 flex justify-between items-center bg-hover group/link w-full"
                key={index}
              // onClick={() => {
              //   if (isCollapse === "full-sidebar") {
              //     setIsCollapse("mini-sidebar");
              //   } else {
              //     setIsCollapse("full-sidebar");
              //   }
              // }}
              >
                <div className="flex items-center w-full">
                  <div
                    className={`h-11 w-11 flex-shrink-0 rounded-md flex justify-center items-center ${items?.bgcolor}`}
                  >
                    <Icon icon={items?.icon} height={20} className={items?.color} />
                  </div>
                  <div className="ps-4 flex justify-between w-full">
                    <div className="w-3/3">
                      <h5 className="mb-1 text-sm group-hover/link:text-primary">
                        {items?.title}
                      </h5>
                      <div className="text-xs text-darklink">{items?.subtitle}</div>
                    </div>
                  </div>
                </div>
              </Dropdown.Item>
            );
          })}
        </SimpleBar>

        <div className="pt-6 px-6">
          <Button
            color={"primary"}

            onClick={() => setIsOpen(true)}

            className="w-full"
          >
            Logout
          </Button>
        </div>
      </Dropdown>

      <Logoutmodel setIsOpen={setIsOpen} isOpen={isOpen} handlelogout={handlelogout} />
    </div>
  );
};

export default Profile;
