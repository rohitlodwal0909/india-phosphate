import { Icon } from '@iconify/react/dist/iconify.js';

const timelineData = [
  {
    date: '10-May-2026',
    title: 'Purchase Order Created',
    description: 'PO-1045 Generated',
    amount: '₹5.00 Lac',
    color: 'bg-blue-500',
    icon: 'mdi:file-document-outline',
  },
  {
    date: '12-May-2026',
    title: 'Invoice Generated',
    description: 'INV-2048',
    amount: '₹5.00 Lac',
    color: 'bg-purple-500',
    icon: 'mdi:receipt-text-outline',
  },
  {
    date: '14-May-2026',
    title: 'Material Dispatched',
    description: 'DAP - 50 MT',
    amount: '',
    color: 'bg-orange-500',
    icon: 'mdi:truck-delivery-outline',
  },
  {
    date: '18-May-2026',
    title: 'Payment Received',
    description: 'RTGS Transaction',
    amount: '₹3.00 Lac',
    color: 'bg-green-500',
    icon: 'mdi:cash-check',
  },
  {
    date: '25-May-2026',
    title: 'Payment Received',
    description: 'Balance Settlement',
    amount: '₹2.00 Lac',
    color: 'bg-green-500',
    icon: 'mdi:cash-check',
  },
];

const TransactionTimeline = () => {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-5">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Transaction Timeline</h3>

        <Icon icon="mdi:timeline-clock-outline" width={26} className="text-primary" />
      </div>

      <div className="relative">
        {timelineData.map((item, index) => (
          <div key={index} className="flex gap-4 relative pb-8">
            {/* Line */}

            {index !== timelineData.length - 1 && (
              <div className="absolute left-[18px] top-10 h-full w-[2px] bg-gray-200" />
            )}

            {/* Dot */}

            <div
              className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center text-white z-10`}
            >
              <Icon icon={item.icon} width={20} />
            </div>

            {/* Content */}

            <div className="flex-1 bg-gray-50 rounded-xl border p-4">
              <div className="flex justify-between flex-wrap gap-2">
                <h4 className="font-semibold">{item.title}</h4>

                <span className="text-xs text-gray-500">{item.date}</span>
              </div>

              <p className="text-sm text-gray-500 mt-1">{item.description}</p>

              {item.amount && (
                <div className="mt-2 font-semibold text-green-600">{item.amount}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionTimeline;
