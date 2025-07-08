import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Pagination } from "flowbite-react";
import { useLocation } from "react-router";
import notificationicon from "../../assets/images/logos/notification2.png";
import notificationicon2 from "../../assets/images/logos/notification.png";
import { GetNotification, ReadNotification } from "src/features/Notifications/NotificationSlice";
import { toast } from "react-toastify";
import CardBox from "src/components/shared/CardBox";
import BreadcrumbComp from "src/layouts/full/shared/breadcrumb/BreadcrumbComp";
import { AppDispatch } from "src/store";

const SeeAllNotifications = () => {
  const logindata = JSON.parse(localStorage.getItem("logincheck") || "{}");
  const notifications = useSelector((state: any) => state.notifications.notificationData);
  const [notificationList, setNotificationList] = useState(notifications || []);
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const notificationId = location.key;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(notificationList.length / itemsPerPage);
  const paginatedNotifications = notificationList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        await dispatch(GetNotification(logindata?.admin?.id)).unwrap();
      } catch (error) {
        console.error(error || "Failed to fetch notifications");
      }
    };
    if (notificationId || location.state === null) {
      fetchNotification();
    }
    fetchNotification();
  }, [dispatch, notificationId]);

  useEffect(() => {
    if (notifications) {
      setNotificationList(notifications);
    }
  }, [notifications]);

  const handleRead = async (id: number) => {
    try {
      const result = await dispatch(ReadNotification(id)).unwrap();
      if (result) {
        const updated = notificationList.map((item) =>
          item.id === id ? result : item
        );
        setNotificationList(updated);
      }
    } catch (error) {
      toast.error("Failed to update notification");
      console.error(error);
    }
  };

  return (
    <div>
      <BreadcrumbComp
        items={[{ title: "Notifications", to: "/" }]}
        title="Notifications"
      />

      <CardBox>
        <ul className="w-full rounded-sm">
          {paginatedNotifications.map((links) => (
            <li
              onClick={() => handleRead(links.id)}
              className={`px-6 py-3 cursor-pointer flex justify-between items-center w-full hover:bg-gray-100`}
              key={links.id}
            >
              <div className="flex items-center w-full">
                <div
                  className={`h-11 w-11 flex-shrink-0 rounded-full flex justify-center items-center ${links.bgcolor}`}
                >
                  <Avatar
                    img={links.is_read == 0 ? notificationicon : notificationicon2}
                    rounded
                    status={links.is_read == 0 ? "online" : "busy"}
                    statusPosition="bottom-right"
                  />
                </div>

                <div className="ps-4 flex justify-between w-full">
                  <div className="w-3/4 text-start">
                    <h5
                      className={`mb-1 text-sm ${
                        links.is_read == 0
                          ? "text-gray-900 font-semibold"
                          : "text-gray-500 font-normal"
                      } group-hover/link:text-primary`}
                    >
                      {links.title}
                    </h5>
                    <div className="text-xs text-darklink line-clamp-1">
                      {links.message}
                    </div>
                  </div>

                  {links.date_time && (
                    <div>
                      <div className="text-xs block self-start pt-1.5">
                        {new Date(links.date_time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </div>
                      <div className="text-xs block self-start pt-0.5 text-gray-500">
                        {new Date(links.date_time)
                          .toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                          .replace(/ /g, "-")}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* 🔽 Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              showIcons
            />
          </div>
        )}
      </CardBox>
    </div>
  );
};

export default SeeAllNotifications;
