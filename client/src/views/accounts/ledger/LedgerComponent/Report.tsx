import { Badge } from 'flowbite-react';
import { Icon } from '@iconify/react';

const CompanyHeader = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col xl:flex-row xl:justify-between gap-6">
        {/* Left Section */}
        <div className="flex gap-4">
          <div className="w-16 h-16 rounded-xl bg-primary text-white flex items-center justify-center text-2xl font-bold">
            IP
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800">India Phosphate Pvt Ltd</h2>

            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
              <span>GST: 23ABCDE1234F1Z5</span>
              <span>PAN: ABCDE1234F</span>
              <span>Customer Since: Jan 2024</span>
            </div>

            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Icon icon="mdi:map-marker" />
                Indore, Madhya Pradesh
              </span>

              <span className="flex items-center gap-1">
                <Icon icon="mdi:phone" />
                +91 9876543210
              </span>

              <span className="flex items-center gap-1">
                <Icon icon="mdi:email" />
                accounts@indiaphosphate.com
              </span>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-wrap gap-3">
          <Badge color="success" size="lg">
            Active Customer
          </Badge>

          <Badge color="warning" size="lg">
            Payment Due
          </Badge>

          <Badge color="info" size="lg">
            Credit Limit ₹50 Lac
          </Badge>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 mt-6 pt-6 border-t">
        <div>
          <p className="text-gray-500 text-sm">Sales Executive</p>
          <h4 className="font-semibold">Rohit Jain</h4>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Territory</p>
          <h4 className="font-semibold">Central India</h4>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Business Potential</p>
          <h4 className="font-semibold text-green-600">High</h4>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Payment Behaviour</p>
          <h4 className="font-semibold text-orange-500">Average (18 Days)</h4>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Last Purchase</p>
          <h4 className="font-semibold">20-May-2026</h4>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Last Payment</p>
          <h4 className="font-semibold">25-May-2026</h4>
        </div>
      </div>
    </div>
  );
};

const cardData = [
  {
    title: 'Total PO Value',
    value: '₹52.5 Lac',
    icon: 'mdi:file-document-outline',
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    border: 'border-blue-200',
  },
  {
    title: 'Invoice Value',
    value: '₹48.2 Lac',
    icon: 'mdi:receipt-text-outline',
    bg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    border: 'border-purple-200',
  },
  {
    title: 'Total Debit',
    value: '₹48.2 Lac',
    icon: 'mdi:arrow-down-bold-circle',
    bg: 'bg-red-50',
    iconColor: 'text-red-600',
    border: 'border-red-200',
  },
  {
    title: 'Total Credit',
    value: '₹41.0 Lac',
    icon: 'mdi:arrow-up-bold-circle',
    bg: 'bg-green-50',
    iconColor: 'text-green-600',
    border: 'border-green-200',
  },
  {
    title: 'Outstanding',
    value: '₹7.2 Lac',
    icon: 'mdi:alert-circle-outline',
    bg: 'bg-orange-50',
    iconColor: 'text-orange-600',
    border: 'border-orange-200',
  },
  {
    title: 'Transactions',
    value: '245',
    icon: 'mdi:swap-horizontal-bold',
    bg: 'bg-cyan-50',
    iconColor: 'text-cyan-600',
    border: 'border-cyan-200',
  },
];

