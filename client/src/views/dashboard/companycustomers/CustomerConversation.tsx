import { Icon } from '@iconify/react';

const FunnelItem = ({ title, value, width, color }: any) => (
  <div className="mb-5">
    <div className="flex justify-between mb-2">
      <span className="text-sm font-medium text-gray-700">{title}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>

    <div className="w-full bg-gray-100 rounded-full h-3">
      <div
        className={`h-3 rounded-full ${color}`}
        style={{
          width: `${Math.min(width, 100)}%`,
        }}
      />
    </div>
  </div>
);

const CustomerConversation = ({ customer }: any) => {
  const max = customer?.identifiedCompanies || 1;

  const getWidth = (value: number) => (value / max) * 100;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
          <Icon icon="solar:chart-bold" width={24} className="text-indigo-600" />
        </div>

        <div>
          <h3 className="text-xl font-semibold">Customer Conversion Funnel</h3>

          <p className="text-sm text-gray-500">
            Track customer journey from identification to purchase
          </p>
        </div>
      </div>

      <FunnelItem
        title="Identified Companies"
        value={customer?.identifiedCompanies || 0}
        width={100}
        color="bg-slate-600"
      />

      <FunnelItem
        title="Contacted"
        value={customer?.contacted || 0}
        width={getWidth(customer?.contacted || 0)}
        color="bg-blue-500"
      />

      {/* <FunnelItem
        title="Responded"
        value={customer?.responded || 0}
        width={getWidth(customer?.responded || 0)}
        color="bg-cyan-500"
      /> */}

      <FunnelItem
        title="Enquiry"
        value={customer?.enquiry || 0}
        width={getWidth(customer?.enquiry || 0)}
        color="bg-purple-500"
      />

      <FunnelItem
        title="Quotation"
        value={customer?.quotation || 0}
        width={getWidth(customer?.quotation || 0)}
        color="bg-orange-500"
      />

      <FunnelItem
        title="Sample"
        value={customer?.sample || 0}
        width={getWidth(customer?.sample || 0)}
        color="bg-yellow-500"
      />

      <FunnelItem
        title="PO"
        value={customer?.order || 0}
        width={getWidth(customer?.order || 0)}
        color="bg-green-500"
      />

      <FunnelItem
        title="Lost"
        value={customer?.lost || 0}
        width={getWidth(customer?.lost || 0)}
        color="bg-red-500"
      />
    </div>
  );
};

export default CustomerConversation;
