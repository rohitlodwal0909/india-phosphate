import { Icon } from '@iconify/react/dist/iconify.js';
import { useState } from 'react';
import { Modal } from 'flowbite-react';

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

const InvoiceHistory = ({ invoices, summary }) => {
  const groupedInvoices = Object.values(
    (invoices || []).reduce((acc: any, row: any) => {
      const invoiceId = row.id;

      if (!acc[invoiceId]) {
        acc[invoiceId] = {
          ...row,
          products: [],
          totalAmount: 0,
        };
      }

      const productName = row['InvoiceItems.Product.product_name'];
      const amount = Number(row['InvoiceItems.amount'] || 0);

      if (productName && !acc[invoiceId].products.includes(productName)) {
        acc[invoiceId].products.push(productName);
      }

      acc[invoiceId].totalAmount += amount;

      return acc;
    }, {}),
  );

  const [productModal, setProductModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
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
          <h4 className="font-bold text-xl">{formatCurrency(summary?.invoiceCount)}</h4>
        </div>

        <div>
          <p className="text-xs text-gray-500">Invoice Value</p>
          <h4 className="font-bold text-green-600 text-xl">
            {formatCurrency(summary?.totalInvoice)}
          </h4>
        </div>

        <div>
          <p className="text-xs text-gray-500">Collected</p>
          <h4 className="font-bold text-blue-600 text-xl">
            {formatCurrency(summary?.receivedAmount)}
          </h4>
        </div>

        <div>
          <p className="text-xs text-gray-500">Outstanding</p>
          <h4 className="font-bold text-red-600 text-xl">{formatCurrency(summary?.outstanding)}</h4>
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
            {groupedInvoices?.length > 0 ? (
              groupedInvoices.map((row: any) => {
                const receivedAmount = row.payment_status === 'Received' ? row.totalAmount : 0;

                const pendingAmount = row.payment_status === 'Received' ? 0 : row.totalAmount;

                const status =
                  row.payment_status === 'Received'
                    ? 'Paid'
                    : row.payment_status === 'Partial'
                      ? 'Partial'
                      : 'Pending';

                return (
                  <tr
                    key={row.id}
                    className="border-b hover:bg-slate-50 transition-all duration-200"
                  >
                    {/* Invoice */}
                    <td className="px-4 py-4">
                      <div className="font-semibold text-purple-700">{row.invoice_no}</div>

                      <div className="text-xs text-gray-500 mt-1">#{row.id}</div>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4">
                      <div className="font-medium">{row.invoice_date}</div>
                    </td>

                    {/* PO */}
                    <td className="px-4 py-4">
                      <span className="font-medium text-slate-700">
                        {row['DispatchVehicle.poentry.po_no'] || '-'}
                      </span>
                    </td>

                    {/* Products */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{row.products?.[0] || '-'}</span>

                        {row.products?.length > 1 && (
                          <button
                            onClick={() => {
                              setSelectedProducts(row.products);
                              setProductModal(true);
                            }}
                            className="text-blue-600 text-xs font-semibold hover:underline"
                          >
                            +{row.products.length - 1} More
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Invoice Amount */}
                    <td className="px-4 py-4">
                      <span className="font-bold text-slate-800">
                        {formatCurrency(row.totalAmount)}
                      </span>
                    </td>

                    {/* Received */}
                    <td className="px-4 py-4">
                      <span className="font-semibold text-green-600">
                        {formatCurrency(receivedAmount)}
                      </span>
                    </td>

                    {/* Pending */}
                    <td className="px-4 py-4">
                      <span className="font-semibold text-red-600">
                        {formatCurrency(pendingAmount)}
                      </span>
                    </td>

                    {/* Due Date */}
                    <td className="px-4 py-4">
                      <span className="text-slate-700">{row.delivery_note_date || '-'}</span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          status === 'Paid'
                            ? 'bg-green-100 text-green-700'
                            : status === 'Partial'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <Icon
                      icon="mdi:receipt-text-remove-outline"
                      width={50}
                      className="text-gray-300"
                    />

                    <h4 className="font-semibold text-gray-500">No Invoice Found</h4>

                    <p className="text-sm text-gray-400">Invoice history is not available.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <Modal show={productModal} size="lg" onClose={() => setProductModal(false)}>
          <Modal.Header>Invoice Products</Modal.Header>

          <Modal.Body>
            <div className="space-y-2">
              {selectedProducts?.map((product, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <Icon icon="mdi:package-variant" width={18} className="text-blue-600" />

                  <span>{product}</span>
                </div>
              ))}
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default InvoiceHistory;
