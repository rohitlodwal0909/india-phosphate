import React, { useEffect } from 'react';
// import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from 'src/store';
import { getsinglecustomer } from 'src/features/dashboard/DashboardCustomerSlice';
import CustomerCard from './CustomerCard';
import { useParams } from 'react-router';
import ProductWiseCard from './ProductWiseCard';
import GradeWiseCard from './GradeWiseCard';

interface CustomerDashboardProps {
  id?: number | string;
}
const CustomerDashboard: React.FC<CustomerDashboardProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();

  const customer = useSelector((state: RootState) => state.customerdashboard.customer);

  useEffect(() => {
    // const data = 'India Phosphate';
    dispatch(getsinglecustomer(id));
  }, [dispatch]);

  const safeParse = (data) => {
    try {
      return JSON.parse(data || '[]');
    } catch {
      return [];
    }
  };

  const addresses = safeParse(customer?.customer?.addresses);

  const city = addresses?.[0]?.city || '';
  const country = addresses?.[0]?.country || '';

  const lastOrderDate = new Date(customer?.lastOrder?.created_at);

  const daysSinceLastOrder = Math.floor(
    (Date.now() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  let status = 'Active Customer';

  if (daysSinceLastOrder > 180) {
    status = 'Dormant Customer';
  } else if (daysSinceLastOrder > 90) {
    status = 'Inactive Customer';
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-yellow-600 via-600 to-cyan-500 rounded-3xl p-6 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row justify-between">
          <div>
            <h2 className="text-3xl font-bold">{customer?.customer?.company_name}</h2>
            <p className="mt-2 opacity-90">
              Customer Since {new Date(customer?.customer?.created_at).getFullYear()} • {city} •{' '}
              {country}
            </p>

            <div className="flex gap-3 mt-4">
              <span className="px-3 py-1 rounded-full bg-white/20">{status}</span>

              {/* <span className="px-3 py-1 rounded-full bg-green-500">Health Score 82%</span> */}
            </div>
          </div>
        </div>
      </div>

      {/* KPI */}

      <CustomerCard customer={customer} />

      {/* FUNNEL + BUYING */}
      {/* <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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
      </div> */}

      {/* GEO ANALYTICS */}
      {/* <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
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
      </div> */}

      {/* PRODUCT ANALYSIS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ProductWiseCard products={customer?.productWiseData} />

        <GradeWiseCard grades={customer?.gradeWiseData} />
      </div>
    </div>
  );
};

export default CustomerDashboard;
