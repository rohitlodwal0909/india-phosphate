import { Icon } from '@iconify/react';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/store';
import { getCustomerledger } from 'src/features/account/ledger/LedgerSlice';
import CompanyHeader from './components/CompanyHeader';
import FinancialCards from './components/FinancialCards';
import ProductSummary from './components/ProductSummary';
import GradeSummary from './components/GradeSummary';
import InvoiceSummary from './components/InvoiceSummary';
import PaymentSummary from './components/PaymentSummary';
import InvoiceHistory from './components/InvoiceHistory';
import LedgerStatement from './components/LedgerStatement';
// import TransactionTimeline from './components/TransactionTimeline';

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

const Report = () => {
  const { id } = useParams();

  const dispatch = useDispatch<AppDispatch>();
  const customerledger = useSelector((state: RootState) => state.ledgers.customerledger);

  useEffect(() => {
    dispatch(getCustomerledger(id));
  }, [dispatch]);

  return (
    <>
      <div className="space-y-6">
        {/* Company Header */}
        <CompanyHeader company={customerledger?.customer} summary={customerledger?.summary} />

        {/* Financial Cards */}
        <FinancialCards summary={customerledger?.summary} />

        {/* Product + Grade */}
        <div className="grid lg:grid-cols-2 gap-6">
          <ProductSummary products={customerledger?.productPurchaseSummary} />
          <GradeSummary gradeWiseBusiness={customerledger?.gradeWiseBusiness} />
        </div>

        {/* PO Invoice Payment */}
        <div className="grid lg:grid-cols-3 gap-6">
          <PoSummary />
          <InvoiceSummary summary={customerledger?.summary} invoices={customerledger?.invoices} />
          <PaymentSummary />
        </div>

        {/* Analytics */}
        <BusinessAnalytics />

        {/* Timeline */}
        {/* <TransactionTimeline /> */}

        {/* Product History */}
        <ProductHistory />

        {/* PO History */}
        <PoHistory />

        {/* Invoice History */}
        <InvoiceHistory
          invoices={customerledger?.invoice_history}
          summary={customerledger?.summary}
        />

        {/* Ledger */}
        <LedgerStatement ledger={customerledger?.ledger} summary={customerledger?.summary} />
      </div>
    </>
  );
};

export default Report;
