import { Icon } from "@iconify/react";

const NotPermission = () => {
  return (
     <div className="flex flex-col items-center justify-center my-20 space-y-4">
              <Icon icon="fluent:person-prohibited-20-filled" className="text-red-500" width="60" height="60" />
              <div className="text-red-600 text-xl font-bold text-center px-4">
                You do not have permission to view this table.
              </div>
              <p className="text-sm text-gray-500 text-center px-6">Please contact your administrator.</p>
            </div>
  )
}

export default NotPermission