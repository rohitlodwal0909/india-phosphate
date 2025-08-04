

import React, { useContext, useEffect } from "react";
import { Sidebar } from "flowbite-react";
import { IconSidebar } from "./IconSidebar";
import SidebarContent from "./Sidebaritems";
import NavItems from "./NavItems";
import NavCollapse from "./NavCollapse";
import SimpleBar from "simplebar-react";
import { CustomizerContext } from "src/context/CustomizerContext";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";
// import SideProfile from "./SideProfile/SideProfile";



const SidebarLayout = () => {
  const { selectedIconId, setSelectedIconId } = useContext(CustomizerContext) || {};
  
  const selectedContent = SidebarContent.find(
    (data) => data.id === selectedIconId
  );

  
  const logindata = useSelector((state: any) => state.authentication?.logindata);

const hasPermission = (subId: number) => {
  
  return logindata?.permission?.some(
    (p: any) =>
      p.role_id === logindata?.admin?.role_id &&
      p.submodule_id === subId && 
      [1,2,3,4,5,6,7].includes(p.permission_id) &&
      p.status === true // ✅ If *any one* of the 1–4 permissions is true, return true
  );
};

   const location = useLocation();
  const pathname = location.pathname;
  function findActiveUrl(narray: any, targetUrl: any) {

    for (const item of narray) {
      
      if (item.items) {

        for (const section of item.items) {
      
          if (section.children) {
            for (const child of section.children) {
              if (child.url === targetUrl) {
                return item.id; // Return the ID of the first-level object
              }
            }
          }
        }
      }
    }
    return null; // URL not found
  }
  

  useEffect(()=>{
    
    setTimeout(() => {
    const body = document.querySelector("body");
  if (body) {
    const event = document.createEvent("HTMLEvents");
    event.initEvent("DOMSubtreeModified", true, false);
    body.dispatchEvent(event);
  }
  }, 100);  
},[pathname])
  useEffect(() => {
    const result = findActiveUrl(SidebarContent, pathname);
 
    if (result) {
      setSelectedIconId(result);
    }
  }, [pathname, setSelectedIconId]);

  return (
    <>
      <div className="xl:block hidden">

        <div className="minisidebar-icon border-e border-ld bg-white dark:bg-darkgray fixed start-0 z-[1]">
          <IconSidebar />
          {/* <SideProfile /> */}
        </div>
        <Sidebar
          className="fixed menu-sidebar pt-8 bg-white dark:bg-darkgray ps-4 rtl:pe-4 rtl:ps-0"
          aria-label="Sidebar with multi-level dropdown example"
        >
          <SimpleBar className="h-[calc(100vh_-_85px)]">
            <Sidebar.Items className="pe-4 rtl:pe-0 rtl:ps-4">
              <Sidebar.ItemGroup className="sidebar-nav hide-menu ">
          {selectedContent &&
  selectedContent.items?.map((item, index) => {
       const filteredChildren = item.children?.filter((child) => {
      // If child has subId, use permission logic; otherwise, include it
      return child?.subId ? hasPermission(child.subId) : true;
    });

    // If no allowed children, skip rendering this group
    if (!filteredChildren || filteredChildren.length === 0) return null;
    return (
      <React.Fragment key={index}>
        <h5 className="text-link font-semibold text-sm caption ">
          {item.heading}
        </h5>
        {filteredChildren.map((child, index) => (
          <React.Fragment key={child.id || index}>
            {child.children ? (
              <NavCollapse item={child} />
            ) : (
              <NavItems item={child} />
            )}
          </React.Fragment>
        ))}
      </React.Fragment>
    );
  })}
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </SimpleBar>
        </Sidebar>
      </div>
    </>
  );
};

export default SidebarLayout;
