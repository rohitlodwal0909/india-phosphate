import { Icon } from '@iconify/react/dist/iconify.js';
import FormatCurrency from './FormatCurrency';

const formatDate = (date: string) => {
  if (!date) return '-';

  return new Date(date)
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .replace(/ /g, '-');
};

const PaymentSummary = ({ summary, analytics, lastPayment }) => {
  const paymentHealthScore =
    summary?.receivedAmount + summary?.outstanding > 0
      ? Math.round(
          (summary?.receivedAmount / (summary?.receivedAmount + summary?.outstanding)) * 100,
        )
      : 100;

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

          <span className="font-semibold text-green-600">
            {FormatCurrency(summary?.receivedAmount || 0)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Outstanding</span>

          <span className="font-semibold text-orange-500">
            {' '}
            {FormatCurrency(summary?.outstanding || 0)}
          </span>
        </div>

        {/* <div className="flex justify-between">
          <span className="text-gray-500">Overdue Amount</span>

          <span className="font-semibold text-red-600">
            {' '}
            {FormatCurrency(summary?.outstanding || 0)}
          </span>
        </div> */}

        <div className="flex justify-between">
          <span className="text-gray-500">Avg Payment Days</span>

          <span className="font-semibold">{analytics?.avgPaymentCycle} days</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Last Payment</span>

          <span className="font-semibold">{formatDate(lastPayment?.payment_date)}</span>
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

          <span className="text-sm font-semibold text-green-600">{paymentHealthScore}%</span>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full"
            style={{ width: `${paymentHealthScore}%` }}
          />
        </div>

        <div className="mt-3 flex justify-between text-xs">
          <span className="text-green-600 font-medium">Good Customer</span>
        </div>
      </div>

      {/* Payment Status */}

      {/* <div className="mt-5 flex gap-2 flex-wrap">
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
      </div> */}
    </div>
  );
};

export default PaymentSummary;
