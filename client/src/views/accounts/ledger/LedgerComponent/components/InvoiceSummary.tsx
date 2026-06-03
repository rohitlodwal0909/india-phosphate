import { Icon } from '@iconify/react';

const InvoiceSummary = ({ summary, invoices }) => {
  const formatCurrency = (amount: number = 0) => {
    amount = Number(amount);

    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }

    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lac`;
    }

    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const collectionRate =
    Number(summary?.totalInvoice || 0) > 0
      ? Math.min(
          100,
          Number(
            (
              (Number(summary?.receivedAmount || 0) / Number(summary?.totalInvoice || 0)) *
              100
            ).toFixed(1),
          ),
        )
      : 0;

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
          <span className="font-semibold">{summary?.invoiceCount || 0}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Invoice Value</span>
          <span className="font-semibold text-purple-600">
            {formatCurrency(summary?.totalInvoice)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Paid Invoice</span>
          <span className="font-semibold text-green-600">{invoices?.paidInvoice || 0}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Pending Invoice</span>
          <span className="font-semibold text-red-500">{invoices?.pendingInvoice || 0}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Last Invoice</span>
          <span className="font-semibold">{invoices?.lastInvoice?.invoice_no || 'N/A'}</span>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex justify-between mb-2">
          <p className="text-xs text-gray-500">Invoice Collection Rate</p>

          <p className="text-xs font-medium text-purple-600">{collectionRate}%</p>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="bg-purple-500 h-3 rounded-full transition-all duration-500"
            style={{
              width: `${collectionRate}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default InvoiceSummary;
