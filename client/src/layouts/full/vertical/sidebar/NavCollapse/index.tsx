
import  { useEffect, useState } from "react";
// import { ChildItem } from "../Sidebaritems";
import NavItems from "../NavItems";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { CustomCollapse } from "../CustomCollapse";
import React from "react";
import { useSelector } from 'react-redux';
import { getUnreadNotificationCount } from 'src/utils/notificationCount';



interface NavCollapseProps {
  item: any;
}



const NavCollapse: React.FC<NavCollapseProps> = ({ item }: any) => {
  const location = useLocation();
  const pathname = location.pathname;

  // Determine if any child matches the current path
  const activeDD = item.children.find((t: { url: string }) => t.url === pathname);
  

  const { t, i18n } = useTranslation();
  const [translatedLabel, setTranslatedLabel] = useState<string | null>(null);

  // Manage open/close state for the collapse
  const [isOpen, setIsOpen] = useState<boolean>(!!activeDD);
  const notifications = useSelector((state: any) => state.notifications?.notificationData || []);
  const collectUrls = (menuItem: any): string[] => [
    ...(menuItem.url ? [menuItem.url] : []),
    ...(menuItem.children || []).flatMap((child: any) => collectUrls(child)),
  ];
  const unreadCount = getUnreadNotificationCount(notifications, collectUrls(item));

  useEffect(() => {
    const loadTranslation = async () => {
      const label = t(`${item.name}`);
      setTranslatedLabel(label);
    
    };
    loadTranslation();
    
  }, [i18n.language, item.name, t]);

  // Toggle the collapse
  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <CustomCollapse
      label={
        <span className="flex w-full items-center justify-between gap-2">
          <span className="truncate">{translatedLabel || `${item.name}`}</span>
          {unreadCount > 0 && (
            <span
              aria-label={`${unreadCount} unread notifications`}
              className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-error px-1.5 text-[10px] font-semibold leading-none text-white"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </span>
      }
      open={isOpen}
      onClick={handleToggle}
      icon={item.icon} 
      className={
        Boolean(activeDD)
          ? "! bg-lightprimary rounded-full hover:bg-primary hover:text-white "
          : "rounded-full dark:text-white/80 hover:text-primary"
      }
    >
      {/* Render child items */}
      {item.children && (
        <div className="sidebar-dropdown">
          {item.children.map((child: any) => (
            <React.Fragment key={child.id}>
              {child.children ? (
                <NavCollapse item={child} /> // Recursive call for nested collapse
              ) : (
                <NavItems item={child} />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </CustomCollapse>
  );
};

export default NavCollapse;
