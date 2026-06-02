import React, { useEffect } from 'react';
import CountUp from 'react-countup';
import { Icon } from '@iconify/react';
import { useDispatch } from 'react-redux';

import { AppDispatch } from 'src/store';
import { getemployeedata } from 'src/features/dashboard/DashboardCustomerSlice';

interface CustomerDashboardProps {
  id?: number | string;
}
const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ id }) => {
  const dispatch = useDispatch<AppDispatch>();

  //   const employeedata = useSelector((state: RootState) => state.customerdashboard.employeedata);

  useEffect(() => {
    dispatch(getemployeedata(id));
  }, [dispatch]);

  /* =========================================================
      MAIN STATS
  ========================================================= */

  /* =========================================================
      PIE CHART
  ========================================================= */

  /* =========================================================
      PRODUCTIVITY CHART
  ========================================================= */

  //   const productivityData = [
  //     { name: 'Mon', task: 24 },
  //     { name: 'Tue', task: 18 },
  //     { name: 'Wed', task: 30 },
  //     { name: 'Thu', task: 22 },
  //     { name: 'Fri', task: 28 },
  //     { name: 'Sat', task: 12 },
  //   ];

  const FunnelRow = ({ label, value }: any) => (
    <div>
      <div className="flex justify-between mb-2">
        <span>{label}</span>
        <span className="font-semibold">{value}</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-blue-600 h-3 rounded-full"
          style={{ width: `${Math.min(value / 12, 100)}%` }}
        />
      </div>
    </div>
  );

  const SimpleCard = ({ title, items }: any) => (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-5">{title}</h3>

      <div className="space-y-3">
        {items.map((item: string, i: number) => (
          <div key={i} className="p-3 bg-gray-50 rounded-xl border">
            {item}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 rounded-3xl p-6 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row justify-between">
          <div>
            <h2 className="text-3xl font-bold">ABC Chemicals Pvt Ltd</h2>
            <p className="mt-2 opacity-90">Customer Since 2022 • Gujarat • Ahmedabad</p>

            <div className="flex gap-3 mt-4">
              <span className="px-3 py-1 rounded-full bg-white/20">Active Customer</span>

              <span className="px-3 py-1 rounded-full bg-green-500">Health Score 82%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5 mt-5 lg:mt-0">
            <div>
              <p className="text-sm opacity-80">FY Revenue</p>
              <h3 className="text-3xl font-bold">₹5.2 Cr</h3>
            </div>

            <div>
              <p className="text-sm opacity-80">Last Order</p>
              <h3 className="text-3xl font-bold">12 May</h3>
            </div>
          </div>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Orders"
          value={145}
          icon="solar:cart-large-bold"
          bg="bg-blue-50"
          iconbg="bg-blue-100"
          color="text-blue-600"
          border="border-blue-500"
        />

        <DashboardCard
          title="Conversion Rate"
          value="42%"
          icon="solar:chart-bold"
          bg="bg-green-50"
          iconbg="bg-green-100"
          color="text-green-600"
          border="border-green-500"
          isString
        />

        <DashboardCard
          title="Repeat Orders"
          value="72%"
          icon="solar:refresh-bold"
          bg="bg-purple-50"
          iconbg="bg-purple-100"
          color="text-purple-600"
          border="border-purple-500"
          isString
        />

        <DashboardCard
          title="Dormant Customers"
          value={210}
          icon="solar:sleeping-circle-bold"
          bg="bg-red-50"
          iconbg="bg-red-100"
          color="text-red-600"
          border="border-red-500"
        />
      </div>

      {/* FUNNEL + BUYING */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-6">Customer Conversion Funnel</h3>

          <div className="space-y-4">
            <FunnelRow label="Identified Companies" value={1200} />
            <FunnelRow label="Contacted" value={850} />
            <FunnelRow label="Responded" value={620} />
            <FunnelRow label="Enquiry" value={420} />
            <FunnelRow label="Quotation" value={280} />
            <FunnelRow label="Sample" value={180} />
            <FunnelRow label="PO" value={120} />
            <FunnelRow label="Lost" value={45} />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-6">Buying Behaviour</h3>

          <div className="grid grid-cols-2 gap-5">
            <MetricCard title="Buying Cycle" value="32 Days" icon="solar:calendar-bold" />

            <MetricCard title="Avg Order Value" value="₹8.5 L" icon="solar:wallet-money-bold" />

            <MetricCard title="Repeat Frequency" value="72%" icon="solar:refresh-bold" />

            <MetricCard title="Expected Order" value="7 Days" icon="solar:alarm-bold" />
          </div>
        </div>
      </div>

      {/* GEO ANALYTICS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <SimpleCard
          title="Country Report"
          items={['India - ₹4.2 Cr', 'UAE - ₹1.1 Cr', 'Nepal - ₹0.4 Cr']}
        />

        <SimpleCard
          title="State Report"
          items={['Gujarat - ₹2.5 Cr', 'Maharashtra - ₹1.4 Cr', 'Rajasthan - ₹0.8 Cr']}
        />

        <SimpleCard
          title="City Report"
          items={['Ahmedabad - ₹1.5 Cr', 'Mumbai - ₹1.2 Cr', 'Pune - ₹0.9 Cr']}
        />
      </div>

      {/* PRODUCT ANALYSIS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SimpleCard
          title="Product Analysis"
          items={['KCL - ₹55 L', 'NPK - ₹35 L', 'DAP - ₹25 L']}
        />

        <SimpleCard
          title="Grade Analysis"
          items={['Technical Grade - ₹50 L', 'Industrial Grade - ₹35 L', 'Pharma Grade - ₹20 L']}
        />
      </div>

      {/* ALERTS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SimpleCard
          title="Recent Alerts"
          items={['Sample Approved', 'PO Received', 'Payment Pending', 'Follow-up Due']}
        />

        <SimpleCard
          title="Pain Points"
          items={['Price Sensitive', 'Delivery Delay', 'MOQ Concern', 'Credit Requirement']}
        />
      </div>

      {/* DORMANT */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard title="Dormant Customers" value="210" icon="solar:sleeping-circle-bold" />

        <MetricCard title="Potential Revenue" value="₹8.5 Cr" icon="solar:dollar-bold" />

        <MetricCard title="Revived" value="25" icon="solar:check-circle-bold" />

        <MetricCard title="Recovery Rate" value="28%" icon="solar:graph-up-bold" />
      </div>

      {/* REVIVAL QUEUE */}
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-5">Revival Queue</h3>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Customer</th>
              <th className="text-left py-3">Days</th>
              <th className="text-left py-3">Potential</th>
              <th className="text-left py-3">Priority</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b">
              <td className="py-3">ABC Chemical</td>
              <td>120</td>
              <td>₹15 L</td>
              <td>
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded">High</span>
              </td>
            </tr>

            <tr>
              <td className="py-3">XYZ Ltd</td>
              <td>98</td>
              <td>₹8 L</td>
              <td>
                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Medium</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerDashboard;

/* =========================================================
    KPI CARD
========================================================= */

const DashboardCard = ({
  title,
  value,
  icon,
  bg,
  iconbg,
  color,
  border,
  isString = false,
}: any) => {
  return (
    <div
      className={`${bg} ${border} border-l-4 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-2">{title}</p>

          <h2 className="text-4xl font-bold text-gray-800">
            {isString ? value : <CountUp end={Number(value)} duration={2} />}
          </h2>
        </div>

        <div className={`w-16 h-16 rounded-2xl ${iconbg} flex items-center justify-center`}>
          <Icon icon={icon} width={34} className={color} />
        </div>
      </div>
    </div>
  );
};

/* =========================================================
    MINI CARD
========================================================= */

// const MiniCard = ({ title, value, icon, isString = false }: any) => {
//   return (
//     <div className="bg-white rounded-2xl shadow-md p-5 border">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm text-gray-500">{title}</p>

//           <h3 className="text-3xl font-bold text-gray-800 mt-2">
//             {isString ? value : <CountUp end={Number(value)} />}
//           </h3>
//         </div>

//         <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
//           <Icon icon={icon} width={24} className="text-primary" />
//         </div>
//       </div>
//     </div>
//   );
// };

/* =========================================================
    DIGEST CARD
========================================================= */

// const DigestCard = ({ title, status, priority }: any) => {
//   return (
//     <div className="border rounded-2xl p-4 hover:bg-gray-50 transition-all">
//       <div className="flex items-center justify-between">
//         <div>
//           <h4 className="font-semibold text-gray-800">{title}</h4>

//           <p className="text-sm text-gray-500 mt-1">Status : {status}</p>
//         </div>

//         <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
//           {priority}
//         </span>
//       </div>
//     </div>
//   );
// };

/* =========================================================
    METRIC CARD
========================================================= */

const MetricCard = ({ title, value, icon }: any) => {
  return (
    <div className="bg-gray-50 rounded-2xl p-5 border">
      <div className="flex items-center justify-between mb-3">
        <Icon icon={icon} width={28} className="text-primary" />

        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
      </div>

      <p className="text-sm text-gray-500">{title}</p>

      <h3 className="text-2xl font-bold text-gray-800 mt-2">{value}</h3>
    </div>
  );
};
