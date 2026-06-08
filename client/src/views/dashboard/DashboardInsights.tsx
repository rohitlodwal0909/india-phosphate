import React from 'react';
import { Icon } from '@iconify/react';

/* ======================================================
   MAIN COMPONENT
====================================================== */

const DashboardInsights = ({ orders }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <AnalyticsCard
          title="Total Order Lift"
          value={orders?.total_orders || 0}
          subtitle="Orders processed this month"
          icon="solar:box-bold"
          bg="bg-gray-50"
          border="border-gray-300"
        />

        <AnalyticsCard
          title="Pending Orders"
          value={orders?.pending_orders || 0}
          subtitle="Waiting for dispatch"
          icon="solar:clipboard-list-bold"
          bg="bg-orange-50"
          border="border-orange-300"
        />

        {/* <AnalyticsCard
          title="Opportunity Insights"
          value={18}
          subtitle="High conversion opportunities"
          icon="solar:graph-up-bold"
          bg="bg-green-50"
          border="border-green-300"
        /> */}

        <AnalyticsCard
          title="Dispute Alerts"
          value={orders?.total_disputes || 0}
          subtitle="Urgent customer disputes"
          icon="solar:danger-triangle-bold"
          bg="bg-red-50"
          border="border-red-300"
        />
      </div>

      {/* ======================================================
          INSIGHTS SECTION
      ====================================================== */}

      {/* <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl shadow-xl border overflow-hidden">
          <div className="p-5 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Pending Order List</h2>

                <p className="text-sm text-gray-500 mt-1">Orders awaiting processing</p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center">
                <Icon icon="solar:clipboard-list-bold" width={24} className="text-orange-600" />
              </div>
            </div>
          </div>

          <div className="divide-y">
            {pendingOrders.map((item, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.customer}</h3>

                    <p className="text-sm text-gray-500">Quantity: {item.qty}</p>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border overflow-hidden">
          <div className="p-5 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Opportunity Insights</h2>

                <p className="text-sm text-gray-500 mt-1">High priority customer opportunities</p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                <Icon icon="solar:graph-up-bold" width={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="divide-y">
            {opportunityInsights.map((item, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.customer}</h3>

                    <p className="text-sm text-gray-500 mt-1">{item.opportunity}</p>
                  </div>

                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* <div className="bg-white rounded-3xl shadow-xl border overflow-hidden">
        <div className="p-5 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Dispute Alerts</h2>

              <p className="text-sm text-gray-500 mt-1">
                Urgent disputes requiring immediate action
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center">
              <Icon icon="solar:danger-triangle-bold" width={24} className="text-red-600" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Customer</th>

                <th className="p-4 text-left text-sm font-semibold text-gray-700">Issue</th>

                <th className="p-4 text-left text-sm font-semibold text-gray-700">Severity</th>

                <th className="p-4 text-left text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {disputeAlerts.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-4 font-semibold text-gray-800">{item.customer}</td>

                  <td className="p-4 text-gray-600">{item.issue}</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.severity === 'High'
                          ? 'bg-red-100 text-red-700'
                          : item.severity === 'Medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {item.severity}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  );
};

export default DashboardInsights;

/* ======================================================
   ANALYTICS CARD
====================================================== */

interface AnalyticsCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: string;
  bg: string;
  border: string;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  bg,
  border,
}) => {
  return (
    <div
      className={`rounded-3xl border ${border} ${bg} p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>

          <h2 className="text-4xl font-bold text-gray-800 mt-2">{value}</h2>

          <p className="text-xs text-gray-500 mt-2">{subtitle}</p>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-white shadow flex items-center justify-center">
          <Icon icon={icon} width={28} className="text-gray-700" />
        </div>
      </div>
    </div>
  );
};

/* ======================================================
   STATIC DATA
====================================================== */

// const pendingOrders = [
//   {
//     customer: 'ABC Chemicals',
//     qty: '120 MT',
//     status: 'Pending Dispatch',
//   },

//   {
//     customer: 'Shree Industries',
//     qty: '80 MT',
//     status: 'Approval Pending',
//   },

//   {
//     customer: 'National Traders',
//     qty: '45 MT',
//     status: 'Payment Pending',
//   },
// ];

// const opportunityInsights = [
//   {
//     customer: 'Indo Amines',
//     opportunity: 'Bulk order expansion',
//     value: '₹ 12L',
//   },

//   {
//     customer: 'Apex Minerals',
//     opportunity: 'New product onboarding',
//     value: '₹ 8L',
//   },

//   {
//     customer: 'ChemPro Ltd',
//     opportunity: 'Annual supply contract',
//     value: '₹ 18L',
//   },
// ];

// const disputeAlerts = [
//   {
//     customer: 'XYZ Chemicals',
//     issue: 'Material quality complaint',
//     severity: 'High',
//     status: 'Open',
//   },

//   {
//     customer: 'Orbit Industries',
//     issue: 'Late delivery dispute',
//     severity: 'Medium',
//     status: 'In Progress',
//   },

//   {
//     customer: 'Aashirwad Traders',
//     issue: 'Invoice mismatch',
//     severity: 'Low',
//     status: 'Pending',
//   },
// ];
