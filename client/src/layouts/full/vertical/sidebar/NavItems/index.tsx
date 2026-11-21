import React, { useContext } from 'react';

// import { ChildItem } from "../Sidebaritems";
import { Sidebar } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { Link, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { DashboardContext } from 'src/context/DashboardContext/DashboardContext';
import { useSelector } from 'react-redux';
import { getUnreadNotificationCount } from 'src/utils/notificationCount';

interface NavItemsProps {
  item: any;
}
const NavItems: React.FC<NavItemsProps> = ({ item }) => {
  const location = useLocation();
  const pathname = location.pathname;
  const { t } = useTranslation();

  const { setIsMobileSidebarOpen } = useContext(DashboardContext);
  const notifications = useSelector((state: any) => state.notifications?.notificationData || []);
  const unreadCount = getUnreadNotificationCount(notifications, [item.url]);

  return (
    <>
      <Sidebar.Item
        to={item.url}
        as={Link}
        onClick={() => setIsMobileSidebarOpen(false)}
        className={`${
          item.url == pathname
            ? 'text-primary bg-lightprimary rounded-full active'
            : 'text-link bg-transparent group/link '
        } `}
      >
        <span className="flex gap-3 align-center items-center">
          {item.icon ? (
            <Icon icon={item.icon} className={`${item.color}`} height={18} />
          ) : (
            <span
              className={`${
                item.url == pathname
                  ? 'dark:bg-white rounded-full mx-1.5 group-hover/link:bg-primary !bg-primary h-[6px] w-[6px]'
                  : 'h-[6px] w-[6px] bg-black/40 dark:bg-white rounded-full mx-1.5 group-hover/link:bg-primary'
              } `}
            ></span>
          )}
          <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
            <span className="max-w-36 overflow-hidden">{t(`${item.name}`)}</span>
            {unreadCount > 0 && (
              <span
                aria-label={`${unreadCount} unread notifications`}
                className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-error px-1.5 text-[10px] font-semibold leading-none text-white"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </span>
        </span>
      </Sidebar.Item>
    </>
  );
};

export default NavItems;
