import { Icon } from '@iconify/react/dist/iconify.js';

const formatCurrency = (amount: number) => {
  amount = Number(amount || 0);

  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }

  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lac`;
  }

  return `₹${amount.toLocaleString('en-IN')}`;
};

const FinancialCards = ({ summary }) => {
  const cardData = [
    {
      title: 'Total PO Value',
      value: '₹ 0 ',
      icon: 'mdi:file-document-outline',
      bg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      border: 'border-blue-200',
    },
    {
      title: 'Invoice Value',
      value: formatCurrency(summary?.totalInvoice),
      icon: 'mdi:receipt-text-outline',
      bg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      border: 'border-purple-200',
    },
    {
      title: 'Total Debit',
      value: '₹ 0',
      icon: 'mdi:arrow-down-bold-circle',
      bg: 'bg-red-50',
      iconColor: 'text-red-600',
      border: 'border-red-200',
    },
    {
      title: 'Total Credit',
      value: formatCurrency(summary?.receivedAmount),
      icon: 'mdi:arrow-up-bold-circle',
      bg: 'bg-green-50',
      iconColor: 'text-green-600',
      border: 'border-green-200',
    },
    {
      title: 'Outstanding',
      value: formatCurrency(summary?.outstanding),
      icon: 'mdi:alert-circle-outline',
      bg: 'bg-orange-50',
      iconColor: 'text-orange-600',
      border: 'border-orange-200',
    },
    {
      title: 'Transactions',
      value: summary?.invoiceCount,
      icon: 'mdi:swap-horizontal-bold',
      bg: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
      border: 'border-cyan-200',
    },
  ];
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

export default FinancialCards;
