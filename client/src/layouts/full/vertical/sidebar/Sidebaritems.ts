// export interface ChildItem {
//   id?: number | string;
//   name?: string;
//   icon?: any;
//   children?: ChildItem[];
//   item?: any;
//   url?: any;
//   color?: string;
//   subId:any;
// }

export interface MenuItem {
  heading?: string;
  name?: string;
  icon?: any;
  id?: number;
  to?: string;
  items?: MenuItem[];
  children?: any;
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
            name: "Qa Batch Number",
            icon: "material-symbols:batch-prediction-outline-sharp",
            id: uniqueId(),
            url: "/inventory/qc-batch",
          },
           {
            subId:5,
            name: "Production",
            icon: "fluent:production-20-filled",
            id: uniqueId(),
            url: "/inventory/production",
          },
           {
            subId:6,
            name: "Finish",
            icon: "fluent:check-20-filled",
            id: uniqueId(),
            url: "/inventory/finishing",
          },
          {
            subId:7,
            name: "Dispatch",
            icon: "mdi:disc",
            id: uniqueId(),
            url: "/inventory/dispatch",
          }
        ]
      },
    ],
  },
  {
    id: 3,
    name: "Master",
    items: [
      {
        heading: "Master",
        children: [
          {
            name: "Company",
            icon: "ix:customer",
            id: uniqueId(),
            url: "/master/company",
            subId:''
          },
          {
            name: "Supplier",
            icon: "streamline-freehand:business-product-supplier-2",
            id: uniqueId(),
            url: "/master/supplier",
            subId:''
          },
          {
            name: "Customer",
            icon: "ix:customer",
            id: uniqueId(),
            url: "/master/customer",
            subId:''
          },
           {
            name: "Category",
            icon: "material-symbols:category-outline",
            id: uniqueId(),
            url: "/master/category",
            subId:''
          },
           {
            name: "Accounts",
            icon: "material-symbols:category-outline",
            id: uniqueId(),
            url: "/master/accounts",
            subId:''
          },
          {
            name: "Packing Material",
            icon: "material-symbols:category-outline",
            id: uniqueId(),
            url: "/master/packing-material",
            subId:''
          },
          // {
          //   name: "Transport",
          //   icon: "material-symbols:category-outline",
          //   id: uniqueId(),
          //   url: "/master/transport",
          //   subId:''
          // },
          {
            name: "RM Code",
            icon: "file-icons:codeship",
            id: uniqueId(),
            url: "/master/rm-code",
            subId:''
          },
          {
            name: "Units",
            icon: "material-symbols:ac-unit-rounded",
            id: uniqueId(),
            url: "/master/unit",
            subId:''
          },
          {
            name: "Designation",
            icon: "hugeicons:manager",
            id: uniqueId(),
            url: "/master/designation",
            subId:''
          },
          {
            name: "Qualification",
            icon: "healthicons:i-exam-qualification-outline",
            id: uniqueId(),
            url: "/master/qualification",
            subId:''
          },
           {
            name: "Make Master",
            icon: "eos-icons:state",
            id: uniqueId(),
            url: "/master/make-masters",
            subId:''
          },
          {
            name: "Department Master",
            icon: "icon-park-outline:city",
            id: uniqueId(),
            url: "/master/department-masters",
            subId:''
          },
           {
            name: "Staff Master",
            icon: "icon-park-outline:file-staff",
            id: uniqueId(),
            url: "/master/staff-master",
            subId:''
          },
          {
            name: "State",
            icon: "eos-icons:state",
            id: uniqueId(),
            url: "/master/states",
            subId:''
          },
          {
            name: "City",
            icon: "icon-park-outline:city",
            id: uniqueId(),
            url: "/master/cites",
            subId:''
          },
           {
            name: "Inward ",
            icon: "fluent:arrow-move-inward-20-filled",
            id: uniqueId(),
            url: "/master/inward",
            subId:''
          }
        ],
      },
    ],
  },
];

export default SidebarContent;
