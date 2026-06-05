import { Icon } from '@iconify/react';
import FormatCurrency from 'src/views/accounts/ledger/LedgerComponent/components/formatCurrency';

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'High':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'Medium':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    default:
      return 'bg-green-100 text-green-700 border-green-200';
  }
};

const RevivalQueue = ({ revivalQueue = [] }: any) => {
  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Revival Queue</h2>
          <p className="text-sm text-gray-500">Customers requiring immediate follow-up</p>
        </div>

        <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
          <Icon icon="solar:refresh-circle-bold" width={24} className="text-red-600" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Customer</th>

              <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                Days Since Last Order
              </th>

              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Potential Revenue</th>

              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Priority</th>
            </tr>
          </thead>

          <tbody>
            {revivalQueue?.length > 0 ? (
              revivalQueue.map((item: any, index: number) => (
                <tr key={index} className="border-t hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800">{item.company_name}</div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-700">{item.days} Days</span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="font-semibold text-emerald-600">
                      {FormatCurrency(item.potential)}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityBadge(
                        item.priority,
                      )}`}
                    >
                      {item.priority}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-10 text-gray-500">
                  No customers in revival queue
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RevivalQueue;
