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
import PoHistory from './components/PoHistory';
import BusinessAnalytics from './components/BusinessAnalytics';
// import TransactionTimeline from './components/TransactionTimeline';

// const PoSummary = () => {
//   return (
//     <div className="bg-white rounded-2xl border shadow-sm p-5">
//       <div className="flex justify-between items-center mb-5">
//         <h3 className="text-lg font-semibold">Purchase Order Summary</h3>

//         <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
//           <Icon icon="mdi:file-document-outline" width={24} className="text-blue-600" />
//         </div>
//       </div>

//       <div className="space-y-4">
//         <div className="flex justify-between">
//           <span className="text-gray-500">Total PO</span>
//           <span className="font-semibold">48</span>
//         </div>

//         <div className="flex justify-between">
//           <span className="text-gray-500">PO Value</span>
//           <span className="font-semibold text-blue-600">₹52.5 Lac</span>
//         </div>

//         <div className="flex justify-between">
//           <span className="text-gray-500">Open PO</span>
//           <span className="font-semibold text-orange-500">5</span>
//         </div>

//         <div className="flex justify-between">
//           <span className="text-gray-500">Closed PO</span>
//           <span className="font-semibold text-green-600">43</span>
//         </div>

//         <div className="flex justify-between">
//           <span className="text-gray-500">Last PO</span>
//           <span className="font-semibold">PO-1045</span>
//         </div>
//       </div>

//       <div className="mt-5">
//         <p className="text-xs text-gray-500 mb-2">Completion Rate</p>

//         <div className="w-full bg-gray-100 rounded-full h-3">
//           <div className="bg-green-500 h-3 rounded-full" style={{ width: '90%' }} />
//         </div>

//         <p className="text-xs text-right mt-1 text-green-600">90%</p>
//       </div>
//     </div>
//   );
// };

// const productHistory = [
//   {
//     id: 1,
//     date: '20-May-2026',
//     product: 'DAP',
//     grade: 'Grade A',
//     po: 'PO-1045',
//     invoice: 'INV-2048',
//     qty: '50 MT',
//     rate: '₹50,000',
//     amount: '₹25,00,000',
//     status: 'Delivered',
//   },
//   {
//     id: 2,
//     date: '15-May-2026',
//     product: 'SSP',
//     grade: 'Grade B',
//     po: 'PO-1041',
//     invoice: 'INV-2035',
//     qty: '30 MT',
//     rate: '₹40,000',
//     amount: '₹12,00,000',
//     status: 'Delivered',
//   },
//   {
//     id: 3,
//     date: '10-May-2026',
//     product: 'NPK',
//     grade: 'Grade C',
//     po: 'PO-1038',
//     invoice: 'INV-2028',
//     qty: '20 MT',
//     rate: '₹40,000',
//     amount: '₹8,00,000',
//     status: 'In Transit',
//   },
// ];

// const ProductHistory = () => {
//   return (
//     <div className="bg-white rounded-2xl border shadow-sm">
//       {/* Header */}

//       <div className="flex justify-between items-center p-5 border-b">
//         <div>
//           <h3 className="text-lg font-semibold">Product Purchase History</h3>

//           <p className="text-sm text-gray-500">Complete product-wise purchase records</p>
//         </div>

//         <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
//           <Icon icon="mdi:package-variant-closed" width={24} className="text-blue-600" />
//         </div>
//       </div>

//       {/* Table */}

//       <div className="overflow-x-auto">
//         <table className="w-full text-sm">
//           <thead>
//             <tr className="bg-gray-50 border-b">
//               <th className="px-4 py-3 text-left">Date</th>
//               <th className="px-4 py-3 text-left">Product</th>
//               <th className="px-4 py-3 text-left">Grade</th>
//               <th className="px-4 py-3 text-left">PO No</th>
//               <th className="px-4 py-3 text-left">Invoice</th>
//               <th className="px-4 py-3 text-left">Qty</th>
//               <th className="px-4 py-3 text-left">Rate</th>
//               <th className="px-4 py-3 text-left">Amount</th>
//               <th className="px-4 py-3 text-left">Status</th>
//             </tr>
//           </thead>

//           <tbody>
//             {productHistory.map((item) => (
//               <tr key={item.id} className="border-b hover:bg-gray-50">
//                 <td className="px-4 py-4">{item.date}</td>

//                 <td className="px-4 py-4">
//                   <div className="font-medium">{item.product}</div>
//                 </td>

//                 <td className="px-4 py-4">{item.grade}</td>

//                 <td className="px-4 py-4">{item.po}</td>

//                 <td className="px-4 py-4">{item.invoice}</td>

//                 <td className="px-4 py-4">{item.qty}</td>

//                 <td className="px-4 py-4">{item.rate}</td>

//                 <td className="px-4 py-4 font-semibold text-green-600">{item.amount}</td>

//                 <td className="px-4 py-4">
//                   <span
//                     className={`px-3 py-1 rounded-full text-xs font-medium ${
//                       item.status === 'Delivered'
//                         ? 'bg-green-100 text-green-700'
//                         : 'bg-orange-100 text-orange-700'
//                     }`}
//                   >
//                     {item.status}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Footer Stats */}

//       <div className="grid md:grid-cols-4 gap-4 p-5 border-t bg-gray-50">
//         <div>
//           <p className="text-xs text-gray-500">Total Products</p>

//           <h4 className="font-bold text-lg">4</h4>
//         </div>

//         <div>
//           <p className="text-xs text-gray-500">Total Quantity</p>

//           <h4 className="font-bold text-lg">1000 MT</h4>
//         </div>

//         <div>
//           <p className="text-xs text-gray-500">Total Purchase</p>

//           <h4 className="font-bold text-lg text-green-600">₹52.5 Lac</h4>
//         </div>

//         <div>
//           <p className="text-xs text-gray-500">Most Purchased</p>

//           <h4 className="font-bold text-lg text-blue-600">DAP</h4>
//         </div>
//       </div>
//     </div>
//   );
// };

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
        <CompanyHeader
          company={customerledger?.customer}
          summary={customerledger?.summary}
          lastPurchase={customerledger?.lastPurchase}
          lastPayment={customerledger?.lastPayment}
          analytics={customerledger?.analytics}
        />

        {/* Financial Cards */}
        <FinancialCards
          summary={customerledger?.summary}
          poHistorysD={customerledger?.purchaseOrders}
          ledger={customerledger?.ledger}
        />

        {/* Product + Grade */}
        <div className="grid lg:grid-cols-2 gap-6">
          <ProductSummary products={customerledger?.productPurchaseSummary} />
          <GradeSummary gradeWiseBusiness={customerledger?.gradeWiseBusiness} />
        </div>

        {/* PO Invoice Payment */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* <PoSummary /> */}
          <InvoiceSummary summary={customerledger?.summary} invoices={customerledger?.invoices} />
          <PaymentSummary
            summary={customerledger?.summary}
            analytics={customerledger?.analytics}
            lastPayment={customerledger?.lastPayment}
          />
        </div>

        {/* Analytics */}
        <BusinessAnalytics analytics={customerledger?.analytics} />

        {/* Timeline */}
        {/* <TransactionTimeline /> */}

        {/* Product History */}
        {/* <ProductHistory /> */}

        {/* PO History */}
        <PoHistory poHistorysD={customerledger?.purchaseOrders} />

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
