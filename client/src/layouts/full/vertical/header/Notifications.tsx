import { Icon } from "@iconify/react";
import { Badge, Button, Dropdown, Avatar } from "flowbite-react";
import SimpleBar from "simplebar-react";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetNotification, ReadNotification } from "src/features/Notifications/NotificationSlice";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

import { AppDispatch } from "src/store";

import notificationicon from '../../../../assets/images/logos/notification2.png';
import notificationicon2 from '../../../../assets/images/logos/notification.png';
import { ImageUrl } from "src/constants/contant";


const socket = io(ImageUrl);

const Notifications = ({logindata}) => {

   const location = useLocation();
    //  const logindata = JSON.parse(localStorage.getItem('logincheck') || '{}');
    const store = useSelector((state: any) => state.authentication?.logindata);
    const pathname = location.pathname;
  const notifications = useSelector((state: any) => state.notifications.notificationData);
  const [notificationList, setNotificationList] = useState(notifications || []);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchnotification = async () => {
      try {
        await dispatch(GetNotification(store?.admin?.id)).unwrap();
      } catch (error) {
        console.error(error || "Failed to fetch notifications");
      }
    };
    fetchnotification();
  }, [dispatch]);

  useEffect(() => {
    if (notifications) {
      setNotificationList(notifications);
    }
  }, [notifications]);


  useEffect(() => {
    socket.on("new_notification", (newNotification) => {
      setNotificationList((prev) => [newNotification, ...prev]);
    });
    return () => {
      socket.off("new_notification");
    };
  }, []); 

  const handleRead = async (id) => {
    try {
      const result = await dispatch(ReadNotification(id)).unwrap();
      if (result) {
        const updated = notificationList.map((item) =>
          item.id === id ? result : item
        );
        setNotificationList(updated);
        dispatch(GetNotification(logindata?.admin?.id));
      }
    } catch (error) {
      toast.error("Failed to update notification");
      console.error(error);
    }
  };

  const handleSeeAllClick = () => {
    const dropdownBackdrop = document.querySelector('[data-testid="flowbite-dropdown"]');
    if (dropdownBackdrop) {
      dropdownBackdrop.classList.add("hidden");
    }
    navigate("/notifications");
  };
  
const getFilteredNotifications = () => {
  const keywordMap = {
    "/inventory/store": "store",
    "/inventory/qc": "qc",
    "/inventory/qc-batch": "batch",
    "/inventory/production": "production",
    "/inventory/finishing": "finishing",
    "/inventory/dispatch": "dispatch",
  };

  const keyword = keywordMap[pathname?.toLowerCase()];

  if (keyword) {
    return notificationList.filter((n) =>
      n.title?.toLowerCase().includes(keyword)
    );
  }
  return notificationList;
};

  const filteredUnreadNotifications = getFilteredNotifications()?.filter((n) => n.is_read == 0);

  return (
    <div className="relative group/menu">
      <Dropdown
        label=""
        className="w-screen sm:w-[360px] py-6 rounded-sm"
        dismissOnClick={false}
        renderTrigger={() => (
          <div className="relative">
            <span className="h-10 w-10 hover:bg-lightprimary rounded-full flex justify-center items-center cursor-pointer group-hover/menu:bg-lightprimary group-hover/menu:text-primary">
              <Icon icon="solar:bell-bing-line-duotone" height={20} />
            </span>
            <span className="rounded-full absolute end-1 top-1 bg-error text-[10px] h-4 w-4 flex justify-center items-center text-white">
              {filteredUnreadNotifications.length}
            </span>
          </div>
        )}
      >
        <div className="flex items-center px-6 justify-between">
          <h3 className="mb-0 text-lg font-semibold text-ld">Notifications</h3>
          <Badge color={"primary"}>{filteredUnreadNotifications.length}</Badge>
        </div>

        <SimpleBar className="max-h-80 mt-3">
          {filteredUnreadNotifications.map((links, index) => (
            <Dropdown.Item
              key={index}
              className="px-6 py-3 flex justify-between items-center bg-hover group/link w-full"
              onClick={() => handleRead(links?.id)}
            >
              <div className="flex items-center w-full">
                <div className={`h-11 w-11 flex-shrink-0 rounded-full flex justify-center items-center ${links.bgcolor}`}>
                  <Avatar
                    img={links.is_read === 0 ? notificationicon : notificationicon2}
                    rounded
                    status={links.is_read === 0 ? "busy" : "online"}
                    statusPosition="bottom-right"
                  />
                </div>

                <div className="ps-4 flex justify-between w-full">
                  <div className="w-3/5 text-start">
                    <h5
                      className={`mb-1 text-sm ${links.is_read == 0 ? "text-gray-900 font-semibold" : "text-gray-500 font-normal"} group-hover/link:text-primary`}
                    >
                      {links.title}
                    </h5>
                    <div className={`text-xs line-clamp-1 ${links.is_read == 0 ? "text-gray-800 font-medium" : "text-gray-400"}`}>
                      {links.message}
                    </div>
                  </div>

                  {links.date_time && (
                    <div>
                      <div className="text-xs block self-start pt-1.5">
                        {new Date(links.date_time).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </div>
                      <div className="text-xs block self-start pt-0.5 text-gray-500">
                        {new Date(links.date_time).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        }).replace(/ /g, '-')}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Dropdown.Item>
          ))}
        </SimpleBar>

        <div className="pt-5 px-6">
          <Button
            color={"primary"}
            className="w-full border border-primary text-primary hover:bg-primary hover:text-white"
            pill
            outline
            onClick={handleSeeAllClick}
          >
            See All Notifications
          </Button>
        </div>
      </Dropdown>
    </div>
  );
};

export default Notifications;
