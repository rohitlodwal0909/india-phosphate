import { Icon } from '@iconify/react/dist/iconify.js';
import FormatCurrency from './FormatCurrency';

const BusinessAnalytics = ({ analytics }) => {
  const analyticsData = [
    {
      title: 'Average Order Value',
      value: FormatCurrency(analytics?.averageOrderValue || 0),
      icon: 'mdi:currency-inr',
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      title: 'Purchase Frequency',
      value: analytics?.purchaseFrequency,
      icon: 'mdi:calendar-refresh',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Highest Product',
      value: analytics?.highestProduct,
      icon: 'mdi:package-variant',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      title: 'Highest Invoice',
      value: FormatCurrency(analytics?.highestInvoice || 0),
      icon: 'mdi:receipt-text',
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      title: 'Avg Payment Cycle',
      value: `${analytics?.avgPaymentCycle} days`,
      icon: 'mdi:cash-clock',
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      title: 'Business Growth',
      value: analytics?.businessGrowth,
      icon: 'mdi:trending-up',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
  ];
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-5">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Business Analytics</h3>

        <Icon icon="mdi:chart-line" width={26} className="text-primary" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {analyticsData.map((item) => (
          <div key={item.title} className={`${item.bg} rounded-xl p-4 border`}>
            <div className="flex justify-between items-center mb-3">
              <Icon icon={item.icon} width={24} className={item.color} />
            </div>

            <h4 className="text-xl font-bold">{item.value}</h4>

            <p className="text-sm text-gray-500 mt-1">{item.title}</p>
          </div>
        ))}
      </div>

      {/* Bottom Insight */}

      <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border rounded-xl p-4">
        <p className="text-sm text-gray-600">
          Customer has shown consistent purchasing activity with an average order value of{' '}
          {FormatCurrency(analytics?.averageOrderValue || 0)} and a healthy payment cycle of{' '}
          {analytics?.avgPaymentCycle} days.
        </p>
      </div>
    </div>
  );
};

export default BusinessAnalytics;
