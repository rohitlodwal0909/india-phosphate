export interface ChildItem {
  id?: number | string;
  name?: string;
  icon?: any;
  children?: ChildItem[];
  item?: any;
  url?: any;
  color?: string;
  subId:any;
}

export interface MenuItem {
  heading?: string;
  name?: string;
  icon?: any;
  id?: number;
  to?: string;
  items?: MenuItem[];
  children?: ChildItem[];
  url?: any;
 
}

import { uniqueId } from "lodash";


const SidebarContent: MenuItem[] = [
  
  {
    id: 1,
    name: "Dashboard",
    items: [
      {
        heading: "Dashboard",
        children: [
          {
            name: "Dashboard",
            icon: "carbon:report",
            id: uniqueId(),
            url: "/",
            subId:''
          },
          // {
          //   name: "Permission",
          //   icon: "arcticons:permissionsmanager",
          //   id: uniqueId(),
          //   url: "/permission",
          // }
        ],
      },
    ],
  },
  // {
  //   id: 2,
  //   name: "Menu",
  //   items: [
  //     {
  //       heading: "Multi level",
  //       children: [
  //         {
  //           name: "Menu Level",
  //           icon: "solar:widget-add-line-duotone",
  //           id: uniqueId(),
  //           children: [
  //             {
  //               id: uniqueId(),
  //               name: "Level 1",
  //               url: "",
  //             },
  //             {
  //               id: uniqueId(),
  //               name: "Level 1.1",
  //               icon: "fad:armrecording",
  //               url: "",
  //               children: [
  //                 {
  //                   id: uniqueId(),
  //                   name: "Level 2",
  //                   url: "",
  //                 },
  //                 {
  //                   id: uniqueId(),
  //                   name: "Level 2.1",
  //                   icon: "fad:armrecording",
  //                   url: "",
  //                   children: [
  //                     {
  //                       id: uniqueId(),
  //                       name: "Level 3",
  //                       url: "",
  //                     },
  //                     {
  //                       id: uniqueId(),
  //                       name: "Level 3.1",
  //                       url: "",
  //                     },
  //                   ],
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       heading: "More Options",
  //       children: [
  //         {
  //           id: uniqueId(),
  //           url: "/sample-page",
  //           name: "Applications",
  //           icon: "solar:check-circle-bold",
  //           color: "text-primary",
  //         },
  //         {
  //           id: uniqueId(),
  //           url: "",
  //           name: "Form Options",
  //           icon: "solar:check-circle-bold",
  //           color: "text-secondary",
  //         },
  //         {
  //           id: uniqueId(),
  //           url: "",
  //           name: "Table Variations",
  //           icon: "solar:check-circle-bold",
  //           color: "text-info",
  //         },
  //         {
  //           id: uniqueId(),
  //           url: "",
  //           name: "Charts Selection",
  //           icon: "solar:check-circle-bold",
  //           color: "text-warning",
  //         },
  //         {
  //           id: uniqueId(),
  //           url: "",
  //           name: "Widgets",
  //           icon: "solar:check-circle-bold",
  //           color: "text-success",
  //         },
  //       ],
  //     },
  //   ],
  // },
   {
    id: 2,
    name: "inventory Managment",
    items: [
      {
        heading: "inventory Managment",
        children: [
          {
            subId:1,
            name: "Inbound Gate Entry",
            icon: "ph:user-circle-check-thin",
            id: uniqueId(),
            url: "/inventory/check-in",
          },
          {
             subId:2,
            name: "Store Verification",
            icon: "basil:app-store-outline",
            id: uniqueId(),
            url: "/inventory/store",
          },
          {
             subId:3,
            name: "QA/QC Inspection",
            icon: "token:qrdo",
            id: uniqueId(),
            url: "/inventory/qc",
          },
           {
            subId:4,
            name: "Production",
            icon: "fluent:production-20-filled",
            id: uniqueId(),
            url: "/inventory/production",
          },
          {
            subId:5,
            name: "Dispatch",
            icon: "mdi:disc",
            id: uniqueId(),
            url: "/inventory/dispatch",
          }
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Authentiction",
    items: [
      {
        heading: "Authentiction",
        children: [
          {
            name: "Login",
            icon: "solar:login-2-line-duotone",
            id: uniqueId(),
            url: "/admin/login",
            subId:''
          },
          {
            name: "Sign Up",
            icon: "solar:login-2-line-duotone",
            id: uniqueId(),
            url: "/admin/register",
            subId:''
          }
         
        ],
      },
    ],
  },
];

export default SidebarContent;
