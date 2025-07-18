
export const PermissionData = [
  {
    id: '1',
    name: 'Inventory Managment',
    icons:"material-symbols:inventory-sharp",
    isCurrentUser: true,
    submodule: [
      {id:1,
        name: 'Gate Entry',
       icon: "ph:user-circle-check-thin", 
        add: false,
        view: false,
        edit: false,
        delete: false,
      },
      {
        id:2,
        name: 'Store Verification',
          icon: "basil:app-store-outline",
        add: false,
        view: false,
        edit: false,
        delete: false,
      },
      {
        id:3,
        name: 'QA/QC Inspection',
         icon: "token:qrdo",
        add: false,
        view: false,
        edit: false,
        delete: false,
      },
      {
        id:4,
        name: 'Production',
         icon: "fluent:production-20-filled",
        add: false,
        view: false,
        edit: false,
        delete: false,
      },
      {
        id:5,
        name: 'Dispatch',
         icon: "mdi:disc",
        add: false,
        view: false,
        edit: false,
        delete: false,
      },
    ],
  },
]