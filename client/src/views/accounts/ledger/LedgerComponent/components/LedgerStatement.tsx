import { Icon } from '@iconify/react/dist/iconify.js';
import FormatCurrency from './FormatCurrency';

const LedgerStatement = ({ ledger, summary }) => {
  const sortedLedger = [...(ledger || [])].sort(
    (a, b) => new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime(),
  );

  const closingBalance =
    Number(summary?.totalInvoice || 0) +
    Number(summary?.debitAmount || 0) -
    Number(summary?.receivedAmount || 0) -
    Number(summary?.creditAmount || 0);

  let runningBalance = 0;

  const ledgerWithBalance = sortedLedger.map((item) => {
    runningBalance += Number(item.debit || 0);
    runningBalance -= Number(item.credit || 0);

    return {
      ...item,
      running_balance: runningBalance,
    };
  });

  const totalDebit = ledgerWithBalance.reduce((sum, item) => sum + Number(item.debit || 0), 0);

  const totalCredit = ledgerWithBalance.reduce((sum, item) => sum + Number(item.credit || 0), 0);

  const largestTransaction =
    ledger?.length > 0
      ? Math.max(
          ...(ledger || []).map((item) =>
            Math.max(Number(item?.debit || 0), Number(item?.credit || 0)),
          ),
        )
      : 0;

  const lastPayment = (ledger || [])
    .filter((item) => item?.voucher_type === 'Receipt')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

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
          <h4 className="font-bold"> {FormatCurrency(0)}</h4>
        </div>

        <div>
          <p className="text-xs text-gray-500">Total Debit</p>
          <h4 className="font-bold text-red-600"> {FormatCurrency(totalDebit || 0)}</h4>
        </div>

        <div>
          <p className="text-xs text-gray-500">Total Credit</p>
          <h4 className="font-bold text-green-600"> {FormatCurrency(totalCredit || 0)}</h4>
        </div>

        <div>
          <p className="text-xs text-gray-500">Closing Balance</p>
          <h4 className="font-bold text-orange-600"> {FormatCurrency(closingBalance || 0)}</h4>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Voucher</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Debit</th>
              <th className="px-4 py-3 text-left">Credit</th>
              <th className="px-4 py-3 text-left">Running Balance</th>
            </tr>
          </thead>

          <tbody>
            {ledger?.map((row, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="px-4 py-4">{formatDate(row.date)}</td>{' '}
                <td className="px-4 py-4 font-semibold">{row.voucher_no}</td>
                <td className="px-4 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      row.voucher_type === 'Receipt'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {row.voucher_type}
                  </span>
                </td>{' '}
                <td className="px-4 py-4 text-red-600 font-medium">
                  {FormatCurrency(row.debit || 0)}
                </td>
                <td className="px-4 py-4 text-green-600 font-medium">
                  {FormatCurrency(row.credit || 0)}
                </td>
                <td className="px-4 py-4 font-bold text-slate-700">
                  {FormatCurrency(row.running_balance || 0)}
                </td>{' '}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-5 border-t bg-gray-50 flex flex-wrap gap-8">
        <div>
          <p className="text-xs text-gray-500">Largest Transaction</p>
          <h4 className="font-bold">{FormatCurrency(largestTransaction || 0)}</h4>
        </div>

        <div>
          <p className="text-xs text-gray-500">Last Payment</p>
          <h4 className="font-bold">{lastPayment ? formatDate(lastPayment.date) : '-'}</h4>
        </div>

        <div>
          <p className="text-xs text-gray-500">Outstanding</p>
          <h4 className="font-bold text-red-600">{FormatCurrency(summary?.outstanding || 0)}</h4>
        </div>
      </div>
    </div>
  );
};

export default LedgerStatement;
