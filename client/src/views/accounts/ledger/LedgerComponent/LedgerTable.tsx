import { Icon } from '@iconify/react';
import { Button } from 'flowbite-react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { getAllAccountdata } from 'src/features/account/ledger/LedgerSlice';
import { AppDispatch } from 'src/store';

const LedgerTable = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getAllAccountdata());
  }, [dispatch]);

  const financialSummary = {
    totalDebit: 24500000,
    totalCredit: 18500000,
    outstanding: 6000000,
    totalPO: 32000000,
    totalInvoice: 28500000,
    totalCompanies: 127,
  };

  const companySummary = [
    {
      company: 'ABC Chemicals Pvt Ltd',
      debit: 4500000,
      credit: 3200000,
      balance: 1300000,
      po: 5000000,
      invoice: 4500000,
      transactions: 45,
    },
    {
      company: 'Sunrise Fertilizer',
      debit: 2800000,
      credit: 2500000,
      balance: 300000,
      po: 3000000,
      invoice: 2800000,
      transactions: 21,
    },
    {
      company: 'XYZ Agro Industries',
      debit: 5500000,
      credit: 4200000,
      balance: 1300000,
      po: 6200000,
      invoice: 5500000,
      transactions: 62,
    },
  ];

  const productSummary = [
    { product: 'DAP', amount: 12500000 },
    { product: 'NPK', amount: 9200000 },
    { product: 'SSP', amount: 6500000 },
    { product: 'Rock Phosphate', amount: 3800000 },
  ];

  const gradeSummary = [
    { grade: 'Grade A', amount: 15500000 },
    { grade: 'Grade B', amount: 8400000 },
    { grade: 'Grade C', amount: 5100000 },
  ];

  const outstandingCompanies = [
    { company: 'ABC Chemicals', amount: 1300000 },
    { company: 'XYZ Agro', amount: 1100000 },
    { company: 'Sunrise Fertilizer', amount: 750000 },
  ];

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }

    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lac`;
    }

    return `₹${amount.toLocaleString()}`;
  };

  const history = useNavigate();

  const handleView = (row) => {
    const id = row?.id || 0;
    history(`/accounts/summary/${id}`);
  };

  const SummaryCard = ({
    title,
    value,
    icon,
    color,
  }: {
    title: string;
    value: string;
    icon: string;
    color: string;
  }) => (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>

          <h2 className={`text-2xl font-bold mt-1 ${color}`}>{value}</h2>
        </div>

        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
          <Icon icon={icon} width={24} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        {/* <h2 className="text-2xl font-bold text-gray-800">Ledger Dashboard</h2> */}

        <p className="text-gray-500">Financial Overview & Purchase Analytics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4 mb-6">
        <SummaryCard
          title="Total Debit"
          value={formatCurrency(financialSummary.totalDebit)}
          color="text-red-600"
          icon="solar:wallet-money-bold"
        />

        <SummaryCard
          title="Total Credit"
          value={formatCurrency(financialSummary.totalCredit)}
          color="text-green-600"
          icon="solar:card-transfer-bold"
        />

        <SummaryCard
          title="Outstanding"
          value={formatCurrency(financialSummary.outstanding)}
          color="text-orange-500"
          icon="solar:danger-bold"
        />

        <SummaryCard
          title="Total PO"
          value={formatCurrency(financialSummary.totalPO)}
          color="text-blue-600"
          icon="solar:clipboard-check-bold"
        />

        <SummaryCard
          title="Invoice Value"
          value={formatCurrency(financialSummary.totalInvoice)}
          color="text-purple-600"
          icon="solar:bill-list-bold"
        />

        <SummaryCard
          title="Companies"
          value={financialSummary.totalCompanies.toString()}
          color="text-slate-700"
          icon="solar:buildings-bold"
        />
      </div>

      {/* PO vs Invoice */}
      <div className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <div className="flex flex-wrap justify-between gap-3 mb-5">
          <h3 className="text-lg font-semibold">PO vs Invoice Performance</h3>

          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            89% Completed
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-5">
          <div>
            <p className="text-gray-500">Total PO</p>
            <h3 className="text-2xl font-bold text-blue-600">₹3.20 Cr</h3>
          </div>

          <div>
            <p className="text-gray-500">Invoice Generated</p>
            <h3 className="text-2xl font-bold text-green-600">₹2.85 Cr</h3>
          </div>

          <div>
            <p className="text-gray-500">Pending</p>
            <h3 className="text-2xl font-bold text-red-600">₹35 Lac</h3>
          </div>
        </div>

        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-green-500" style={{ width: '89%' }} />
        </div>
      </div>

      {/* Company Financial Summary */}
      <div className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold mb-5">Company Financial Summary</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Company</th>
                <th className="p-3 text-center">PO</th>
                <th className="p-3 text-center">Invoice</th>
                <th className="p-3 text-center">Debit</th>
                <th className="p-3 text-center">Credit</th>
                <th className="p-3 text-center">Balance</th>
                <th className="p-3 text-center">Txn</th>
                <th className="p-3 text-center">View</th>
              </tr>
            </thead>

            <tbody>
              {companySummary.map((item) => (
                <tr key={item.company} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{item.company}</td>

                  <td className="text-center">{formatCurrency(item.po)}</td>

                  <td className="text-center">{formatCurrency(item.invoice)}</td>

                  <td className="text-center text-red-600">{formatCurrency(item.debit)}</td>

                  <td className="text-center text-green-600">{formatCurrency(item.credit)}</td>

                  <td className="text-center font-semibold">{formatCurrency(item.balance)}</td>

                  <td className="text-center">{item.transactions}</td>
                  <td className="text-center">
                    <Button
                      onClick={() => handleView(item)}
                      color="primary"
                      outline
                      size="xs"
                      className="text-primary bg-lightprimary hover:text-white"
                    >
                      <Icon icon="solar:eye-outline" height={18} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product & Grade */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h3 className="font-semibold text-lg mb-5">Product Wise Business</h3>

          {productSummary.map((item) => {
            const percent = (item.amount / 12500000) * 100;

            return (
              <div key={item.product} className="mb-5">
                <div className="flex justify-between mb-2">
                  <span>{item.product}</span>

                  <span className="font-medium">{formatCurrency(item.amount)}</span>
                </div>

                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${percent}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h3 className="font-semibold text-lg mb-5">Grade Wise Business</h3>

          {gradeSummary.map((item) => {
            const percent = (item.amount / 15500000) * 100;

            return (
              <div key={item.grade} className="mb-5">
                <div className="flex justify-between mb-2">
                  <span>{item.grade}</span>

                  <span className="font-medium">{formatCurrency(item.amount)}</span>
                </div>

                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: `${percent}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Outstanding Companies */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-5">Top Outstanding Companies</h3>

        {outstandingCompanies.map((item, index) => (
          <div
            key={item.company}
            className="flex justify-between items-center py-4 border-b last:border-0"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
                {index + 1}
              </div>

              <span>{item.company}</span>
            </div>

            <span className="font-bold text-red-600">{formatCurrency(item.amount)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LedgerTable;