const FinancialCards = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {cardData.map((card) => (
        <div
          key={card.title}
          className={`rounded-2xl border ${card.border} ${card.bg} p-5 transition-all duration-300 hover:shadow-lg`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">{card.title}</p>

              <h2 className="text-2xl font-bold text-gray-800 mt-2">{card.value}</h2>
            </div>

            <div
              className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm`}
            >
              <Icon icon={card.icon} className={`${card.iconColor}`} width={24} />
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-500">Current Financial Position</div>
        </div>
      ))}
    </div>
  );
};

const productData = [
  {
    product: 'DAP',
    qty: '520 MT',
    amount: '₹25 Lac',
    lastPurchase: '20-May-2026',
    icon: 'mdi:package-variant',
  },
  {
    product: 'SSP',
    qty: '300 MT',
    amount: '₹12 Lac',
    lastPurchase: '12-May-2026',
    icon: 'mdi:package-variant-closed',
  },
  {
    product: 'NPK',
    qty: '180 MT',
    amount: '₹8 Lac',
    lastPurchase: '05-May-2026',
    icon: 'mdi:cube-outline',
  },
  {
    product: 'Rock Phosphate',
    qty: '150 MT',
    amount: '₹5 Lac',
    lastPurchase: '01-May-2026',
    icon: 'mdi:package',
  },
];

const ProductSummary = () => {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-5">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-semibold">Product Purchase Summary</h3>

        <span className="text-sm text-gray-500">Top Products</span>
      </div>

      <div className="space-y-4">
        {productData.map((item) => (
          <div
            key={item.product}
            className="flex justify-between items-center border rounded-xl p-4 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                <Icon icon={item.icon} width={22} className="text-blue-600" />
              </div>

              <div>
                <h4 className="font-medium">{item.product}</h4>

                <p className="text-xs text-gray-500">Last Purchase : {item.lastPurchase}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-semibold text-gray-800">{item.amount}</p>

              <p className="text-sm text-gray-500">{item.qty}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const gradeData = [
  {
    grade: 'Grade A',
    amount: '₹20 Lac',
    percentage: '42%',
    color: 'bg-green-500',
  },
  {
    grade: 'Grade B',
    amount: '₹15 Lac',
    percentage: '31%',
    color: 'bg-blue-500',
  },
  {
    grade: 'Grade C',
    amount: '₹8 Lac',
    percentage: '17%',
    color: 'bg-yellow-500',
  },
  {
    grade: 'Grade D',
    amount: '₹4 Lac',
    percentage: '10%',
    color: 'bg-red-500',
  },
];

const GradeSummary = () => {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-5">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-semibold">Grade Wise Business</h3>

        <Icon icon="mdi:chart-donut" width={24} className="text-primary" />
      </div>

      <div className="space-y-5">
        {gradeData.map((item) => (
          <div key={item.grade}>
            <div className="flex justify-between mb-2">
              <span className="font-medium">{item.grade}</span>

              <span className="font-semibold">{item.amount}</span>
            </div>

            <div className="w-full bg-gray-100 rounded-full h-3">
              <div
                className={`${item.color} h-3 rounded-full`}
                style={{
                  width: item.percentage,
                }}
              />
            </div>

            <div className="text-right text-xs text-gray-500 mt-1">
              {item.percentage} Contribution
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PoSummary = () => {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-5">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-semibold">Purchase Order Summary</h3>

        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
          <Icon icon="mdi:file-document-outline" width={24} className="text-blue-600" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-500">Total PO</span>
          <span className="font-semibold">48</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">PO Value</span>
          <span className="font-semibold text-blue-600">₹52.5 Lac</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Open PO</span>
          <span className="font-semibold text-orange-500">5</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Closed PO</span>
          <span className="font-semibold text-green-600">43</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Last PO</span>
          <span className="font-semibold">PO-1045</span>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs text-gray-500 mb-2">Completion Rate</p>

        <div className="w-full bg-gray-100 rounded-full h-3">
          <div className="bg-green-500 h-3 rounded-full" style={{ width: '90%' }} />
        </div>

        <p className="text-xs text-right mt-1 text-green-600">90%</p>
      </div>
    </div>
  );
};

const InvoiceSummary = () => {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-5">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-semibold">Invoice Summary</h3>

        <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
          <Icon icon="mdi:receipt-text-outline" width={24} className="text-purple-600" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-500">Total Invoice</span>

          <span className="font-semibold">44</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Invoice Value</span>

          <span className="font-semibold text-purple-600">₹48.2 Lac</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Paid Invoice</span>

          <span className="font-semibold text-green-600">38</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Pending Invoice</span>

          <span className="font-semibold text-red-500">6</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Last Invoice</span>

          <span className="font-semibold">INV-2048</span>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs text-gray-500 mb-2">Invoice Collection Rate</p>

        <div className="w-full bg-gray-100 rounded-full h-3">
          <div className="bg-purple-500 h-3 rounded-full" style={{ width: '86%' }} />
        </div>

        <p className="text-xs text-right mt-1 text-purple-600">86%</p>
      </div>
    </div>
  );
};

const PaymentSummary = () => {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-5">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-semibold">Payment Summary</h3>

        <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
          <Icon icon="mdi:cash-multiple" width={24} className="text-green-600" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-500">Total Received</span>

          <span className="font-semibold text-green-600">₹41.0 Lac</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Outstanding</span>

          <span className="font-semibold text-orange-500">₹7.2 Lac</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Overdue Amount</span>

          <span className="font-semibold text-red-600">₹2.4 Lac</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Avg Payment Days</span>

          <span className="font-semibold">18 Days</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Last Payment</span>

          <span className="font-semibold">25-May-2026</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Payment Mode</span>

          <span className="font-semibold">RTGS / NEFT</span>
        </div>
      </div>

      {/* Payment Health */}

      <div className="mt-6 border-t pt-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-500">Payment Health Score</span>

          <span className="text-sm font-semibold text-green-600">85%</span>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-3">
          <div className="bg-green-500 h-3 rounded-full" style={{ width: '85%' }} />
        </div>

        <div className="mt-3 flex justify-between text-xs">
          <span className="text-green-600 font-medium">Good Customer</span>

          <span className="text-gray-500">Pays within 15-20 Days</span>
        </div>
      </div>

      {/* Payment Status */}

      <div className="mt-5 flex gap-2 flex-wrap">
        <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
          Regular Payer
        </span>

        <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
          Credit Limit Active
        </span>

        <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
          Follow-Up Required
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-5">
        <div className="bg-green-50 rounded-xl p-3">
          <p className="text-xs text-gray-500">Received This Month</p>
          <h4 className="font-bold text-green-600">₹8.5 Lac</h4>
        </div>

        <div className="bg-red-50 rounded-xl p-3">
          <p className="text-xs text-gray-500">Overdue Invoices</p>
          <h4 className="font-bold text-red-600">3</h4>
        </div>

        <div className="bg-blue-50 rounded-xl p-3">
          <p className="text-xs text-gray-500">Credit Limit</p>
          <h4 className="font-bold text-blue-600">₹50 Lac</h4>
        </div>

        <div className="bg-orange-50 rounded-xl p-3">
          <p className="text-xs text-gray-500">Utilized</p>
          <h4 className="font-bold text-orange-600">84%</h4>
        </div>
      </div>
    </div>
  );
};

const analyticsData = [
  {
    title: 'Average Order Value',
    value: '₹1.10 Lac',
    icon: 'mdi:currency-inr',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    title: 'Purchase Frequency',
    value: '12 Days',
    icon: 'mdi:calendar-refresh',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    title: 'Highest Product',
    value: 'DAP',
    icon: 'mdi:package-variant',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    title: 'Highest Invoice',
    value: '₹8 Lac',
    icon: 'mdi:receipt-text',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  {
    title: 'Avg Payment Cycle',
    value: '18 Days',
    icon: 'mdi:cash-clock',
    color: 'text-red-600',
    bg: 'bg-red-50',
  },
  {
    title: 'Business Growth',
    value: '+22%',
    icon: 'mdi:trending-up',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
];

const BusinessAnalytics = () => {
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
          Customer has shown consistent purchasing activity with an average order value of ₹1.10 Lac
          and a healthy payment cycle of 18 days.
        </p>
      </div>
    </div>
  );
};

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

const productHistory = [
  {
    id: 1,
    date: '20-May-2026',
    product: 'DAP',
    grade: 'Grade A',
    po: 'PO-1045',
    invoice: 'INV-2048',
    qty: '50 MT',
    rate: '₹50,000',
    amount: '₹25,00,000',
    status: 'Delivered',
  },
  {
    id: 2,
    date: '15-May-2026',
    product: 'SSP',
    grade: 'Grade B',
    po: 'PO-1041',
    invoice: 'INV-2035',
    qty: '30 MT',
    rate: '₹40,000',
    amount: '₹12,00,000',
    status: 'Delivered',
  },
  {
    id: 3,
    date: '10-May-2026',
    product: 'NPK',
    grade: 'Grade C',
    po: 'PO-1038',
    invoice: 'INV-2028',
    qty: '20 MT',
    rate: '₹40,000',
    amount: '₹8,00,000',
    status: 'In Transit',
  },
];

const ProductHistory = () => {
  return (
    <div className="bg-white rounded-2xl border shadow-sm">
      {/* Header */}

      <div className="flex justify-between items-center p-5 border-b">
        <div>
          <h3 className="text-lg font-semibold">Product Purchase History</h3>

          <p className="text-sm text-gray-500">Complete product-wise purchase records</p>
        </div>

        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
          <Icon icon="mdi:package-variant-closed" width={24} className="text-blue-600" />
        </div>
      </div>

      {/* Table */}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Grade</th>
              <th className="px-4 py-3 text-left">PO No</th>
              <th className="px-4 py-3 text-left">Invoice</th>
              <th className="px-4 py-3 text-left">Qty</th>
              <th className="px-4 py-3 text-left">Rate</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {productHistory.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-4">{item.date}</td>

                <td className="px-4 py-4">
                  <div className="font-medium">{item.product}</div>
                </td>

                <td className="px-4 py-4">{item.grade}</td>

                <td className="px-4 py-4">{item.po}</td>

                <td className="px-4 py-4">{item.invoice}</td>

                <td className="px-4 py-4">{item.qty}</td>

                <td className="px-4 py-4">{item.rate}</td>

                <td className="px-4 py-4 font-semibold text-green-600">{item.amount}</td>

                <td className="px-4 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === 'Delivered'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Stats */}

      <div className="grid md:grid-cols-4 gap-4 p-5 border-t bg-gray-50">
        <div>
          <p className="text-xs text-gray-500">Total Products</p>

          <h4 className="font-bold text-lg">4</h4>
        </div>

        <div>
          <p className="text-xs text-gray-500">Total Quantity</p>

          <h4 className="font-bold text-lg">1000 MT</h4>
        </div>

        <div>
          <p className="text-xs text-gray-500">Total Purchase</p>

          <h4 className="font-bold text-lg text-green-600">₹52.5 Lac</h4>
        </div>

        <div>
          <p className="text-xs text-gray-500">Most Purchased</p>

          <h4 className="font-bold text-lg text-blue-600">DAP</h4>
        </div>
      </div>
    </div>
  );
};

const poHistoryData = [
  {
    po_no: 'PO-1045',
    date: '20-May-2026',
    product: 'DAP',
    grade: 'Grade A',
    qty: '50 MT',
    amount: '₹25,00,000',
    invoice: 'INV-2048',
    dispatch: 'Delivered',
    status: 'Closed',
  },
  {
    po_no: 'PO-1041',
    date: '15-May-2026',
    product: 'SSP',
    grade: 'Grade B',
    qty: '30 MT',
    amount: '₹12,00,000',
    invoice: 'INV-2035',
    dispatch: 'Delivered',
    status: 'Closed',
  },
  {
    po_no: 'PO-1038',
    date: '10-May-2026',
    product: 'NPK',
    grade: 'Grade C',
    qty: '20 MT',
    amount: '₹8,00,000',
    invoice: '-',
    dispatch: 'Pending',
    status: 'Open',
  },
];

const PoHistory = () => {
  return (
    <div className="bg-white rounded-2xl border shadow-sm">
      {/* Header */}

      <div className="flex justify-between items-center p-5 border-b">
        <div>
          <h3 className="text-lg font-semibold">Purchase Order History</h3>

          <p className="text-sm text-gray-500">Complete purchase order records</p>
        </div>

        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
          <Icon icon="mdi:file-document-multiple-outline" width={24} className="text-blue-600" />
        </div>
      </div>

      {/* Summary Cards */}

      <div className="grid md:grid-cols-4 gap-4 p-5 border-b bg-gray-50">
        <div>
          <p className="text-xs text-gray-500">Total PO</p>
          <h4 className="font-bold text-xl">48</h4>
        </div>

        <div>
          <p className="text-xs text-gray-500">PO Value</p>
          <h4 className="font-bold text-green-600 text-xl">₹52.5 Lac</h4>
        </div>

        <div>
          <p className="text-xs text-gray-500">Open PO</p>
          <h4 className="font-bold text-orange-500 text-xl">5</h4>
        </div>

        <div>
          <p className="text-xs text-gray-500">Closed PO</p>
          <h4 className="font-bold text-blue-600 text-xl">43</h4>
        </div>
      </div>

      {/* Table */}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b text-sm">
              <th className="px-4 py-3 text-left">PO No</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Grade</th>
              <th className="px-4 py-3 text-left">Qty</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Invoice</th>
              <th className="px-4 py-3 text-left">Dispatch</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {poHistoryData.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-50 text-sm">
                <td className="px-4 py-4 font-semibold text-blue-600">{item.po_no}</td>

                <td className="px-4 py-4">{item.date}</td>

                <td className="px-4 py-4">{item.product}</td>

                <td className="px-4 py-4">{item.grade}</td>

                <td className="px-4 py-4">{item.qty}</td>

                <td className="px-4 py-4 font-medium text-green-600">{item.amount}</td>

                <td className="px-4 py-4">{item.invoice}</td>

                <td className="px-4 py-4">
                  {item.dispatch === 'Delivered' ? (
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                      Delivered
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs">
                      Pending
                    </span>
                  )}
                </td>

                <td className="px-4 py-4">
                  {item.status === 'Closed' ? (
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
                      Closed
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs">
                      Open
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}

      <div className="p-5 border-t bg-gray-50">
        <div className="flex flex-wrap gap-8">
          <div>
            <p className="text-xs text-gray-500">Largest PO</p>
            <h4 className="font-bold">₹25 Lac</h4>
          </div>

          <div>
            <p className="text-xs text-gray-500">Avg PO Value</p>
            <h4 className="font-bold">₹1.09 Lac</h4>
          </div>

          <div>
            <p className="text-xs text-gray-500">Last PO</p>
            <h4 className="font-bold">PO-1045</h4>
          </div>

          <div>
            <p className="text-xs text-gray-500">Completion Rate</p>
            <h4 className="font-bold text-green-600">90%</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

const invoiceData = [
  {
    invoice_no: 'INV-2048',
    date: '20-May-2026',
    po_no: 'PO-1045',
    product: 'DAP',
    amount: '₹25,00,000',
    received: '₹20,00,000',
    pending: '₹5,00,000',
    due_date: '30-May-2026',
    status: 'Partial',
  },
  {
    invoice_no: 'INV-2035',
    date: '15-May-2026',
    po_no: 'PO-1041',
    product: 'SSP',
    amount: '₹12,00,000',
    received: '₹12,00,000',
    pending: '₹0',
    due_date: '25-May-2026',
    status: 'Paid',
  },
  {
    invoice_no: 'INV-2028',
    date: '10-May-2026',
    po_no: 'PO-1038',
    product: 'NPK',
    amount: '₹8,00,000',
    received: '₹0',
    pending: '₹8,00,000',
    due_date: '20-May-2026',
    status: 'Overdue',
  },
];

const InvoiceHistory = () => {
  return (
    <div className="bg-white rounded-2xl border shadow-sm">
      <div className="flex justify-between items-center p-5 border-b">
        <div>
          <h3 className="text-lg font-semibold">Invoice History</h3>
          <p className="text-sm text-gray-500">Complete invoice & collection tracking</p>
        </div>

        <Icon icon="mdi:receipt-text-multiple-outline" width={28} className="text-purple-600" />
      </div>

      <div className="grid md:grid-cols-4 gap-4 p-5 border-b bg-gray-50">
        <div>
          <p className="text-xs text-gray-500">Total Invoice</p>
          <h4 className="font-bold text-xl">44</h4>
        </div>

        <div>
          <p className="text-xs text-gray-500">Invoice Value</p>
          <h4 className="font-bold text-green-600 text-xl">₹48.2 Lac</h4>
        </div>

        <div>
          <p className="text-xs text-gray-500">Collected</p>
          <h4 className="font-bold text-blue-600 text-xl">₹41.0 Lac</h4>
        </div>

        <div>
          <p className="text-xs text-gray-500">Outstanding</p>
          <h4 className="font-bold text-red-600 text-xl">₹7.2 Lac</h4>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-4 py-3 text-left">Invoice</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">PO</th>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Invoice Amount</th>
              <th className="px-4 py-3 text-left">Received</th>
              <th className="px-4 py-3 text-left">Pending</th>
              <th className="px-4 py-3 text-left">Due Date</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {invoiceData.map((row) => (
              <tr key={row.invoice_no} className="border-b hover:bg-gray-50">
                <td className="px-4 py-4 font-semibold text-purple-600">{row.invoice_no}</td>
                <td className="px-4 py-4">{row.date}</td>
                <td className="px-4 py-4">{row.po_no}</td>
                <td className="px-4 py-4">{row.product}</td>
                <td className="px-4 py-4">{row.amount}</td>
                <td className="px-4 py-4 text-green-600 font-medium">{row.received}</td>
                <td className="px-4 py-4 text-red-600 font-medium">{row.pending}</td>
                <td className="px-4 py-4">{row.due_date}</td>
                <td className="px-4 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      row.status === 'Paid'
                        ? 'bg-green-100 text-green-700'
                        : row.status === 'Partial'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ledgerData = [
  {
    date: '10-May-2026',
    voucher: 'PO-1045',
    type: 'Purchase Order',
    product: 'DAP',
    debit: '₹25,00,000',
    credit: '-',
    balance: '₹25,00,000',
  },
  {
    date: '12-May-2026',
    voucher: 'INV-2048',
    type: 'Invoice',
    product: 'DAP',
    debit: '-',
    credit: '-',
    balance: '₹25,00,000',
  },
  {
    date: '18-May-2026',
    voucher: 'PAY-105',
    type: 'Payment',
    product: '-',
    debit: '-',
    credit: '₹20,00,000',
    balance: '₹5,00,000',
  },
  {
    date: '25-May-2026',
    voucher: 'PAY-108',
    type: 'Payment',
    product: '-',
    debit: '-',
    credit: '₹5,00,000',
    balance: '₹0',
  },
];

const LedgerStatement = () => {
  return (
    <div className="bg-white rounded-2xl border shadow-sm">
      <div className="flex justify-between items-center p-5 border-b">
        <div>
          <h3 className="text-lg font-semibold">Complete Ledger Statement</h3>

          <p className="text-sm text-gray-500">Company account running ledger</p>
        </div>

        <Icon icon="mdi:book-open-page-variant-outline" width={28} className="text-green-600" />
      </div>

      <div className="grid md:grid-cols-4 gap-4 p-5 border-b bg-gray-50">
        <div>
          <p className="text-xs text-gray-500">Opening Balance</p>
          <h4 className="font-bold">₹0</h4>
        </div>

        <div>
          <p className="text-xs text-gray-500">Total Debit</p>
          <h4 className="font-bold text-red-600">₹48.2 Lac</h4>
        </div>

        <div>
          <p className="text-xs text-gray-500">Total Credit</p>
          <h4 className="font-bold text-green-600">₹41.0 Lac</h4>
        </div>

        <div>
          <p className="text-xs text-gray-500">Closing Balance</p>
          <h4 className="font-bold text-orange-600">₹7.2 Lac</h4>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Voucher</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Debit</th>
              <th className="px-4 py-3 text-left">Credit</th>
              <th className="px-4 py-3 text-left">Running Balance</th>
            </tr>
          </thead>

          <tbody>
            {ledgerData.map((row, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="px-4 py-4">{row.date}</td>
                <td className="px-4 py-4 font-semibold">{row.voucher}</td>
                <td className="px-4 py-4">{row.type}</td>
                <td className="px-4 py-4">{row.product}</td>

                <td className="px-4 py-4 text-red-600 font-medium">{row.debit}</td>

                <td className="px-4 py-4 text-green-600 font-medium">{row.credit}</td>

                <td className="px-4 py-4 font-bold">{row.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-5 border-t bg-gray-50 flex flex-wrap gap-6">
        <div>
          <p className="text-xs text-gray-500">Largest Transaction</p>
          <h4 className="font-bold">₹25 Lac</h4>
        </div>

        <div>
          <p className="text-xs text-gray-500">Last Payment</p>
          <h4 className="font-bold">25-May-2026</h4>
        </div>

        <div>
          <p className="text-xs text-gray-500">Outstanding</p>
          <h4 className="font-bold text-red-600">₹7.2 Lac</h4>
        </div>
      </div>
    </div>
  );
};

const Report = () => {
  return (
    <>
      <div className="space-y-6">
        {/* Company Header */}
        <CompanyHeader />

        {/* Financial Cards */}
        <FinancialCards />

        {/* Product + Grade */}
        <div className="grid lg:grid-cols-2 gap-6">
          <ProductSummary />
          <GradeSummary />
        </div>

        {/* PO Invoice Payment */}
        <div className="grid lg:grid-cols-3 gap-6">
          <PoSummary />
          <InvoiceSummary />
          <PaymentSummary />
        </div>

        {/* Analytics */}
        <BusinessAnalytics />

        {/* Timeline */}
        <TransactionTimeline />

        {/* Product History */}
        <ProductHistory />

        {/* PO History */}
        <PoHistory />

        {/* Invoice History */}
        <InvoiceHistory />

        {/* Ledger */}
        <LedgerStatement />
      </div>
    </>
  );
};

export default Report;
